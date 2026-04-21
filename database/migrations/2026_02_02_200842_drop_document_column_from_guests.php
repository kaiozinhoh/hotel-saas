<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. (Opcional) Migrar dados antigos para a coluna nova antes de apagar
        // Isso garante que se tiver algum dado na coluna 'document', ele vai para 'document_number'
        DB::statement("UPDATE guests SET document_number = document WHERE document_number IS NULL AND document IS NOT NULL");

        // 2. Apagar a coluna antiga
        Schema::table('guests', function (Blueprint $table) {
            $table->dropColumn('document');
        });
    }

    public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->string('document')->nullable();
        });
    }
};
