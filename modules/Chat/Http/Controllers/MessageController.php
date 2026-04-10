<?php

namespace Modules\Chat\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Modules\Chat\Events\MessageSent;
use Modules\Chat\Http\Requests\SendMessageRequest;
use Modules\Chat\Models\Conversation;
use Modules\Chat\Models\Message;

class MessageController extends Controller
{
    /**
     * Store a new message in a conversation.
     */
    public function store(SendMessageRequest $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        // Ensure user is a participant
        if (! $conversation->participants()->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        $otherParticipant = $conversation->getOtherParticipant($user->id);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'receiver_id' => $otherParticipant->id,
            'message' => $request->string('message'),
            'product_id' => $request->integer('product_id') ?: null,
        ]);

        $message->load(['sender', 'product.images']);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'message' => [
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
            ],
        ]);
    }
}
