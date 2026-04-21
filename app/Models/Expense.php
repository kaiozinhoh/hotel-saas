<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = ['description', 'amount', 'category', 'due_date', 'paid_at'];

    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'date',
    ];
}
