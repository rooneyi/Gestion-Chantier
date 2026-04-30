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
        Schema::create('material_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('movement_type', ['entry', 'exit']);
            $table->decimal('quantity', 10, 2);
            $table->string('reason')->nullable();
            $table->text('comment')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();

            $table->index(['material_id', 'occurred_at']);
            $table->index(['movement_type', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_movements');
    }
};
