<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'reservation_hours',
        'cart_expiration_minutes',
        'minimum_purchase',
        'auto_email_on_purchase',
        'auto_email_on_shipment',
        'contact_email',
        'instagram',
        'whatsapp_number',       
    ];

    public function addresses()
    {
        return $this->hasMany(SiteAddress::class);
    }
}
