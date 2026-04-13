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
        Schema::create('absence_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('set null');
            $table->date('absence_date');
            $table->string('status')->default('pending'); // pending, notified, resolved
            $table->timestamp('notified_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->text('reason')->nullable(); // Reason for absence (if provided)
            $table->timestamps();

            $table->index(['user_id', 'absence_date']);
            $table->index(['project_id', 'absence_date']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absence_notifications');
    }
};
