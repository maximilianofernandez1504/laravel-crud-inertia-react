<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class SiteSettingSeeder extends Seeder
{
    public function run()
    {
        // Evita crear duplicados si ya existe un registro
        if (SiteSetting::count() > 0) {
            return;
        }

        SiteSetting::create([
            'reservation_hours'        => 48,
            'cart_expiration_minutes'  => 120,
            'minimum_purchase'         => 0,
            'auto_email_on_purchase'   => true,
            'auto_email_on_shipment'   => true,
            'contact_email'            => 'noreply@valquiria.com',
            'instagram'                => null,
            'whatsapp_number'          => null,
         
            
        ]);
    }
}
