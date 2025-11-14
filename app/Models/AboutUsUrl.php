<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutUsUrl extends Model
{
    protected $table = 'about_us_urls';

    protected $fillable = [
        'about_us_id',
        'url',
        'title',
    ];

    public function about()
    {
        return $this->belongsTo(AboutUs::class, 'about_us_id');
    }
}
