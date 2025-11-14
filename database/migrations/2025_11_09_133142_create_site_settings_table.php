<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            
            $table->integer('reservation_hours')->default(48);
            $table->integer('cart_expiration_minutes')->default(120);
            $table->decimal('minimum_purchase', 10, 2)->default(0);

            $table->boolean('auto_email_on_purchase')->default(true);
            $table->boolean('auto_email_on_shipment')->default(true);

            $table->string('contact_email')->nullable();
             
            $table->string('instagram')->nullable();
            $table->string('whatsapp_number')->nullable();
            

            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('site_settings');
    }
};
