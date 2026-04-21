<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'reservation_id', 'payment_method_id',
        'amount', 'status', 'transaction_id',
        'paid_at', 'notes'
    ];

    protected $casts = [
        'paid_at' => 'date',
        'amount' => 'decimal:2'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function method()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
}
