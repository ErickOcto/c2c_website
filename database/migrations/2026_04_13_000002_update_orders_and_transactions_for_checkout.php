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
        // Update transactions table: remove order_id FK, add snap_token and gross_amount
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');

            $table->foreignId('buyer_id')->after('id')->constrained('users')->cascadeOnDelete();
            $table->string('snap_token')->nullable()->after('payment_method');
            $table->string('snap_url')->nullable()->after('snap_token');
            $table->decimal('gross_amount', 12, 2)->after('snap_url');
        });

        // Update orders table: add transaction_id, seller_id, address_id, shipping fields
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('transaction_id')->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('seller_id')->after('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('address_id')->nullable()->after('seller_id')->constrained()->nullOnDelete();
            $table->string('shipping_courier')->nullable()->after('total_price');
            $table->string('shipping_service')->nullable()->after('shipping_courier');
            $table->decimal('shipping_cost', 10, 2)->default(0)->after('shipping_service');
            $table->integer('shipping_etd')->nullable()->after('shipping_cost');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['transaction_id']);
            $table->dropColumn(['transaction_id', 'shipping_courier', 'shipping_service', 'shipping_cost', 'shipping_etd']);
            $table->dropForeign(['seller_id']);
            $table->dropColumn('seller_id');
            $table->dropForeign(['address_id']);
            $table->dropColumn('address_id');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['buyer_id']);
            $table->dropColumn(['buyer_id', 'snap_token', 'snap_url', 'gross_amount']);

            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
        });
    }
};
