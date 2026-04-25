<?php

namespace Modules\Shipping\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\Order\Models\Order;

class Shipping extends Model
{
    protected $fillable = ['order_id', 'courier', 'tracking_number', 'status'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function histories()
    {
        return $this->hasMany(ShippingHistory::class);
    }
}
