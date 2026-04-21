<?php

namespace App\Http\Controllers;

use App\Models\Consumption;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConsumptionController extends Controller
{
    public function store(Request $request, $reservationId)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:100'
        ]);

        DB::transaction(function () use ($request, $reservationId) {
            $product = Product::findOrFail($request->product_id);

            // Cria consumo com preço congelado no momento da venda
            Consumption::create([
                'reservation_id' => $reservationId,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'unit_price' => $product->price,
                'total_price' => $product->price * $request->quantity,
                'created_at' => now()
            ]);

            // Baixa estoque (permitindo negativo para não travar operação)
            $product->decrement('stock', $request->quantity);
        });

        return redirect()->back()->with('success', 'Item adicionado à conta.');
    }

    public function destroy($id)
    {
        $consumption = Consumption::findOrFail($id);

        DB::transaction(function () use ($consumption) {
            // Estorna estoque
            $consumption->product->increment('stock', $consumption->quantity);
            // Remove registro
            $consumption->delete();
        });

        return redirect()->back()->with('success', 'Item removido e estoque estornado.');
    }
}
