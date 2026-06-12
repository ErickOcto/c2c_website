<?php

namespace Tests\Feature\Seller;

use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Modules\Order\Models\Order;
use Modules\Shipping\Models\Shipping;
use Modules\Transaction\Models\Transaction;
use Tests\TestCase;

class OrderTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected User $seller;

    protected Order $order1;

    protected Order $order2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seller = User::factory()->create();

        $transaction1 = Transaction::create([
            'buyer_id' => $this->seller->id,
            'payment_method' => 'midtrans',
            'payment_status' => 'paid',
            'gross_amount' => 50000,
        ]);

        $this->order1 = Order::create([
            'transaction_id' => $transaction1->id,
            'buyer_id' => $this->seller->id,
            'seller_id' => $this->seller->id,
            'total_price' => 50000,
            'shipping_courier' => 'jne',
            'shipping_service' => 'REG',
            'shipping_cost' => 10000,
            'status' => 'paid',
        ]);

        $transaction2 = Transaction::create([
            'buyer_id' => $this->seller->id,
            'payment_method' => 'midtrans',
            'payment_status' => 'paid',
            'gross_amount' => 50000,
        ]);

        $this->order2 = Order::create([
            'transaction_id' => $transaction2->id,
            'buyer_id' => $this->seller->id,
            'seller_id' => $this->seller->id,
            'total_price' => 50000,
            'shipping_courier' => 'jne',
            'shipping_service' => 'REG',
            'shipping_cost' => 10000,
            'status' => 'paid',
        ]);
    }

    public function test_seller_can_ship_order_with_unique_tracking_number(): void
    {
        Notification::fake();

        $response = $this->actingAs($this->seller)
            ->patch(route('seller.orders.update-status', $this->order1->id), [
                'status' => 'shipped',
                'tracking_number' => 'TRACK12345',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('shippings', [
            'order_id' => $this->order1->id,
            'tracking_number' => 'TRACK12345',
            'status' => 'shipped',
        ]);

        Notification::assertSentTo(
            [$this->order1->buyer], SystemNotification::class
        );
    }

    public function test_seller_cannot_ship_order_with_duplicate_tracking_number(): void
    {
        // First, create a shipping record for order1
        Shipping::create([
            'order_id' => $this->order1->id,
            'courier' => 'jne',
            'tracking_number' => 'TRACK_DUPLICATE',
            'status' => 'shipped',
        ]);

        // Attempt to ship order2 with the same tracking number
        $response = $this->actingAs($this->seller)
            ->patch(route('seller.orders.update-status', $this->order2->id), [
                'status' => 'shipped',
                'tracking_number' => 'TRACK_DUPLICATE',
            ]);

        $response->assertSessionHasErrors('tracking_number');
        $this->assertDatabaseMissing('shippings', [
            'order_id' => $this->order2->id,
            'tracking_number' => 'TRACK_DUPLICATE',
        ]);
    }

    public function test_seller_can_update_order_with_its_own_tracking_number(): void
    {
        // Create a shipping record for order1
        Shipping::create([
            'order_id' => $this->order1->id,
            'courier' => 'jne',
            'tracking_number' => 'TRACK_OWN',
            'status' => 'shipped',
        ]);

        // Resubmit the update for order1 with the same tracking number
        $response = $this->actingAs($this->seller)
            ->patch(route('seller.orders.update-status', $this->order1->id), [
                'status' => 'shipped',
                'tracking_number' => 'TRACK_OWN',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
    }
}
