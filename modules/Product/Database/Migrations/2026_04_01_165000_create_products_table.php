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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->integer('stock');
            $table->enum('status', ['active', 'inactive', 'sold', 'deleted'])->default('active');
            $table->string('brand')->nullable()->after('description');
            $table->enum('condition', ['new', 'good', 'bad', 'poor'])->default('good')->after('brand');
            $table->string('size')->nullable()->after('condition');
            $table->string('color')->nullable()->after('size');
            $table->string('material')->nullable()->after('color');            
            $table->enum('department', ['men', 'women', 'kids', 'unisex'])->default('unisex');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
