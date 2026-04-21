<?php

// database/migrations/xxxx_xx_xx_add_details_to_guests_table.php

// database/migrations/xxxx_xx_xx_add_details_to_guests_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guests', function (Blueprint $table) {

            // DOCUMENTOS (Verifica se já existe antes de criar)
            if (!Schema::hasColumn('guests', 'document_type')) {
                $table->string('document_type')->default('CPF')->after('id');
            }

            if (!Schema::hasColumn('guests', 'document_number')) {
                $table->string('document_number')->nullable()->index()->after('document_type');
            }

            // CONTATO (O erro deu aqui, então vamos pular se já existir)
            if (!Schema::hasColumn('guests', 'phone')) {
                $table->string('phone')->nullable()->after('name');
            }

            if (!Schema::hasColumn('guests', 'mobile')) {
                $table->string('mobile')->nullable()->after('phone'); // Celular / WhatsApp
            }

            // ENDEREÇO
            if (!Schema::hasColumn('guests', 'zip_code')) {
                $table->string('zip_code')->nullable();
                $table->string('address')->nullable();
                $table->string('number')->nullable();
                $table->string('city')->nullable();
                $table->string('state')->nullable();
                $table->string('country')->default('Brasil');
            }

            // EXTRAS
            if (!Schema::hasColumn('guests', 'notes')) {
                $table->text('notes')->nullable();
            }
        });
    }

    public function down(): void
    {
        // No down, removemos apenas o que criamos (seguro para não apagar dados antigos)
        Schema::table('guests', function (Blueprint $table) {
            $columns = ['document_type', 'document_number', 'mobile', 'zip_code', 'address', 'notes'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('guests', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
