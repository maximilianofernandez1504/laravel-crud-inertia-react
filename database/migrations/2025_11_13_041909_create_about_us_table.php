<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAboutUsTable extends Migration
{
    public function up()
    {
        Schema::create('about_us', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Sobre nosotros');
            $table->string('subtitle')->nullable()->default('Somos...');
            $table->text('content')->nullable()->default('Somos...');
            $table->text('footer_text')->nullable()->default('Muchas gracias por leer...');
            $table->timestamps();
        });

        // seed a default row if desired
        DB::table('about_us')->insert([
            'title' => 'Sobre nosotros',
            'subtitle' => 'Somos...',
            'content' => "Somos una empresa dedicada a...",
            'footer_text' => 'Muchas gracias por leer...',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('about_us');
    }
}
