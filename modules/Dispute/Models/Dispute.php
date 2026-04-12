<?php

namespace Modules\Dispute\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Modules\Order\Models\Order;

class Dispute extends Model
{
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function messages()
    {
        return $this->hasMany(DisputeMessage::class);
    }
}