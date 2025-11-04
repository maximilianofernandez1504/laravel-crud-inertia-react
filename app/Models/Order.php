<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'total',
        'interest',
        'final_total',
        'payment_method',
        'paid',
        'status',
    ];

    protected $casts = [
        'paid' => 'boolean',
        'total' => 'decimal:2',
        'interest' => 'decimal:2',
        'final_total' => 'decimal:2',
    ];

  
    public function user()
    {
        return $this->belongsTo(User::class);
    }

   
    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }

    
    public function getFormattedTotalAttribute()
    {
        return '$' . number_format($this->final_total, 2, ',', '.');
    }
}
