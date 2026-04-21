<?php

// app/Http/Controllers/ProductController.php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StockEntry;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('Products/Index', [
            'products' => $query->orderBy('name')->paginate(10),
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Form');
    }

    public function store(StoreProductRequest $request)
    {
        Product::create($request->validated());
        return redirect()->route('products.index')->with('success', 'Produto cadastrado!');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Form', ['product' => $product]);
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $product->update($request->validated());
        return redirect()->route('products.index')->with('success', 'Produto atualizado!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Produto removido.');
    }

    public function addStock(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'nullable|numeric|min:0'
        ]);

        StockEntry::create([
            'product_id' => $productId,
            'quantity' => $request->quantity,
            // AQUI ESTÁ A CORREÇÃO:
            // Se unit_cost for null, usamos 0. Assim o banco não reclama.
            'unit_cost' => $request->unit_cost ?? 0
        ]);

        return redirect()->back()->with('success', 'Estoque atualizado com sucesso!');
    }
}
