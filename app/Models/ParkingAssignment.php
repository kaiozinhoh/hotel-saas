<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParkingAssignment extends Model
{
    protected $fillable = [
        'reservation_id', 'parking_space_id',
        'vehicle_plate', 'vehicle_model',
        'started_at', 'ended_at'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function parkingSpace()
    {
        return $this->belongsTo(ParkingSpace::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
