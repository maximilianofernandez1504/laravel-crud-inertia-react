<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
    protected $table = 'about_us';

    protected $fillable = [
        'title',
        'subtitle',
        'content',
        'footer_text',
    ];

    public function media()
    {
        return $this->hasMany(ImageVideoAboutUs::class, 'about_us_id');
    }

    public function urls()
    {
        return $this->hasMany(AboutUsUrl::class, 'about_us_id');
    }
}
