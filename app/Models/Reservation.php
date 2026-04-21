<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'guest_id',
        'room_id',
        'hotel_id',
        'check_in',
        'check_out',
        'total_price', // Importante: padronizado para _price
        'daily_price_snapshot', // Importante: novo campo
        'status'
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'total_price' => 'decimal:2',
        'daily_price_snapshot' => 'decimal:2',
    ];

    public function guest() { return $this->belongsTo(Guest::class); }
    public function room() { return $this->belongsTo(Room::class); }
    public function hotel() { return $this->belongsTo(Hotel::class); }

    public function payments() { return $this->hasMany(Payment::class); }
    public function consumptions() { return $this->hasMany(Consumption::class); }
    public function parkingAssignments() { return $this->hasMany(ParkingAssignment::class); }

    // Escopo para filtrar por hotel atual
    public function scopeForCurrentHotel($query)
    {
        $hotelId = session('current_hotel_id');
        if ($hotelId) {
            return $query->where('hotel_id', $hotelId);
        }
        return $query;
    }
}
