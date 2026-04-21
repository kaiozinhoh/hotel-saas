<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParkingSpace extends Model
{
    protected $fillable = ['number', 'type', 'status', 'price_per_day'];

    // Escopo para buscar apenas vagas livres facilmente
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function assignments()
    {
        return $this->hasMany(ParkingAssignment::class);
    }
}
