<?php

namespace Modules\Order\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }

    public function shipping()
    {
        return $this->hasOne(Shipping::class);
    }

    public function dispute()
    {
        return $this->hasOne(Dispute::class);
    }
}