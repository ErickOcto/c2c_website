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
        Schema::table('profiles', function (Blueprint $table) {
            $table->unsignedInteger('city_id')->nullable()->after('city');
            $table->unsignedInteger('province_id')->nullable()->after('city_id');
            $table->string('province_name')->nullable()->after('province_id');
            $table->string('postal_code', 10)->nullable()->after('province_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn(['city_id', 'province_id', 'province_name', 'postal_code']);
        });
    }
};
