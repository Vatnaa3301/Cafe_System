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
                    ['name' => 'Coffee Summer of 69 (Latte Special)', 'price' => 4.50, 'description' => 'Special latte with summer vibes',    'sizes' => $coffeeSizes,    'toppings' => $boba, 'image' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Caramel Macchiato Regal',             'price' => 4.50, 'description' => 'Rich caramel espresso drink',       'sizes' => $coffeeSizes,    'toppings' => $cheeseTopping, 'image' => 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Americano Double Shot Espresso',      'price' => 3.50, 'description' => 'Bold double shot americano',        'sizes' => $coffeeSizes,    'toppings' => null, 'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Coffee Cappuccino Cheese',            'price' => 4.00, 'description' => 'Cappuccino with cheese foam',       'sizes' => $coffeeSizes,    'toppings' => $cheeseTopping, 'image' => 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80'],
                ],
            ],
            [
                'name' => 'Non-Coffee',
                'icon' => '🥤',
                'products' => [
                    ['name' => 'Caramel Cereal Coffee Candy (C4)',       'price' => 4.50, 'description' => 'Sweet cereal caramel bliss',      'sizes' => $nonCoffeeSizes, 'toppings' => $boba, 'image' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Space Cocoa Cream Cheese',               'price' => 4.50, 'description' => 'Chocolatey cocoa cream',          'sizes' => $nonCoffeeSizes, 'toppings' => $cheeseTopping, 'image' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Strawberry Melted Chocolate Ice Cream',  'price' => 4.00, 'description' => 'Ice cream with strawberry',       'sizes' => $nonCoffeeSizes, 'toppings' => $boba, 'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Caramel Hazelnut Latte Coffee',          'price' => 3.75, 'description' => 'Nutty hazelnut latte',            'sizes' => $nonCoffeeSizes, 'toppings' => null, 'image' => 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80'],
                ],
            ],
            [
                'name' => 'Snack',
                'icon' => '🍿',
                'products' => [
                    ['name' => 'Crispy Potato Wedges', 'price' => 3.00, 'description' => 'Golden crispy wedges',  'sizes' => null, 'toppings' => null, 'image' => 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Cheese Stick',         'price' => 2.50, 'description' => 'Crunchy cheese sticks', 'sizes' => null, 'toppings' => null, 'image' => 'https://images.unsplash.com/photo-1531749668001-75464cb3d622?auto=format&fit=crop&w=400&q=80'],
                ],
            ],
            [
                'name' => 'Meals',
                'icon' => '🍽',
                'products' => [
                    ['name' => 'Nasi Goreng Spesial Katsu',          'price' => 5.50, 'description' => 'Fried rice with katsu',       'sizes' => null, 'toppings' => null, 'image' => 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Japanese Curry Rice with Egg',        'price' => 6.50, 'description' => 'Japanese curry & egg',        'sizes' => null, 'toppings' => null, 'image' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Nasi Kulit Sambal Matah Spesial',     'price' => 5.00, 'description' => 'Balinese sambal matah',       'sizes' => null, 'toppings' => null, 'image' => 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80'],
                    ['name' => 'Japanese Chicken Curry with Katsu',   'price' => 7.00, 'description' => 'Chicken katsu curry',         'sizes' => null, 'toppings' => null, 'image' => 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80'],
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
