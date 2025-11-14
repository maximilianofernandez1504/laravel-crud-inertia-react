<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HomeImage extends Model
{
    use HasFactory;

    protected $fillable = ['home_id', 'image_path', 'priority'];

    public function home()
    {
        return $this->belongsTo(Home::class);
    }
}
