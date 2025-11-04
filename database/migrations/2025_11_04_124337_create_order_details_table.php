<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
   {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');

            $table->unsignedBigInteger('variant_id')->nullable()->comment('ID de la variante del producto');
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 10, 2)->comment('Precio por unidad al momento de la compra');
            $table->decimal('subtotal', 10, 2)->comment('quantity * unit_price');

            $table->timestamps();

            $table->index('order_id');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
