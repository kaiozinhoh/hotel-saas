<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        // Criar Super Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@saas.com'],
            [
                'name' => 'Super Administrador',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
                'active' => true,
            ]
        );

        // Criar hotéis de exemplo
        $hotels = [
            [
                'name' => 'Hotel Paradise',
                'email' => 'contato@paradise.com',
                'phone' => '(11) 99999-9999',
                'address' => 'Rua das Flores, 123',
                'city' => 'São Paulo',
                'state' => 'SP',
                'postal_code' => '01234-567',
                'country' => 'Brasil',
                'description' => 'Hotel de luxo com vista para a cidade.',
                'rooms_count' => 50,
                'active' => true,
            ],
            [
                'name' => 'Hotel Beira Mar',
                'email' => 'contato@beiramar.com',
                'phone' => '(21) 88888-8888',
                'address' => 'Avenida Atlântica, 456',
                'city' => 'Rio de Janeiro',
                'state' => 'RJ',
                'postal_code' => '87654-321',
                'country' => 'Brasil',
                'description' => 'Hotel à beira-mar com piscinas incríveis.',
                'rooms_count' => 30,
                'active' => true,
            ],
        ];

        foreach ($hotels as $hotelData) {
            $hotel = Hotel::create($hotelData);
            
            // Associar Super Admin a todos os hotéis
            $hotel->users()->attach($superAdmin->id, [
                'role' => 'admin',
                'active' => true,
            ]);
        }

        // Criar usuário admin de hotel
        $hotelAdmin = User::firstOrCreate(
            ['email' => 'admin@hotel.com'],
            [
                'name' => 'Administrador do Hotel',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'active' => true,
            ]
        );

        // Associar ao primeiro hotel
        $firstHotel = Hotel::first();
        if ($firstHotel) {
            $firstHotel->users()->attach($hotelAdmin->id, [
                'role' => 'admin',
                'active' => true,
            ]);
        }

        // Criar usuário de recepção
        $receptionUser = User::firstOrCreate(
            ['email' => 'reception@hotel.com'],
            [
                'name' => 'Recepcionista',
                'password' => bcrypt('password'),
                'role' => 'reception',
                'active' => true,
            ]
        );

        // Associar ao primeiro hotel
        if ($firstHotel) {
            $firstHotel->users()->attach($receptionUser->id, [
                'role' => 'reception',
                'active' => true,
            ]);
        }
    }
}
