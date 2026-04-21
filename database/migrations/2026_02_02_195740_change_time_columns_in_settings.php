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
        Schema::table('settings', function (Blueprint $table) {
            // Mudamos de decimal para string para guardar "14:00"
            $table->string('check_in_time')->default('14:00')->change();
            $table->string('check_out_time')->default('12:00')->change();
        });
    }

    public function down(): void
    {
        // Reverter é complicado pois string -> decimal pode falhar,
        // mas deixamos indicado.
        Schema::table('settings', function (Blueprint $table) {
            $table->decimal('check_in_time', 4, 2)->change();
            $table->decimal('check_out_time', 4, 2)->change();
        });
    }
};
