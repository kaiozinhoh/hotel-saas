<?php

// app/Http/Requests/StoreReservationRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'guest_id' => ['required', 'exists:guests,id'],
            'room_id' => ['required', 'exists:rooms,id'],
            'check_in' => ['required', 'date', 'after_or_equal:today'],
            'check_out' => ['required', 'date', 'after:check_in'], // Garante que sai depois de entrar
        ];
    }

    public function messages()
    {
        return [
            'check_out.after' => 'A data de saída deve ser posterior à data de entrada.',
            'room_id.exists' => 'Quarto inválido.',
        ];
    }
}
