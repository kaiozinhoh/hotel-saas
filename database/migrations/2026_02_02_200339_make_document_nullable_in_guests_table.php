<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            // Permite que a coluna antiga 'document' fique vazia
            // Assim o erro de "Default Value" some
            $table->string('document')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            // Se precisar reverter (cuidado, pode dar erro se tiver nulos)
            // $table->string('document')->nullable(false)->change();
        });
    }
};
