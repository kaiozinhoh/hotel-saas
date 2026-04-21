<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Força a conversão do preço para float/decimal ao recuperar do banco
    protected $fillable = ['name', 'price', 'stock', 'description']; // stock deve estar aqui

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    /**
     * Relacionamento: Um produto pode estar em VÁRIOS consumos diferentes.
     */
    public function consumptions(): HasMany
    {
        return $this->hasMany(Consumption::class);
    }

    /**
     * Scope (Filtro Personalizado):
     * Facilita buscar apenas produtos com estoque positivo.
     * Uso: Product::inStock()->get();
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }
}
