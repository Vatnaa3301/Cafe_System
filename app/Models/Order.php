<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'customer_name',
        'subtotal',
        'tax',
        'total',
        'voucher_code',
        'discount',
        'status',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'tax'      => 'float',
        'total'    => 'float',
        'discount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
