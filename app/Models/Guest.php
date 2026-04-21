<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guest extends Model
{
    use HasFactory;

    // Permite que todos os campos sejam preenchidos em massa, exceto o ID
    // Isso é seguro pois validamos tudo no Request antes.
    protected $guarded = ['id'];

    /**
     * Relacionamento: Um hóspede pode ter VÁRIAS reservas.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
