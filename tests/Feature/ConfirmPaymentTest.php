<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Order\Models\Order;
use Modules\Transaction\Models\Transaction;
use Tests\TestCase;

class ConfirmPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_confirm_payment_marks_transaction_and_orders_as_paid(): void
    {
        $buyer = User::factory()->create();

        $transaction = Transaction::create([
            'buyer_id' => $buyer->id,
            'payment_method' => 'midtrans',
            'payment_status' => 'pending',
            'gross_amount' => 100000,
        ]);

        $order = Order::create([
            'transaction_id' => $transaction->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $buyer->id,
            'total_price' => 100000,
            'shipping_courier' => 'jne',
            'shipping_service' => 'REG',
            'shipping_cost' => 10000,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($buyer)
            ->postJson('/checkout/confirm-payment', [
                'transaction_id' => $transaction->id,
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'payment_status' => 'paid',
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'paid',
        ]);
    }

    public function test_confirm_payment_skips_already_paid_transaction(): void
    {
        $buyer = User::factory()->create();

        $transaction = Transaction::create([
            'buyer_id' => $buyer->id,
            'payment_method' => 'midtrans',
            'payment_status' => 'paid',
            'gross_amount' => 100000,
            'paid_at' => now(),
        ]);

        $response = $this->actingAs($buyer)
            ->postJson('/checkout/confirm-payment', [
                'transaction_id' => $transaction->id,
            ]);

        $response->assertOk();
        $response->assertJson(['status' => 'already_paid']);
    }

    public function test_confirm_payment_requires_auth(): void
    {
        $response = $this->postJson('/checkout/confirm-payment', [
            'transaction_id' => 1,
        ]);

        $response->assertUnauthorized();
    }

    public function test_confirm_payment_rejects_other_users_transaction(): void
    {
        $buyer = User::factory()->create();
        $otherUser = User::factory()->create();

        $transaction = Transaction::create([
            'buyer_id' => $buyer->id,
            'payment_method' => 'midtrans',
            'payment_status' => 'pending',
            'gross_amount' => 100000,
        ]);

        $response = $this->actingAs($otherUser)
            ->postJson('/checkout/confirm-payment', [
                'transaction_id' => $transaction->id,
            ]);

        $response->assertNotFound();

        // Transaction should still be pending
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'payment_status' => 'pending',
        ]);
    }
}
