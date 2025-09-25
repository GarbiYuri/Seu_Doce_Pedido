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
        // O método up() torna os campos obrigatórios (NOT NULL)
        Schema::table('enderecos', function (Blueprint $table) {
            // A função ->nullable(false) remove a permissão para ser nulo.
            $table->string('cep')->nullable(false)->change();
            $table->string('rua')->nullable(false)->change();
            $table->string('numero')->nullable(false)->change();
            $table->string('bairro')->nullable(false)->change();
            $table->string('cidade')->nullable(false)->change();
            $table->string('estado')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // O método down() faz a operação inversa, permitindo que os campos sejam nulos novamente.
        Schema::table('enderecos', function (Blueprint $table) {
            $table->string('cep')->nullable()->change();
            $table->string('rua')->nullable()->change();
            $table->string('numero')->nullable()->change();
            $table->string('bairro')->nullable()->change();
            $table->string('cidade')->nullable()->change();
            $table->string('estado')->nullable()->change();
        });
    }
};