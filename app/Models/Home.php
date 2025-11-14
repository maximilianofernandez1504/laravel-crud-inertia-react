<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Home extends Model
{
    use HasFactory;

    protected $fillable = ['title_products', 'title_map'];

    public function images()
    {
        return $this->hasMany(HomeImage::class);
    }
}
