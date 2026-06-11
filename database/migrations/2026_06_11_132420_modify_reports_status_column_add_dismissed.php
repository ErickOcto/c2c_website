<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->enum('status', ['pending', 'reviewed', 'resolved', 'dismissed'])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Safely migrate any dismissed reports back to pending before changing column type
        DB::table('reports')
            ->where('status', 'dismissed')
            ->update(['status' => 'pending']);

        Schema::table('reports', function (Blueprint $table) {
            $table->enum('status', ['pending', 'reviewed', 'resolved'])->default('pending')->change();
        });
    }
};
