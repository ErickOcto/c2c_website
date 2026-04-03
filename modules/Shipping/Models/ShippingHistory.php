<?php

namespace Modules\Shipping\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingHistory extends Model
{
    public function shipping()
    {
        return $this->belongsTo(Shipping::class);
    }
}