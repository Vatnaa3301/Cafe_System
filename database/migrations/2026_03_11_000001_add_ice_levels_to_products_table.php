<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Nullable JSON array of allowed ice level strings.
            // null  = show all defaults in the customer modal
            // array = show only the specified options
            $table->json('ice_levels')->nullable()->after('toppings');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('ice_levels');
        });
    }
};
