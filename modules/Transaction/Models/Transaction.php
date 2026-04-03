<?php

namespace Modules\Transaction\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\Order\Models\Order;
class Transaction extends Model
{
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}