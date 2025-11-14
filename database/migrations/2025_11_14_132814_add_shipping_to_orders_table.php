<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('shipping_method', ['local', 'domicilio'])
                ->default('local')
                ->after('payment_method');

            $table->string('shipping_address')->nullable()->after('shipping_method');
            $table->string('shipping_province')->nullable()->after('shipping_address');

            $table->decimal('shipping_cost', 10, 2)
                ->default(0)
                ->after('shipping_province');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_method',
                'shipping_address',
                'shipping_province',
                'shipping_cost',
            ]);
        });
    }
};
