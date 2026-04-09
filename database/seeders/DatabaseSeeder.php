<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            ['name' => 'Sarah Style', 'email' => 'sarah@mail.com', 'password' => Hash::make('password'), 'role' => 'buyer'],
            ['name' => 'Vintage Vogue Shop', 'email' => 'vogue@mail.com', 'password' => Hash::make('password'), 'role' => 'seller'],
            ['name' => 'Preloved Palace', 'email' => 'palace@mail.com', 'password' => Hash::make('password'), 'role' => 'seller'],
            ['name' => 'FashionFinder', 'email' => 'finder@mail.com', 'password' => Hash::make('password'), 'role' => 'buyer'],
            ['name' => 'Admin', 'email' => 'admin@mail.com', 'password' => Hash::make('password'), 'role' => 'admin'],
        ]);

        DB::table('categories')->insert([
            ['name' => 'Tops', 'slug' => 'tops', 'icon' => 'shirt'],
            ['name' => 'Bottoms', 'slug' => 'bottoms', 'icon' => 'pants'],
            ['name' => 'Dresses', 'slug' => 'dresses', 'icon' => 'dress'],
            ['name' => 'Outerwear', 'slug' => 'outerwear', 'icon' => 'jacket'],
            ['name' => 'Shoes', 'slug' => 'shoes', 'icon' => 'shoe'],
            ['name' => 'Bags', 'slug' => 'bags', 'icon' => 'bag'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'icon' => 'accessory'],
            ['name' => 'Activewear', 'slug' => 'activewear', 'icon' => 'activewear'],
        ]);

        for ($i = 1; $i <= 5; $i++) {
            DB::table('profiles')->insert([
                'user_id' => $i,
                'phone' => '08123'.$i,
                'address' => 'Address '.$i,
                'city' => collect(['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali'])->get($i - 1),
            ]);
        }

        /** @var array<int, array{name: string, description: string, price: int, brand: string, condition: string, size: string, color: string, material: string, category_id: int, user_id: int}> $products */
        $products = [
            [
                'name' => 'Vintage Denim Jacket',
                'description' => 'Classic vintage denim jacket from the 90s. Slightly faded for that authentic look. Great for layering in any season.',
                'price' => 350000,
                'brand' => 'Levi\'s',
                'condition' => 'good',
                'size' => 'M',
                'color' => 'Blue',
                'material' => 'Denim',
                'department' => 'men',
                'category_id' => 4,
                'user_id' => 2,
            ],
            [
                'name' => 'Silk Floral Blouse',
                'description' => 'Beautiful silk floral blouse with delicate pattern. Perfect for both casual and formal occasions.',
                'price' => 180000,
                'brand' => 'Zara',
                'condition' => 'new',
                'size' => 'S',
                'color' => 'Pink',
                'material' => 'Silk',
                'department' => 'women',
                'category_id' => 1,
                'user_id' => 2,
            ],
            [
                'name' => 'High-Waist Wide Leg Pants',
                'description' => 'Elegant high-waist wide leg pants. Comfortable and stylish for everyday wear. Pairs well with crop tops or tucked-in blouses.',
                'price' => 220000,
                'brand' => 'Uniqlo',
                'condition' => 'good',
                'size' => 'L',
                'color' => 'Black',
                'material' => 'Polyester',
                'department' => 'women',
                'category_id' => 2,
                'user_id' => 3,
            ],
            [
                'name' => 'Bohemian Maxi Dress',
                'description' => 'Flowy bohemian maxi dress with beautiful ethnic print. Perfect for beach days and summer festivals.',
                'price' => 275000,
                'brand' => 'H&M',
                'condition' => 'good',
                'size' => 'M',
                'color' => 'Multicolor',
                'material' => 'Rayon',
                'category_id' => 3,
                'user_id' => 3,
            ],
            [
                'name' => 'Canvas Sneakers',
                'description' => 'Classic canvas sneakers in great condition. Comfortable and versatile for daily wear.',
                'price' => 150000,
                'brand' => 'Converse',
                'condition' => 'good',
                'size' => '42',
                'color' => 'White',
                'material' => 'Canvas',
                'category_id' => 5,
                'user_id' => 2,
            ],
            [
                'name' => 'Leather Crossbody Bag',
                'description' => 'Compact leather crossbody bag with adjustable strap. Multiple compartments for organizing essentials.',
                'price' => 450000,
                'brand' => 'Coach',
                'condition' => 'good',
                'size' => 'One Size',
                'color' => 'Brown',
                'material' => 'Leather',
                'category_id' => 6,
                'user_id' => 3,
            ],
            [
                'name' => 'Oversized Knit Sweater',
                'description' => 'Cozy oversized knit sweater perfect for chilly weather. Soft texture and relaxed fit.',
                'price' => 195000,
                'brand' => 'Pull & Bear',
                'condition' => 'new',
                'size' => 'XL',
                'color' => 'Cream',
                'material' => 'Wool Blend',
                'category_id' => 1,
                'user_id' => 2,
            ],
            [
                'name' => 'Gold Layered Necklace Set',
                'description' => 'Elegant gold-plated layered necklace set. Three different lengths for a trendy layered look.',
                'price' => 85000,
                'brand' => 'Local Brand',
                'condition' => 'new',
                'size' => 'One Size',
                'color' => 'Gold',
                'material' => 'Gold Plated',
                'category_id' => 7,
                'user_id' => 3,
            ],
            [
                'name' => 'Sports Leggings',
                'description' => 'High-performance sports leggings with moisture-wicking fabric. Squat-proof and comfortable for any workout.',
                'price' => 165000,
                'brand' => 'Nike',
                'condition' => 'good',
                'size' => 'M',
                'color' => 'Black',
                'material' => 'Spandex',
                'category_id' => 8,
                'user_id' => 2,
            ],
            [
                'name' => 'Plaid Mini Skirt',
                'description' => 'Preppy plaid mini skirt with side zipper. Great for school-inspired outfits or casual looks.',
                'price' => 120000,
                'brand' => 'Stradivarius',
                'condition' => 'good',
                'size' => 'S',
                'color' => 'Red Plaid',
                'material' => 'Cotton Blend',
                'category_id' => 2,
                'user_id' => 3,
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert(array_merge($product, [
                'stock' => rand(1, 10),
                'status' => 'active',
            ]));
        }

        for ($i = 1; $i <= 10; $i++) {
            DB::table('product_images')->insert([
                'product_id' => $i,
                'image_url' => 'https://placehold.co/600x800/e2e8f0/475569?text=Fashion+'.$i,
            ]);
            DB::table('product_images')->insert([
                'product_id' => $i,
                'image_url' => 'https://placehold.co/600x800/fecaca/991b1b?text=Detail+'.$i,
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('orders')->insert([
                'buyer_id' => 1,
                'total_price' => 50000,
                'status' => 'pending',
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('order_items')->insert([
                'order_id' => $i,
                'product_id' => $i,
                'quantity' => 1,
                'price' => 10000,
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('transactions')->insert([
                'order_id' => $i,
                'payment_method' => 'midtrans',
                'payment_status' => 'paid',
                'paid_at' => Carbon::now(),
            ]);
        }

        $reviewComments = [
            'Great quality for a pre-loved item! Very satisfied.',
            'Item matches the description perfectly. Fast shipping too!',
            'Good condition, as described. Would buy again.',
            'Amazing find! This piece looks almost brand new.',
            'Love the style! True to size and comfortable.',
            'Seller was very responsive and helpful.',
            'Excellent item, exceeded my expectations!',
            'Nice fabric quality, worth the price.',
            'Perfect for my wardrobe, thank you!',
            'Slightly worn at the edges but overall great.',
        ];

        for ($i = 1; $i <= 10; $i++) {
            DB::table('reviews')->insert([
                'user_id' => $i <= 5 ? 1 : 4,
                'product_id' => $i,
                'rating' => rand(3, 5),
                'comment' => $reviewComments[$i - 1],
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('messages')->insert([
                'sender_id' => 1,
                'receiver_id' => 2,
                'message' => 'Hello '.$i,
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('notifications')->insert([
                'id' => \Illuminate\Support\Str::uuid(),
                'type' => 'App\Notifications\SystemNotification',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => 1,
                'data' => json_encode(['title' => 'Notif '.$i, 'message' => 'Content '.$i]),
                'read_at' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('reports')->insert([
                'reporter_id' => 1,
                'product_id' => $i,
                'reason' => 'Fake product '.$i,
                'status' => 'pending',
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('wishlists')->insert([
                'user_id' => 1,
                'product_id' => $i,
            ]);
        }

        DB::table('carts')->insert([
            ['user_id' => 1],
            ['user_id' => 2],
            ['user_id' => 3],
            ['user_id' => 4],
            ['user_id' => 5],
        ]);

        $sizes = ['S', 'M', 'L', 'XL', '42'];
        for ($i = 1; $i <= 5; $i++) {
            DB::table('cart_items')->insert([
                'cart_id' => 1,
                'product_id' => $i,
                'quantity' => rand(1, 3),
                'size' => $sizes[$i - 1],
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('shippings')->insert([
                'order_id' => $i,
                'courier' => 'JNE',
                'tracking_number' => 'RESI00'.$i,
                'status' => 'shipped',
            ]);
        }

        foreach (range(1, 5) as $i) {
            DB::table('shipping_histories')->insert([
                [
                    'shipping_id' => $i,
                    'status' => 'Package picked up',
                    'location' => 'Warehouse',
                    'updated_at' => now(),
                ],
                [
                    'shipping_id' => $i,
                    'status' => 'In transit',
                    'location' => 'Jakarta',
                    'updated_at' => now(),
                ],
                [
                    'shipping_id' => $i,
                    'status' => 'Delivered',
                    'location' => 'Customer City',
                    'updated_at' => now(),
                ],
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('disputes')->insert([
                'order_id' => $i,
                'buyer_id' => 1,
                'seller_id' => 2,
                'reason' => 'Item not as described',
                'description' => 'Product '.$i.' is not original',
                'status' => 'open',
            ]);
        }

        foreach (range(1, 5) as $i) {
            DB::table('dispute_messages')->insert([
                [
                    'dispute_id' => $i,
                    'sender_id' => 1,
                    'message' => 'I want refund for order '.$i,
                ],
                [
                    'dispute_id' => $i,
                    'sender_id' => 2,
                    'message' => 'Please provide proof',
                ],
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('user_otps')->insert([
                'user_id' => $i,
                'code' => sprintf('%06d', rand(0, 999999)),
                'expires_at' => Carbon::now()->addMinutes(10),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
