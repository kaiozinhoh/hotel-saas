<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_hotel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->string('role')->default('reception'); // admin, reception, manager
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'hotel_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_hotel');
    }
};
