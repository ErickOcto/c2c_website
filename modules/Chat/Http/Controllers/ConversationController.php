<?php

namespace Modules\Chat\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Chat\Models\Conversation;
use Modules\Product\Models\Product;

class ConversationController extends Controller
{
    /**
     * Display the chat page with all conversations.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = $user->conversations()
            ->with(['participants', 'latestMessage.sender', 'latestMessage.product'])
            ->get()
            ->map(function (Conversation $conversation) use ($user) {
                $otherParticipant = $conversation->getOtherParticipant($user->id);
                $unreadCount = $conversation->unreadCountFor($user->id);

                return [
                    'id' => $conversation->id,
                    'other_participant' => $otherParticipant ? [
                        'id' => $otherParticipant->id,
                        'name' => $otherParticipant->name,
                        'avatar' => $otherParticipant->avatar ?? null,
                    ] : null,
                    'latest_message' => $conversation->latestMessage ? [
                        'id' => $conversation->latestMessage->id,
                        'message' => $conversation->latestMessage->message,
                        'sender_id' => $conversation->latestMessage->sender_id,
                        'created_at' => $conversation->latestMessage->created_at->toISOString(),
                    ] : null,
                    'unread_count' => $unreadCount,
                    'updated_at' => $conversation->latestMessage?->created_at?->toISOString() ?? $conversation->created_at->toISOString(),
                ];
            })
            ->sortByDesc('updated_at')
            ->values();

        return Inertia::render('chat/index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Get messages for a specific conversation.
     */
    public function show(Request $request, Conversation $conversation): Response
    {
        $user = $request->user();

        // Ensure user is a participant
        if (! $conversation->participants()->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        // Mark as read
        $conversation->participants()->updateExistingPivot($user->id, [
            'last_read_at' => now(),
        ]);

        $messages = $conversation->messages()
            ->with(['sender', 'product.images'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'conversation_id' => $message->conversation_id,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'message' => $message->message,
                    'product_id' => $message->product_id,
                    'created_at' => $message->created_at->toISOString(),
                    'sender' => [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                        'avatar' => $message->sender->avatar ?? null,
                    ],
                    'product' => $message->product ? [
                        'id' => $message->product->id,
                        'name' => $message->product->name,
                        'price' => $message->product->price,
                        'image_url' => $message->product->images->first()?->image_url,
                    ] : null,
                ];
            });

        $otherParticipant = $conversation->getOtherParticipant($user->id);

        // Re-fetch conversations for sidebar
        $conversations = $user->conversations()
            ->with(['participants', 'latestMessage.sender', 'latestMessage.product'])
            ->get()
            ->map(function (Conversation $conv) use ($user) {
                $other = $conv->getOtherParticipant($user->id);
                $unreadCount = $conv->unreadCountFor($user->id);

                return [
                    'id' => $conv->id,
                    'other_participant' => $other ? [
                        'id' => $other->id,
                        'name' => $other->name,
                        'avatar' => $other->avatar ?? null,
                    ] : null,
                    'latest_message' => $conv->latestMessage ? [
                        'id' => $conv->latestMessage->id,
                        'message' => $conv->latestMessage->message,
                        'sender_id' => $conv->latestMessage->sender_id,
                        'created_at' => $conv->latestMessage->created_at->toISOString(),
                    ] : null,
                    'unread_count' => $unreadCount,
                    'updated_at' => $conv->latestMessage?->created_at?->toISOString() ?? $conv->created_at->toISOString(),
                ];
            })
            ->sortByDesc('updated_at')
            ->values();

        // If a product_id is in the query string, load it and pass as initialProduct
        $initialProduct = null;
        if ($request->filled('product_id')) {
            $product = Product::with('images')->find($request->integer('product_id'));
            if ($product) {
                $initialProduct = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_url' => $product->images->first()?->image_url,
                ];
            }
        }

        return Inertia::render('chat/index', [
            'conversations' => $conversations,
            'activeConversation' => [
                'id' => $conversation->id,
                'other_participant' => $otherParticipant ? [
                    'id' => $otherParticipant->id,
                    'name' => $otherParticipant->name,
                    'avatar' => $otherParticipant->avatar ?? null,
                ] : null,
                'messages' => $messages,
            ],
            'initialProduct' => $initialProduct,
        ]);
    }

    /**
     * Search products for the in-chat product picker.
     * Scoped to a specific seller's active products.
     */
    public function searchProducts(Request $request): JsonResponse
    {
        $query = Product::with('images')
            ->where('status', 'active');

        if ($request->filled('seller_id')) {
            $query->where('user_id', $request->integer('seller_id'));
        }

        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->take(20)->get()->map(fn ($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'image_url' => $product->images->first()?->image_url,
        ]);

        return response()->json(['products' => $products]);
    }

    /**
     * Find or create a conversation with another user, optionally linking a product.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'receiver_id' => ['required', 'integer', 'exists:users,id'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
        ]);

        $user = $request->user();
        $receiverId = $request->integer('receiver_id');

        // Prevent chatting with yourself
        if ($user->id === $receiverId) {
            return back()->withErrors(['receiver_id' => 'You cannot chat with yourself.']);
        }

        // Find existing conversation between these two users
        $conversation = Conversation::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->whereHas('participants', function ($query) use ($receiverId) {
            $query->where('user_id', $receiverId);
        })->first();

        // Create a new conversation if none exists
        if (! $conversation) {
            $conversation = Conversation::create();
            $conversation->participants()->attach([$user->id, $receiverId]);
        }

        $redirectUrl = '/chat/'.$conversation->id;

        // If a product was linked, pass it as a query param so the frontend can pre-fill
        if ($request->filled('product_id')) {
            $redirectUrl .= '?product_id='.$request->integer('product_id');
        }

        return redirect($redirectUrl);
    }
}
