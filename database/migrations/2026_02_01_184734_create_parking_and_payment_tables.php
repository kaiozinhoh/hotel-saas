<?php

// database/migrations/xxxx_xx_xx_create_parking_and_payment_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --- A. ESTACIONAMENTO ---

        // 1. Vagas de Estacionamento (O "Mapa" do estacionamento)
        Schema::create('parking_spaces', function (Blueprint $table) {
            $table->id();
            $table->string('number'); // Ex: "A-01", "102"
            $table->string('type')->default('car'); // car, motorcycle, bus
            $table->string('status')->default('available'); // available, occupied, maintenance
            $table->decimal('price_per_day', 10, 2)->default(0.00); // Se for cobrado
            $table->timestamps();
        });

        // 2. Ocupação de Vagas (Quem está na vaga agora?)
        Schema::create('parking_assignments', function (Blueprint $table) {
            $table->id();
            // Liga à reserva (se a reserva for cancelada, libera a vaga)
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            // Liga à vaga
            $table->foreignId('parking_space_id')->constrained()->onDelete('cascade');

            $table->string('vehicle_plate')->nullable();
            $table->string('vehicle_model')->nullable();

            $table->dateTime('started_at');
            $table->dateTime('ended_at');

            $table->timestamps();
        });

        // --- B. PAGAMENTOS ---

        // 3. Métodos de Pagamento (Flexibilidade para o SaaS)
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ex: Cartão de Crédito, PIX, Dinheiro
            $table->string('slug')->unique(); // ex: credit_card, pix
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // 4. Pagamentos Reais (O registro financeiro seguro)
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade'); // Pagamento de qual reserva?

            // Se deletar o método de pagamento, não apaga o histórico financeiro (set null)
            $table->foreignId('payment_method_id')->nullable()->constrained()->onDelete('set null');

            $table->decimal('amount', 10, 2); // Valor pago
            $table->string('status')->default('pending'); // pending, paid, failed, refunded
            $table->string('transaction_id')->nullable(); // ID do gateway (Stripe, MP) ou comprovante
            $table->date('paid_at')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });

        // --- C. CARGA INICIAL DE DADOS (SEEDS LEVES) ---
        // Vamos inserir alguns métodos de pagamento padrão para não começar vazio
        DB::table('payment_methods')->insert([
            ['name' => 'Dinheiro', 'slug' => 'cash', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'PIX', 'slug' => 'pix', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cartão de Crédito', 'slug' => 'credit_card', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cartão de Débito', 'slug' => 'debit_card', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('parking_assignments');
        Schema::dropIfExists('parking_spaces');
    }
};
