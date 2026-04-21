<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            HotelSeeder::class,
            RoleSeeder::class,
            ParkingSeeder::class,
        ]);

        // Manter o usuário admin original para compatibilidade
        User::firstOrCreate(
            ['email' => 'admin@hotel.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'active' => true,
            ]
        );
    }
}
