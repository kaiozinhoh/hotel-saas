<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Http\Requests\StoreGuestRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        $query = Guest::query();

        if ($search = $request->input('search')) {
            // Removemos pontuação da busca também
            $cleanSearch = preg_replace('/\D/', '', $search);

            $query->where(function($q) use ($search, $cleanSearch) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$cleanSearch}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Guests/Index', [
            'guests' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Guests/Form');
    }

    public function store(StoreGuestRequest $request)
    {
        // 1. Validação extra de CPF (Segurança)
        $this->validateCpf($request);

        $data = $request->validated();

        // 2. Limpeza de Dados (Sanatização)
        if (!empty($data['document_number'])) {
            $data['document_number'] = preg_replace('/\D/', '', $data['document_number']);
        }

        if (!empty($data['phone'])) {
            $data['phone'] = preg_replace('/\D/', '', $data['phone']);
        }

        Guest::create($data);

        return redirect()->route('guests.index')->with('success', 'Hóspede cadastrado com sucesso!');
    }

    public function edit(Guest $guest)
    {
        return Inertia::render('Guests/Form', [
            'guest' => $guest
        ]);
    }

    public function update(StoreGuestRequest $request, Guest $guest)
    {
        // 1. Validação extra de CPF
        $this->validateCpf($request);

        $data = $request->validated();

        // 2. Limpeza no Update também
        if (!empty($data['document_number'])) {
            $data['document_number'] = preg_replace('/\D/', '', $data['document_number']);
        }

        if (!empty($data['phone'])) {
            $data['phone'] = preg_replace('/\D/', '', $data['phone']);
        }

        $guest->update($data);

        return redirect()->route('guests.index')->with('success', 'Hóspede atualizado!');
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();
        return redirect()->route('guests.index')->with('success', 'Hóspede removido.');
    }

    public function show(Guest $guest)
    {
        $guest->load(['reservations.room']);
        return Inertia::render('Guests/Show', [
            'guest' => $guest
        ]);
    }

    // --- FUNÇÃO AUXILIAR DE VALIDAÇÃO ---
    private function validateCpf(Request $request)
    {
        if ($request->document_type === 'CPF') {
            $request->validate([
                'document_number' => [
                    function ($attribute, $value, $fail) {
                        $c = preg_replace('/\D/', '', $value);
                        if (strlen($c) != 11 || preg_match("/^{$c[0]}{11}$/", $c)) {
                            return $fail('O CPF informado é inválido.');
                        }
                        for ($s = 10, $n = 0, $i = 0; $s >= 2; $n += $c[$i++] * $s--);
                        if ($c[9] != ((($n %= 11) < 2) ? 0 : 11 - $n)) {
                            return $fail('O CPF informado é inválido.');
                        }
                        for ($s = 11, $n = 0, $i = 0; $s >= 2; $n += $c[$i++] * $s--);
                        if ($c[10] != ((($n %= 11) < 2) ? 0 : 11 - $n)) {
                            return $fail('O CPF informado é inválido.');
                        }
                    },
                ],
            ]);
        }
    }
}
