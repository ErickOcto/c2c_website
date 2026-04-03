<?php

namespace Modules\Dispute\Models;

use Illuminate\Database\Eloquent\Model;

class DisputeMessage extends Model
{
    public function dispute()
    {
        return $this->belongsTo(Dispute::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}