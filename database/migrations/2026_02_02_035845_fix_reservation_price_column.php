<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Cenário 1: Você tem 'total_amount' (padrão antigo)
            if (Schema::hasColumn('reservations', 'total_amount')) {
                $table->renameColumn('total_amount', 'total_price');
            }
            // Cenário 2: Você não tem nenhuma das duas (improvável, mas seguro)
            elseif (!Schema::hasColumn('reservations', 'total_price')) {
                $table->decimal('total_price', 10, 2)->default(0);
            }
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            if (Schema::hasColumn('reservations', 'total_price')) {
                $table->renameColumn('total_price', 'total_amount');
            }
        });
    }
};
