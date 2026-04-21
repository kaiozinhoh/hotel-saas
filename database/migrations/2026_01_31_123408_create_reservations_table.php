<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_id')->constrained();
            $table->foreignId('room_id')->constrained();
            $table->date('check_in');
            $table->date('check_out');
            $table->decimal('daily_price_snapshot', 10, 2); // Preço congelado no momento da reserva
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('status')->default('pendente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
