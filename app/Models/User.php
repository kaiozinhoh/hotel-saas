<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
        ];
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    // Helper para verificar se é Admin ou tem papel X
    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    // Helper para verificar permissão específica
    public function hasPermission($permission)
    {
        // Se for admin, tem tudo (opcional, mas comum em SaaS)
        if ($this->hasRole('admin')) {
            return true;
        }

        return $this->roles()->whereHas('permissions', function ($query) use ($permission) {
            $query->where('name', $permission);
        })->exists();
    }

    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(Hotel::class, 'user_hotel')
            ->withPivot('role', 'active')
            ->withTimestamps();
    }

    public function activeHotels()
    {
        return $this->hotels()->wherePivot('active', true)->where('active', true);
    }

    public function getCurrentHotel()
    {
        return $this->hotels()->where('id', session('current_hotel_id'))->first();
    }

    public function switchHotel($hotelId)
    {
        $hotel = $this->activeHotels()->find($hotelId);
        if ($hotel) {
            session(['current_hotel_id' => $hotelId]);
            return true;
        }
        return false;
    }
}
