<?php

use App\Models\SiteSetting;

function settings($key = null)
{
    static $settings;

    if (!$settings) {
        $settings = SiteSetting::first();
    }

    if (!$key) return $settings;

    return $settings->{$key};
}
