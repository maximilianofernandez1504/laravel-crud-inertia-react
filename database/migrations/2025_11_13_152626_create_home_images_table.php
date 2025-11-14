<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('home_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('home_id')->constrained()->cascadeOnDelete();
            $table->string('image_path');
            $table->integer('priority')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('home_images');
    }
};
