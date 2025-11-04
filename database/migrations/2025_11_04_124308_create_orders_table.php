<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('total', 10, 2)->comment('Subtotal sin intereses');
            $table->decimal('interest', 10, 2)->default(0)->comment('Monto de interés aplicado (si corresponde)');
            $table->decimal('final_total', 10, 2)->comment('Total final (subtotal + interest)');
            $table->string('payment_method')->nullable();
            $table->enum('status', ['reserva', 'en espera', 'en proceso', 'enviado'])->default('reserva');
            $table->tinyInteger('paid')->default(0);
            $table->timestamps();
            $table->softDeletes()->nullable();
            $table->index('user_id');
            $table->index('paid');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
