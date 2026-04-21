<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function edit()
    {
        $setting = Setting::firstOrCreate([], [
            'hotel_name' => 'Nome da Sua Pousada',
            'email' => 'contato@exemplo.com'
        ]);

        return Inertia::render('Settings/Edit', [
            'setting' => $setting
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',

            // Aumentei o max para 30 para caber a máscara se necessário, mas vamos limpar
            'cnpj' => 'nullable|string|max:30',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:500',

            // CORREÇÃO: Mudado de numeric para string (aceita "14:00")
            'check_in_time' => 'required|string',
            'check_out_time' => 'required|string',
        ]);

        $setting = Setting::first();
        $data = $validated;

        // --- LIMPEZA DE DADOS (Sanatização) ---
        // Salvar CNPJ e Telefone apenas com números
        if (!empty($data['cnpj'])) {
            $data['cnpj'] = preg_replace('/\D/', '', $data['cnpj']);
        }

        if (!empty($data['phone'])) {
            $data['phone'] = preg_replace('/\D/', '', $data['phone']);
        }
        // ----------------------------------------

        // Lógica de Upload
        if ($request->hasFile('logo')) {
            if ($setting->logo_path) {
                Storage::disk('public')->delete($setting->logo_path);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $data['logo_path'] = $path;
        }

        unset($data['logo']);

        $setting->update($data);

        return back()->with('success', 'Configurações atualizadas com sucesso!');
    }
}
