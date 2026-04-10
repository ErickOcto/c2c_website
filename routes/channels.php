<?php

use Illuminate\Support\Facades\Broadcast;
use Modules\Chat\Models\Conversation;

/**
 * Authorize private chat channels.
 * Users can only listen to conversations they're a participant of.
 */
Broadcast::channel('chat.{conversationId}', function ($user, int $conversationId) {
    $conversation = Conversation::find($conversationId);

    if (! $conversation) {
        return false;
    }

    return $conversation->participants()->where('user_id', $user->id)->exists();
});
