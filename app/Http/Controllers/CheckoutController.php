<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Payment;
use App\Models\Room;
use App\Models\ParkingSpace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(Request $request, $reservationId)
    {
        $request->validate([
            'payment_method_id' => 'required|exists:payment_methods,id',
            'amount_paid' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($request, $reservationId) {
            $reservation = Reservation::with('room', 'parkingAssignments')->findOrFail($reservationId);

            // 1. Registra o Pagamento Final (se houver valor)
            if ($request->amount_paid > 0) {
                Payment::create([
                    'reservation_id' => $reservation->id,
                    'payment_method_id' => $request->payment_method_id,
                    'amount' => $request->amount_paid,
                    'status' => 'paid',
                    'paid_at' => now(),
                    'notes' => 'Pagamento no Check-out. ' . ($request->notes ?? '')
                ]);
            }

            // 2. Atualiza a Reserva para "Concluída"
            $reservation->update(['status' => 'completed']);

            // 3. Libera o Quarto (Define status para Limpeza)
            if ($reservation->room) {
                // 'maintenance' ou 'cleaning' bloqueia o quarto na listagem até a camareira liberar
                $reservation->room->update(['status' => 'maintenance']);
            }

            // 4. Libera o Estacionamento (Se tiver)
            foreach ($reservation->parkingAssignments as $assignment) {
                if ($assignment->parkingSpace) {
                    $assignment->parkingSpace->update(['status' => 'available']);
                }
            }

            return redirect()->route('reservations.index')
                ->with('success', 'Check-out realizado com sucesso!');
        });
    }
}
