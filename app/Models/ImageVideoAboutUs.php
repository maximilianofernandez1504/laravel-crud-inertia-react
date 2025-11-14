<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageVideoAboutUs extends Model
{
    protected $table = 'images_videos_aboutus';

    protected $fillable = [
        'about_us_id',
        'file_path',
        'file_type',
        'is_in_carousel',
        'priority',
    ];

    public function about()
    {
        return $this->belongsTo(AboutUs::class, 'about_us_id');
    }
}
