<?php

// database/migrations/xxxx_xx_xx_create_management_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabela para registrar quando você COMPRA produtos (Reposição)
        Schema::create('stock_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity'); // Quantidade comprada
            $table->decimal('unit_cost', 10, 2); // Custo unitário (para saber a margem de lucro)
            $table->string('supplier')->nullable(); // Fornecedor
            $table->timestamps();
        });

        // 2. Tabela de Despesas (O "Financeiro" e "Pagamentos" das prints)
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('description'); // Ex: Conta de Luz, Salário Recepcionista
            $table->decimal('amount', 10, 2);
            $table->string('category')->default('operacional'); // operacional, administrativo, pessoal
            $table->date('due_date'); // Data de vencimento
            $table->date('paid_at')->nullable(); // Se null, está "A Pagar". Se preenchido, "Pago".
            $table->timestamps();
        });

        // Vamos garantir que a tabela products tenha a quantidade atual
        // Se já tiver, ignore esta linha.
        if (!Schema::hasColumn('products', 'stock_quantity')) {
            Schema::table('products', function (Blueprint $table) {
                $table->integer('stock_quantity')->default(0);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('stock_entries');
    }
};
