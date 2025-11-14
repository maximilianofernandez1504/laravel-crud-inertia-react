<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagesVideosAboutusTable extends Migration
{
    public function up()
    {
        Schema::create('images_videos_aboutus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('about_us_id')->constrained('about_us')->cascadeOnDelete();
            $table->string('file_path'); // ruta pública: storage/images_videos/archivo.ext (guardada con 'storage/...' prefijo)
            $table->enum('file_type', ['image', 'video'])->default('image');
            $table->boolean('is_in_carousel')->default(false);
            $table->integer('priority')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('images_videos_aboutus');
    }
}
