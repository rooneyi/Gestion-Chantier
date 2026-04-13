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
        Schema::table('attendances', function (Blueprint $table) {
            // Modify the status enum to include 'malade' (sick leave)
            $table->enum('status', ['present', 'absent', 'retard', 'malade'])->default('present')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Revert status enum
            $table->enum('status', ['present', 'absent', 'retard'])->default('present')->change();
        });
    }
};
