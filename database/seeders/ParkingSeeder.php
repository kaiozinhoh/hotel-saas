<?php

namespace Database\Seeders;

use App\Models\ParkingSpace;
use Illuminate\Database\Seeder;

class ParkingSeeder extends Seeder
{
    public function run(): void
    {
        // Criar 10 vagas de carro
        for ($i = 1; $i <= 10; $i++) {
            ParkingSpace::firstOrCreate([
                'number' => 'Vaga ' . $i
            ], [
                'type' => 'car',
                'status' => 'available',
                'price_per_day' => 15.00 // Cobra R$ 15 por dia
            ]);
        }

        // Criar 2 vagas de moto
        ParkingSpace::firstOrCreate(['number' => 'M-01'], ['type' => 'motorcycle', 'price_per_day' => 10.00]);
        ParkingSpace::firstOrCreate(['number' => 'M-02'], ['type' => 'motorcycle', 'price_per_day' => 10.00]);
    }
}
