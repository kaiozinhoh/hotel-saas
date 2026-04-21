<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Adicionar hotel_id às tabelas principais
        $tables = [
            'rooms',
            'guests', 
            'reservations',
            'products',
            'consumptions',
            'payments',
            'expenses',
            'stock_entries',
            'parking_spaces',
            'parking_assignments'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && !Schema::hasColumn($table, 'hotel_id')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->foreignId('hotel_id')->after('id')->nullable()->constrained()->onDelete('cascade');
                });
            }
        }

        // Criar tabela de configurações por hotel
        if (!Schema::hasTable('hotel_settings')) {
            Schema::create('hotel_settings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
                $table->string('key');
                $table->text('value')->nullable();
                $table->timestamps();

                $table->unique(['hotel_id', 'key']);
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'rooms',
            'guests',
            'reservations', 
            'products',
            'consumptions',
            'payments',
            'expenses',
            'stock_entries',
            'parking_spaces',
            'parking_assignments'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'hotel_id')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->dropForeign(['hotel_id']);
                    $table->dropColumn('hotel_id');
                });
            }
        }

        Schema::dropIfExists('hotel_settings');
    }
};
