<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Chat\Models\Conversation;
use Modules\Product\Models\Product;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // Conversation Index
    // -------------------------------------------------------------------------

    public function test_guests_cannot_visit_chat(): void
    {
        $this->get(route('chat.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_chat(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('chat.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('chat/index'));
    }

    // -------------------------------------------------------------------------
    // Store conversation
    // -------------------------------------------------------------------------

    public function test_buyer_can_start_conversation_with_seller(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $this->actingAs($buyer)
            ->post(route('chat.store'), ['receiver_id' => $seller->id])
            ->assertRedirect();

        $this->assertDatabaseHas('conversations', []);

        // Both users should be participants
        $conversation = Conversation::first();
        $this->assertNotNull($conversation);
        $this->assertTrue(
            $conversation->participants()->where('user_id', $buyer->id)->exists(),
        );
        $this->assertTrue(
            $conversation->participants()->where('user_id', $seller->id)->exists(),
        );
    }

    public function test_starting_a_conversation_twice_reuses_the_same_conversation(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $this->actingAs($buyer)->post(route('chat.store'), ['receiver_id' => $seller->id]);
        $this->actingAs($buyer)->post(route('chat.store'), ['receiver_id' => $seller->id]);

        $this->assertCount(1, Conversation::all());
    }

    public function test_user_cannot_chat_with_themselves(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('chat.store'), ['receiver_id' => $user->id])
            ->assertSessionHasErrors('receiver_id');
    }

    // -------------------------------------------------------------------------
    // Show conversation + initialProduct injection
    // -------------------------------------------------------------------------

    public function test_participant_can_view_conversation(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $conversation = Conversation::create();
        $conversation->participants()->attach([$buyer->id, $seller->id]);

        $this->actingAs($buyer)
            ->get(route('chat.show', $conversation))
            ->assertOk()
            ->assertInertia(
                fn ($page) => $page
                    ->component('chat/index')
                    ->has('activeConversation')
                    ->where('initialProduct', null),
            );
    }

    public function test_non_participant_cannot_view_conversation(): void
    {
        $outsider = User::factory()->create();
        $a = User::factory()->create();
        $b = User::factory()->create();

        $conversation = Conversation::create();
        $conversation->participants()->attach([$a->id, $b->id]);

        $this->actingAs($outsider)
            ->get(route('chat.show', $conversation))
            ->assertForbidden();
    }

    public function test_initial_product_is_injected_from_query_string(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $conversation = Conversation::create();
        $conversation->participants()->attach([$buyer->id, $seller->id]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => 'active',
        ]);

        $this->actingAs($buyer)
            ->get(route('chat.show', [$conversation, 'product_id' => $product->id]))
            ->assertOk()
            ->assertInertia(
                fn ($page) => $page
                    ->component('chat/index')
                    ->where('initialProduct.id', $product->id)
                    ->where('initialProduct.name', $product->name),
            );
    }

    // -------------------------------------------------------------------------
    // Product search
    // -------------------------------------------------------------------------

    public function test_product_picker_returns_active_products(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $activeProduct = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => 'active',
        ]);
        Product::factory()->create([
            'user_id' => $seller->id,
            'status' => 'inactive',
        ]);

        $this->actingAs($buyer)
            ->getJson(route('chat.products.search', ['seller_id' => $seller->id]))
            ->assertOk()
            ->assertJsonCount(1, 'products')
            ->assertJsonPath('products.0.id', $activeProduct->id);
    }

    public function test_product_picker_filters_by_query(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        Product::factory()->create(['user_id' => $seller->id, 'status' => 'active', 'name' => 'Blue Denim Jacket']);
        Product::factory()->create(['user_id' => $seller->id, 'status' => 'active', 'name' => 'Red Summer Dress']);

        $response = $this->actingAs($buyer)
            ->getJson(route('chat.products.search', ['seller_id' => $seller->id, 'q' => 'Denim']))
            ->assertOk();

        $products = $response->json('products');
        $this->assertCount(1, $products);
        $this->assertStringContainsString('Denim', $products[0]['name']);
    }

    public function test_product_picker_requires_authentication(): void
    {
        $this->getJson(route('chat.products.search'))->assertUnauthorized();
    }

    // -------------------------------------------------------------------------
    // Send message
    // -------------------------------------------------------------------------

    public function test_participant_can_send_message(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $conversation = Conversation::create();
        $conversation->participants()->attach([$buyer->id, $seller->id]);

        $this->actingAs($buyer)
            ->postJson(route('chat.messages.store', $conversation), [
                'message' => 'Hello, is this still available?',
            ])
            ->assertOk()
            ->assertJsonPath('message.message', 'Hello, is this still available?')
            ->assertJsonPath('message.sender_id', $buyer->id);

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'sender_id' => $buyer->id,
            'message' => 'Hello, is this still available?',
        ]);
    }

    public function test_participant_can_send_message_with_product(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $conversation = Conversation::create();
        $conversation->participants()->attach([$buyer->id, $seller->id]);

        $product = Product::factory()->create(['user_id' => $seller->id, 'status' => 'active']);

        $this->actingAs($buyer)
            ->postJson(route('chat.messages.store', $conversation), [
                'message' => 'Can I get more info about this?',
                'product_id' => $product->id,
            ])
            ->assertOk()
            ->assertJsonPath('message.product.id', $product->id);

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_non_participant_cannot_send_message(): void
    {
        $outsider = User::factory()->create();
        $a = User::factory()->create();
        $b = User::factory()->create();

        $conversation = Conversation::create();
        $conversation->participants()->attach([$a->id, $b->id]);

        $this->actingAs($outsider)
            ->postJson(route('chat.messages.store', $conversation), [
                'message' => 'I should not send this',
            ])
            ->assertForbidden();
    }
}
