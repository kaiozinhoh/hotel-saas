<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::query();

        if ($search = $request->input('search')) {
            $query->where('number', 'like', "%{$search}%");
        }

        // Recupera os quartos paginados
        $rooms = $query->orderBy('number')->paginate(12);

        // --- LÓGICA DE STATUS DINÂMICO ---
        $rooms->getCollection()->transform(function ($room) {
            // 1. Manutenção/Limpeza tem prioridade
            if (in_array($room->status, ['maintenance', 'cleaning'])) {
                return $room;
            }

            // 2. Verifica ocupação HOJE
            $isOccupiedToday = $room->reservations()
                ->whereIn('status', ['confirmed', 'checked_in'])
                ->where('check_in', '<=', now()->format('Y-m-d'))
                ->where('check_out', '>', now()->format('Y-m-d'))
                ->exists();

            // 3. Status Visual
            $room->status = $isOccupiedToday ? 'occupied' : 'available';

            return $room;
        });

        return Inertia::render('Rooms/Index', [
            'rooms' => $rooms,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Rooms/Form');
    }

    public function store(StoreRoomRequest $request)
    {
        Room::create($request->validated());
        return redirect()->route('rooms.index')->with('success', 'Quarto criado com sucesso!');
    }

    public function edit(Room $room)
    {
        return Inertia::render('Rooms/Form', [
            'room' => $room
        ]);
    }

    public function update(StoreRoomRequest $request, Room $room)
    {
        $room->update($request->validated());
        return redirect()->route('rooms.index')->with('success', 'Quarto atualizado!');
    }

    public function destroy(Room $room)
    {
        // TRAVA DE SEGURANÇA:
        // Verifica se existem reservas pendentes, confirmadas ou em andamento (check_out futuro)
        $hasActiveReservations = $room->reservations()
            ->where('status', '!=', 'cancelled')
            ->where('status', '!=', 'completed')
            ->where('check_out', '>=', now())
            ->exists();

        if ($hasActiveReservations) {
            return back()->with('error', 'Não é possível excluir este quarto pois existem reservas ativas ou futuras vinculadas a ele.');
        }

        $room->delete();
        return redirect()->route('rooms.index')->with('success', 'Quarto removido.');
    }
}
