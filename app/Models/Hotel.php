<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Hotel extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'description',
        'logo',
        'rooms_count',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'rooms_count' => 'integer',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_hotel')
            ->withPivot('role', 'active')
            ->withTimestamps();
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function reservations()
    {
        return $this->hasManyThrough(Reservation::class, Room::class);
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function settings()
    {
        return $this->hasMany(Setting::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
