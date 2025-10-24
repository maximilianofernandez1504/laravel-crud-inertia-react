<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('table_product_image', function (Blueprint $table) {
            $table->id();
            $table->foreignID('product_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->string('image_path');
            $table->tinyinteger('state')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_product_image');
    }
};
