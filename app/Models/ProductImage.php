<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

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


  public function getUrlAttribute()
    {
        return asset('storage/' . $this->image_path);
    }


}
