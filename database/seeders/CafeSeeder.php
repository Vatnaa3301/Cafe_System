<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CafeSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Users ────────────────────────────────────────────────
        User::updateOrCreate(
            ['email' => 'admin@cafe.com'],
            [
                'name'     => 'Admin User',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'cashier@cafe.com'],
            [
                'name'     => 'Cashier User',
                'password' => Hash::make('password'),
                'role'     => 'cashier',
            ]
        );

        // ─── Categories & Products ─────────────────────────────────
        $coffeeSizes   = ['S' => 3.99, 'M' => 4.99, 'L' => 5.99];
        $nonCoffeeSizes = ['S' => 3.49, 'M' => 4.49, 'L' => 5.49];
        $boba     = [['name' => 'Boba', 'extra_price' => 0.50], ['name' => 'Grass Jelly', 'extra_price' => 0.50], ['name' => 'Pudding', 'extra_price' => 0.75]];
        $cheeseTopping = [['name' => 'Cheese Foam', 'extra_price' => 0.75]];

        $categories = [
            [
                'name' => 'Coffee',
                'icon' => '☕',
                'products' => [
                    ['name' => 'Coffee Summer of 69 (Latte Special)', 'price' => 4.50, 'description' => 'Special latte with summer vibes',    'sizes' => $coffeeSizes,    'toppings' => $boba],
                    ['name' => 'Caramel Macchiato Regal',             'price' => 4.50, 'description' => 'Rich caramel espresso drink',       'sizes' => $coffeeSizes,    'toppings' => $cheeseTopping],
                    ['name' => 'Americano Double Shot Espresso',      'price' => 3.50, 'description' => 'Bold double shot americano',        'sizes' => $coffeeSizes,    'toppings' => null],
                    ['name' => 'Coffee Cappuccino Cheese',            'price' => 4.00, 'description' => 'Cappuccino with cheese foam',       'sizes' => $coffeeSizes,    'toppings' => $cheeseTopping],
                ],
            ],
            [
                'name' => 'Non-Coffee',
                'icon' => '🥤',
                'products' => [
                    ['name' => 'Caramel Cereal Coffee Candy (C4)',       'price' => 4.50, 'description' => 'Sweet cereal caramel bliss',      'sizes' => $nonCoffeeSizes, 'toppings' => $boba],
                    ['name' => 'Space Cocoa Cream Cheese',               'price' => 4.50, 'description' => 'Chocolatey cocoa cream',          'sizes' => $nonCoffeeSizes, 'toppings' => $cheeseTopping],
                    ['name' => 'Strawberry Melted Chocolate Ice Cream',  'price' => 4.00, 'description' => 'Ice cream with strawberry',       'sizes' => $nonCoffeeSizes, 'toppings' => $boba],
                    ['name' => 'Caramel Hazelnut Latte Coffee',          'price' => 3.75, 'description' => 'Nutty hazelnut latte',            'sizes' => $nonCoffeeSizes, 'toppings' => null],
                ],
            ],
            [
                'name' => 'Snack',
                'icon' => '🍿',
                'products' => [
                    ['name' => 'Crispy Potato Wedges', 'price' => 3.00, 'description' => 'Golden crispy wedges',  'sizes' => null, 'toppings' => null],
                    ['name' => 'Cheese Stick',         'price' => 2.50, 'description' => 'Crunchy cheese sticks', 'sizes' => null, 'toppings' => null],
                ],
            ],
            [
                'name' => 'Meals',
                'icon' => '🍽',
                'products' => [
                    ['name' => 'Nasi Goreng Spesial Katsu',          'price' => 5.50, 'description' => 'Fried rice with katsu',       'sizes' => null, 'toppings' => null],
                    ['name' => 'Japanese Curry Rice with Egg',        'price' => 6.50, 'description' => 'Japanese curry & egg',        'sizes' => null, 'toppings' => null],
                    ['name' => 'Nasi Kulit Sambal Matah Spesial',     'price' => 5.00, 'description' => 'Balinese sambal matah',       'sizes' => null, 'toppings' => null],
                    ['name' => 'Japanese Chicken Curry with Katsu',   'price' => 7.00, 'description' => 'Chicken katsu curry',         'sizes' => null, 'toppings' => null],
                ],
            ],
        ];

        foreach ($categories as $catData) {
            $products = $catData['products'];
            unset($catData['products']);

            $category = Category::updateOrCreate(
                ['name' => $catData['name']],
                $catData
            );

            foreach ($products as $productData) {
                Product::updateOrCreate(
                    ['name' => $productData['name'], 'category_id' => $category->id],
                    array_merge($productData, ['category_id' => $category->id, 'is_available' => true])
                );
            }
        }

        $this->command->info('✅ Café data seeded successfully!');
        $this->command->info('   Admin:   admin@cafe.com / password');
        $this->command->info('   Cashier: cashier@cafe.com / password');
    }
}
