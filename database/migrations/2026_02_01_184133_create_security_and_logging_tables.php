<?php

// database/migrations/xxxx_xx_xx_create_security_and_logging_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Roles (Papéis: Admin, Recepcionista, etc)
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // ex: 'admin', 'receptionist'
            $table->string('label')->nullable(); // ex: 'Administrador'
            $table->timestamps();
        });

        // 2. Permissions (O que pode fazer: 'create_reservation', 'view_reports')
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('label')->nullable();
            $table->timestamps();
        });

        // 3. Pivot: Role <-> Permission
        Schema::create('permission_role', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->primary(['role_id', 'permission_id']);
        });

        // 4. Pivot: User <-> Role (Um usuário pode ter vários papéis)
        Schema::create('role_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->primary(['user_id', 'role_id']);
        });

        // 5. Audit Logs (Rastreabilidade total)
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Quem fez?
            $table->string('action'); // ex: 'created', 'updated', 'deleted', 'check-in'
            $table->string('model_type')->nullable(); // ex: 'App\Models\Reservation'
            $table->unsignedBigInteger('model_id')->nullable(); // ID do registro afetado
            $table->json('changes')->nullable(); // O que mudou? { "old": "X", "new": "Y" }
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
