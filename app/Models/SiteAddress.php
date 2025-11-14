<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteAddress extends Model
{
    protected $fillable = [
        'site_setting_id',
        'label',
        'address_line',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
    ];

    public function settings()
    {
        return $this->belongsTo(SiteSetting::class, 'site_setting_id');
    }

}
