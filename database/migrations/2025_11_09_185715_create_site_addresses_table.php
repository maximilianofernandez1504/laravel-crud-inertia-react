<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('site_addresses', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('site_setting_id')->constrained('site_settings')->cascadeOnDelete();

            $table->string('label')->nullable(); 
            $table->string('address_line')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable()->default('Argentina');
            $table->string('postal_code')->nullable();

            // Para mapa
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();



            $table->timestamps();

       
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_addresses');
    }
};
