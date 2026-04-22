<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->string('subdomain')->unique()->after('name'); // Adicionar após o nome
            $table->integer('port')->unique()->nullable()->after('active'); // Porta única para cada hotel
        });
    }

    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->dropColumn(['subdomain', 'port']);
        });
    }
};
