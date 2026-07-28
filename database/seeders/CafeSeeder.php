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
                    ['name' => 'Coffee Summer of 69 (Latte Special)', 'price' => 4.50, 'description' => 'Special latte with summer vibes',    'sizes' => $coffeeSizes,    'toppings' => $boba, 'image' => 'products/0ip1dw7mmBnAlFUfwfuKhLhgOWh0qsQEiMgi6ObQ.png'],
                    ['name' => 'Caramel Macchiato Regal',             'price' => 4.50, 'description' => 'Rich caramel espresso drink',       'sizes' => $coffeeSizes,    'toppings' => $cheeseTopping, 'image' => 'products/0wdDY33rbvL1b4y03QPjCMkKA9R8q4zKVJ1Rb3yl.png'],
                    ['name' => 'Americano Double Shot Espresso',      'price' => 3.50, 'description' => 'Bold double shot americano',        'sizes' => $coffeeSizes,    'toppings' => null, 'image' => 'products/2CvzKaHiSf6buHyNBQShTKXQ3oxxXD4fGKLKSfXX.png'],
                    ['name' => 'Coffee Cappuccino Cheese',            'price' => 4.00, 'description' => 'Cappuccino with cheese foam',       'sizes' => $coffeeSizes,    'toppings' => $cheeseTopping, 'image' => 'products/3hwsvzSIjKNkPhAIdKGOYCN7e9oSdRlayoxPcbLQ.png'],
                    ['name' => 'Vanilla Bean Cold Brew',               'price' => 4.25, 'description' => 'Smooth cold brew infused with vanilla', 'sizes' => $coffeeSizes, 'toppings' => null, 'image' => 'products/7m6KX0Wl7urUmmVWDcv9JtdZjWy4kTPh56OU9Uls.png'],
                ],
            ],
            [
                'name' => 'Non-Coffee',
                'icon' => '🥤',
                'products' => [
                    ['name' => 'Caramel Cereal Coffee Candy (C4)',       'price' => 4.50, 'description' => 'Sweet cereal caramel bliss',      'sizes' => $nonCoffeeSizes, 'toppings' => $boba, 'image' => 'products/8pgUpMMUh3KurVWI5fBPkmfE7lRCgjhqaNN70B8c.png'],
                    ['name' => 'Space Cocoa Cream Cheese',               'price' => 4.50, 'description' => 'Chocolatey cocoa cream',          'sizes' => $nonCoffeeSizes, 'toppings' => $cheeseTopping, 'image' => 'products/9OtcRcKpIZMm5ARySVSH8OrSceNRdQdDCuOGsnz0.png'],
                    ['name' => 'Strawberry Melted Chocolate Ice Cream',  'price' => 4.00, 'description' => 'Ice cream with strawberry',       'sizes' => $nonCoffeeSizes, 'toppings' => $boba, 'image' => 'products/Bf89jwyfK1YA591puUgYvDHESLbKtbuWkvDjSnYy.png'],
                    ['name' => 'Caramel Hazelnut Latte Coffee',          'price' => 3.75, 'description' => 'Nutty hazelnut latte',            'sizes' => $nonCoffeeSizes, 'toppings' => null, 'image' => 'products/FeEOECv1Zz0vUwMrNQNoPX7wMwNPJWnJcoPluV0X.png'],
                    ['name' => 'Matcha Green Tea Latte',                 'price' => 4.25, 'description' => 'Premium Japanese matcha',         'sizes' => $nonCoffeeSizes, 'toppings' => $boba, 'image' => 'products/N8bHZ8qKKG7vECXGMUFwvbJglGIhZDAY4YrHUZcF.png'],
                    ['name' => 'Taro Bubble Milk Tea',                   'price' => 4.50, 'description' => 'Creamy taro milk tea with boba',  'sizes' => $nonCoffeeSizes, 'toppings' => $boba, 'image' => 'products/aj47CSHMMOigUY2Y0f99ycsGqvc8CDF9vFdbJkRJ.png'],
                ],
            ],
            [
                'name' => 'Snack',
                'icon' => '🍿',
                'products' => [
                    ['name' => 'Crispy Potato Wedges', 'price' => 3.00, 'description' => 'Golden crispy wedges',  'sizes' => null, 'toppings' => null, 'image' => 'products/ceCeLC8tEjd6Oee4O2XQtwZlWrfzDNn12f75je0U.png'],
                    ['name' => 'Cheese Stick',         'price' => 2.50, 'description' => 'Crunchy cheese sticks', 'sizes' => null, 'toppings' => null, 'image' => 'products/digLSPd6zv1U7s5VrphFHqaChYBnc7Ry1Y5cBjmj.png'],
                    ['name' => 'Crispy Chicken Nuggets','price' => 3.50, 'description' => 'Tender chicken bites', 'sizes' => null, 'toppings' => null, 'image' => 'products/exkTiQQ8kfbyIABxx1kIcaWAgV2z2av7smsQJr6y.png'],
                    ['name' => 'Garlic Butter Toast',   'price' => 2.75, 'description' => 'Savory garlic toast',  'sizes' => null, 'toppings' => null, 'image' => 'products/iqqdfneWwEvCJgHOAdQCUBsbmKjUwRkJNCefWqyq.png'],
                ],
            ],
            [
                'name' => 'Meals',
                'icon' => '🍽',
                'products' => [
                    ['name' => 'Nasi Goreng Spesial Katsu',          'price' => 5.50, 'description' => 'Fried rice with katsu',       'sizes' => null, 'toppings' => null, 'image' => 'products/kWhAR6iSnadJ7coC9GRDWdHU4bpiowEeL8DNjo5S.png'],
                    ['name' => 'Japanese Curry Rice with Egg',        'price' => 6.50, 'description' => 'Japanese curry & egg',        'sizes' => null, 'toppings' => null, 'image' => 'products/qoiT1Yerk52Ls1IzE1CLsWkOrHmtX6bsC5XvnUhS.png'],
                    ['name' => 'Nasi Kulit Sambal Matah Spesial',     'price' => 5.00, 'description' => 'Balinese sambal matah',       'sizes' => null, 'toppings' => null, 'image' => 'products/uDpvtzkh0C0cM8PAekCBLygAncopn3QpEOKByjzK.png'],
                    ['name' => 'Japanese Chicken Curry with Katsu',   'price' => 7.00, 'description' => 'Chicken katsu curry',         'sizes' => null, 'toppings' => null, 'image' => 'products/uxxeqFCz4KJBCzyfoHqNbYul00BAHSlEuiRiKpip.png'],
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
