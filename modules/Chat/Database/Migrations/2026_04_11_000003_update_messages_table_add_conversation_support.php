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
        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('conversation_id')->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->after('receiver_id')->constrained()->nullOnDelete();
            $table->timestamp('read_at')->nullable()->after('message');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['conversation_id']);
            $table->dropColumn('conversation_id');
            $table->dropForeign(['product_id']);
            $table->dropColumn('product_id');
            $table->dropColumn('read_at');
        });
    }
};
