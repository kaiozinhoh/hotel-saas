<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockEntry extends Model
{
    protected $fillable = ['product_id', 'quantity', 'unit_cost', 'supplier'];

    // Lógica mágica que roda ao criar uma entrada
    protected static function booted()
    {
        static::created(function ($entry) {
            // Soma na coluna 'stock' do produto
            $entry->product->increment('stock', $entry->quantity);
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
