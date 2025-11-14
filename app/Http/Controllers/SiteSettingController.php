<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use App\Models\SiteAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Arr;

class SiteSettingController extends Controller
{
    /**
     * Función auxiliar para convertir cadenas vacías a null.
     */
    private function cleanNullable(string $value = null): ?string
    {
        return empty($value) ? null : $value;
    }

    public function edit()
    {
        
        $settings = SiteSetting::with('addresses')->firstOrNew([]);
        
        return Inertia::render('SiteSettings/Edit', [
            'settings' => $settings,
            'addresses' => $settings->addresses,
        ]);
    }

    public function update(Request $request)
    {
       

        $validatedSettings = $request->validate([
            'reservation_hours'        => 'required|integer|min:1',
            'cart_expiration_minutes'  => 'required|integer|min:0',
            'minimum_purchase'         => 'required|numeric|min:0',
            'contact_email'            => 'nullable|email',
            'whatsapp_number'          => 'nullable|string',
            'instagram'                => 'nullable|string',
            'auto_email_on_purchase'   => 'boolean',
            'auto_email_on_shipment'   => 'boolean',
        ]);

       
        $validatedAddresses = $request->va1lidate([
            'addresses'                => 'nullable|array',
            'addresses.*.id'           => 'nullable|integer|exists:site_addresses,id',
            'addresses.*.label'        => 'required|string|max:255',
            'addresses.*.address'      => 'required|string|max:255', 
            'addresses.*.locality'     => 'required|string|max:255', 
            'addresses.*.province'     => 'required|string|max:255', 
            'addresses.*.country'      => 'nullable|string|max:255',
            'addresses.*.postal_code'  => 'nullable|string|max:255',
            'addresses.*.latitude'     => 'required|numeric|between:-90,90',
            'addresses.*.longitude'    => 'required|numeric|between:-180,180',
        ]);

        $settings = SiteSetting::firstOrFail();
        
       
        $settings->update($validatedSettings);

       
        
        $currentAddressIds = SiteAddress::where('site_setting_id', $settings->id)->pluck('id')->toArray();
        $updatedAddressIds = [];

        if (Arr::has($validatedAddresses, 'addresses')) {
            foreach ($validatedAddresses['addresses'] as $addr) {
               
                $data = [
                    'label'          => $addr['label'],
                    'address_line'   => $addr['address'],   
                    'city'           => $addr['locality'],   
                    'state'          => $addr['province'],   
                    'country'        => $this->cleanNullable($addr['country'] ?? 'Argentina'), 
                    'postal_code'    => $this->cleanNullable($addr['postal_code'] ?? null),
                    'latitude'       => $addr['latitude'],
                    'longitude'      => $addr['longitude'],
                ];
                
                 


                if (!empty($addr['id'])) {
                    
                    SiteAddress::where('id', $addr['id'])->update($data);
                    $updatedAddressIds[] = (int)$addr['id'];
                } else {
                    
                    $newAddress = $settings->addresses()->create($data);
                    $updatedAddressIds[] = $newAddress->id;
                }
            }
        }
        
        
        $addressesToDelete = array_diff($currentAddressIds, $updatedAddressIds);
        if (!empty($addressesToDelete)) {
            SiteAddress::destroy($addressesToDelete);
        }
        
        return back()->with('success', 'Configuración actualizada correctamente.');
    }
}