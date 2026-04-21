<?php

// app/Http/Requests/StoreGuestRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuestRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        // Pega o ID se for edição (para ignorar o unique do próprio usuário)
        $guestId = $this->route('guest') ? $this->route('guest')->id : null;

        return [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'document_type' => 'nullable|string|max:20',
            'document_number' => 'nullable|string|max:20|unique:guests,document_number,' . $this->id,
            'phone' => 'nullable|string',
            'mobile' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'address' => 'nullable|string',
            'number' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'document_number.unique' => 'Este documento já está cadastrado.',
            'required' => 'Este campo é obrigatório.'
        ];
    }
}
