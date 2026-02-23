<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Cup sizes: {"S": 3.99, "M": 4.99, "L": 5.99} — null = disabled
            $table->json('sizes')->nullable()->after('price');
            // Available toppings: [{"name": "Boba", "extra_price": 0.50}] — null = disabled
            $table->json('toppings')->nullable()->after('sizes');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['sizes', 'toppings']);
        });
    }
};
