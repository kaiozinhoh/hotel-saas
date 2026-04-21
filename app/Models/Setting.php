<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'hotel_name', 'logo_path', 'cnpj', 'email', 'phone', // Adicione logo_path
        'address', 'check_in_time', 'check_out_time'
    ];
}
