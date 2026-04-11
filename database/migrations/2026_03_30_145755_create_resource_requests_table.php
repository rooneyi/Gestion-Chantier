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
        Schema::create('resource_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Celui qui demande
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->decimal('quantity_requested', 10, 2);
            $table->enum('status', ['en_attente', 'approuve', 'rejete', 'livre'])->default('en_attente');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_requests');
    }
};
