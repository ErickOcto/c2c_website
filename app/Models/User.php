<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Modules\Chat\Models\Conversation;
use Modules\Chat\Models\Message;
use Modules\Transaction\Models\Transaction;
use Modules\Order\Models\Order;
use Modules\Product\Models\Product;
use Modules\Feedback\Models\Review;
use Modules\Cart\Models\Wishlist;
use Modules\Cart\Models\Cart;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class); // sebagai seller
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function defaultAddress()
    {
        return $this->hasOne(Address::class)->where('is_default', true);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'buyer_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

}
