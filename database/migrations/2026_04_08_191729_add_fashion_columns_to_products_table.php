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
        Schema::table('products', function (Blueprint $table) {
            $table->string('brand')->nullable()->after('description');
            $table->enum('condition', ['new', 'good', 'bad', 'poor'])->default('good')->after('brand');
            $table->string('size')->nullable()->after('condition');
            $table->string('color')->nullable()->after('size');
            $table->string('material')->nullable()->after('color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['brand', 'condition', 'size', 'color', 'material']);
        });
    }
};
