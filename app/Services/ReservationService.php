<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Models\Product;
use App\Models\Consumption;

class ReservationService
{
    /**
     * Cria uma reserva e atualiza o status do quarto.
     */
    public function createReservation(array $data): Reservation
    {
        return DB::transaction(function () use ($data) {
            $room = Room::findOrFail($data['room_id']);

            // 1. Regra de Negócio: Quarto precisa estar disponível
            if ($room->status !== 'available') {
                throw new Exception("O quarto selecionado não está disponível no momento.");
            }

            // 2. Cálculo de Datas e Valores
            $checkIn = Carbon::parse($data['check_in']);
            $checkOut = Carbon::parse($data['check_out']);

            // Se check-in for igual check-out, cobra 1 diária (day use) ou ajusta lógica
            $days = $checkIn->diffInDays($checkOut);
            if ($days < 1) $days = 1;

            $totalAmount = $days * $room->price_per_night;

            // 3. Criar a Reserva
            $reservation = Reservation::create([
                'guest_id' => $data['guest_id'],
                'room_id' => $data['room_id'],
                'check_in' => $data['check_in'],
                'check_out' => $data['check_out'],
                'daily_price_snapshot' => $room->price_per_night, // Congela o preço atual
                'total_amount' => $totalAmount,
                'status' => 'confirmado'
            ]);

            // 4. Atualizar o Quarto para Ocupado
            $room->update(['status' => 'ocupado']);

            return $reservation;
        });
    }

    /**
     * Cancela reserva e libera o quarto.
     */
    public function cancelReservation(Reservation $reservation)
    {
        return DB::transaction(function () use ($reservation) {
            $reservation->update(['status' => 'cancelado']);

            // Libera o quarto de volta
            $reservation->room->update(['status' => 'disponível']);

            return $reservation;
        });
    }

    /**
     * Finaliza a reserva (Check-out) e marca quarto para limpeza
     */
    public function checkOut(Reservation $reservation)
    {
        return DB::transaction(function () use ($reservation) {
            $reservation->update(['status' => 'completado']);
            $reservation->room->update(['status' => 'limpeza']); // Vai para limpeza
            return $reservation;
        });
    }

    public function addConsumption(int $reservationId, int $productId, int $quantity)
    {
        return DB::transaction(function () use ($reservationId, $productId, $quantity) {
            $product = Product::findOrFail($productId);

            // 1. Validar Estoque
            if ($product->stock < $quantity) {
                throw new Exception("Estoque insuficiente para {$product->name}. Restam: {$product->stock}");
            }

            // 2. Calcular Totais
            $totalPrice = $product->price * $quantity;

            // 3. Criar Consumo (Snapshot do preço)
            $consumption = Consumption::create([
                'reservation_id' => $reservationId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'unit_price_snapshot' => $product->price,
                'total_price' => $totalPrice
            ]);

            // 4. Baixar Estoque
            $product->decrement('stock', $quantity);

            return $consumption;
        });
}


}
