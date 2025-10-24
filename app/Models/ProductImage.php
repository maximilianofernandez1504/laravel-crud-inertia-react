<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use app\Models\Product;

class ProductImage extends Model
{
    //
    protected $fillable = [
        'product_id',
        'image_path',
        'state'
    ];
  

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
