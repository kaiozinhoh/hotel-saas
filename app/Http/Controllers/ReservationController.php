<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Guest;
use App\Models\Room;
use App\Models\Product;
use App\Models\ParkingSpace;
use App\Models\ParkingAssignment;
use App\Models\Payment;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['guest', 'room']);

        // Filtros
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        if ($dateStart = $request->input('date_start')) {
            $query->whereDate('check_in', '>=', $dateStart);
        }

        if ($dateEnd = $request->input('date_end')) {
            $query->whereDate('check_in', '<=', $dateEnd);
        }

        if ($search = $request->input('search')) {
            $query->whereHas('guest', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Reservations/Index', [
            'reservations' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['status', 'date_start', 'date_end', 'search']),
        ]);
    }

    public function create(Request $request)
    {
        // 1. Busca dados auxiliares
        $guests = Guest::orderBy('name')->get();
        $paymentMethods = PaymentMethod::all();
        $parkingSpaces = ParkingSpace::all();

        // 2. Lógica de Filtro de Quartos
        $query = Room::query();

        $parkingQuery = ParkingSpace::query();

        // Se o usuário informou datas, filtramos os ocupados
        if ($request->filled('check_in') && $request->filled('check_out')) {
            $checkIn = $request->check_in;
            $checkOut = $request->check_out;

            $parkingQuery->whereDoesntHave('assignments', function ($q) use ($checkIn, $checkOut) {
                $q->whereHas('reservation', function($r) {
                    $r->where('status', '!=', 'cancelled');
                })
                ->where(function ($query) use ($checkIn, $checkOut) {
                    $query->where('started_at', '<', $checkOut)
                        ->where('ended_at', '>', $checkIn);
                });
            });


            // Regra de Ouro da Colisão de Datas:
            $query->whereDoesntHave('reservations', function ($q) use ($checkIn, $checkOut) {
                $q->where('status', '!=', 'cancelled')
                  ->where(function ($query) use ($checkIn, $checkOut) {
                      $query->where('check_in', '<', $checkOut)
                            ->where('check_out', '>', $checkIn);
                  });
            });
        }

        $parkingSpaces = $parkingQuery->get();

        $rooms = $query->orderBy('number')->get();

        return Inertia::render('Reservations/Create', [
            'guests' => $guests,
            'rooms' => $rooms,
            'parkingSpaces' => $parkingSpaces,
            'paymentMethods' => $paymentMethods,
            'filters' => $request->only(['check_in', 'check_out'])
        ]);


    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'total_price' => 'required|numeric|min:0',
            'parking_space_id' => 'nullable|exists:parking_spaces,id',
            'initial_payment' => 'nullable|numeric|min:0',
            'payment_method_id' => 'nullable|required_with:initial_payment|exists:payment_methods,id'
        ]);

        if (!empty($request->parking_space_id)) {
            $hasConflict = ParkingAssignment::where('parking_space_id', $request->parking_space_id)
                ->whereHas('reservation', function($q) {
                    $q->where('status', '!=', 'cancelled');
                })
                ->where(function ($query) use ($request) {
                    $query->where('started_at', '<', $request->check_out)
                        ->where('ended_at', '>', $request->check_in);
                })
                ->exists();

            if ($hasConflict) {
                return back()->withErrors(['parking_space_id' => 'Esta vaga já está ocupada nas datas selecionadas.']);
            }
        }

        DB::transaction(function () use ($validated) {
            $room = Room::findOrFail($validated['room_id']);

            // 1. Cria a Reserva
            $reservation = Reservation::create([
                'guest_id' => $validated['guest_id'],
                'room_id' => $validated['room_id'],
                'check_in' => $validated['check_in'],
                'check_out' => $validated['check_out'],
                'total_price' => $validated['total_price'],
                'daily_price_snapshot' => $room->price_per_night,
                'status' => 'confirmed'
            ]);

            // OBS: Não mudamos o status do quarto para 'occupied' aqui.
            // A lógica dinâmica de datas cuida da exibição.

            // 3. Vincula Estacionamento
            if (!empty($validated['parking_space_id'])) {
                ParkingAssignment::create([
                    'reservation_id' => $reservation->id,
                    'parking_space_id' => $validated['parking_space_id'],
                    'started_at' => $validated['check_in'],
                    'ended_at' => $validated['check_out'],
                ]);
            }

            // 4. Lança Pagamento Inicial
            if (!empty($validated['initial_payment']) && $validated['initial_payment'] > 0) {
                Payment::create([
                    'reservation_id' => $reservation->id,
                    'payment_method_id' => $validated['payment_method_id'],
                    'amount' => $validated['initial_payment'],
                    'status' => 'paid',
                    'paid_at' => now(),
                    'notes' => 'Pagamento inicial no check-in'
                ]);
            }
        });

        return redirect()->route('reservations.index')->with('success', 'Reserva criada com sucesso!');
    }

    public function show(Reservation $reservation)
    {
        $reservation->load(['guest', 'room', 'consumptions.product', 'payments', 'parkingAssignments.parkingSpace']);

        return Inertia::render('Reservations/Show', [
            'reservation' => $reservation,
            'products' => Product::orderBy('name')->get(),
            'paymentMethods' => PaymentMethod::where('active', true)->get()
        ]);
    }

    public function cancel(Reservation $reservation)
    {
        DB::transaction(function () use ($reservation) {
            // 1. Atualiza Reserva
            $reservation->update(['status' => 'cancelled']);


            $reservation->payments()->where('status', 'paid')->update([
                'status' => 'cancelled',
                'notes' => DB::raw("CONCAT(COALESCE(notes, ''), ' [Cancelado]')")
            ]);

            // 3. Libera status visual do quarto (caso esteja marcado como occupied hoje)
            if ($reservation->room) {
                $reservation->room->update(['status' => 'available']);
            }

            // 4. Libera vagas de estacionamento
            foreach ($reservation->parkingAssignments as $assignment) {
                if($assignment->parkingSpace) {
                    $assignment->parkingSpace->update(['status' => 'available']);
                }
            }
        });

        return back()->with('success', 'Reserva cancelada e pagamentos estornados.');
    }
}
