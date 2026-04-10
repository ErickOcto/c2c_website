<?php

namespace Modules\Chat\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    /**
     * Get the participants of this conversation.
     *
     * @return BelongsToMany<User, $this>
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_user')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    /**
     * Get all messages in this conversation.
     *
     * @return HasMany<Message, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get the latest message in this conversation.
     *
     * @return HasOne<Message, $this>
     */
    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Get the other participant in a 1-on-1 conversation.
     */
    public function getOtherParticipant(int $userId): ?User
    {
        return $this->participants->firstWhere('id', '!=', $userId);
    }

    /**
     * Get unread messages count for a specific user.
     */
    public function unreadCountFor(int $userId): int
    {
        $pivot = $this->participants->firstWhere('id', $userId)?->pivot;
        $lastReadAt = $pivot?->last_read_at;

        $query = $this->messages()->where('sender_id', '!=', $userId);

        if ($lastReadAt) {
            $query->where('created_at', '>', $lastReadAt);
        }

        return $query->count();
    }
}
