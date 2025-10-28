<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'stock',
        'price',
        'state',
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function categories()
    {
      return $this->belongsToMany(Category::class, 'product_categories');
    }





}
