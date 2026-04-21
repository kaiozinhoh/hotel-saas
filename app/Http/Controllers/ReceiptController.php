<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf; // Importante

class ReceiptController extends Controller
{
    public function show($id)
    {
        $reservation = Reservation::with([
            'guest', 'room', 'consumptions.product',
            'payments.method', 'parkingAssignments.parkingSpace'
        ])->findOrFail($id);

        // BUSCA AS CONFIGURAÇÕES
        $setting = Setting::first();

        $pdf = Pdf::loadView('pdfs.receipt', [
            'reservation' => $reservation,
            'hotel_name' => $setting->hotel_name ?? 'Sistema Hotel',
            'hotel_logo' => $setting->logo_path ? public_path('storage/' . $setting->logo_path) : null, // Caminho físico para o PDF
            'hotel_cnpj' => $setting->cnpj,
            'hotel_address' => $setting->address,
            'hotel_phone' => $setting->phone,
            'generated_at' => now()->format('d/m/Y H:i')
        ]);

        return $pdf->stream("comprovante_{$id}.pdf");
    }
}
