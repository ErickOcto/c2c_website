<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
            ['name' => 'Admin', 'email' => 'admin@mail.com', 'password' => Hash::make('password'), 'role' => 'admin', 'is_admin' => true],
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

        $cities = [
            ['name' => 'Jakarta Pusat', 'id' => 152, 'province_id' => 6, 'province' => 'DKI Jakarta', 'postal' => '10110'],
            ['name' => 'Bandung', 'id' => 23, 'province_id' => 9, 'province' => 'Jawa Barat', 'postal' => '40115'],
            ['name' => 'Surabaya', 'id' => 444, 'province_id' => 11, 'province' => 'Jawa Timur', 'postal' => '60119'],
            ['name' => 'Yogyakarta', 'id' => 501, 'province_id' => 5, 'province' => 'DI Yogyakarta', 'postal' => '55281'],
            ['name' => 'Denpasar', 'id' => 114, 'province_id' => 1, 'province' => 'Bali', 'postal' => '80227'],
        ];

        for ($i = 1; $i <= 5; $i++) {
            $city = $cities[$i - 1];
            DB::table('profiles')->insert([
                'user_id' => $i,
                'phone' => '08123'.$i,
                'address' => 'Jl. Test No. '.$i,
                'city' => $city['name'],
                'city_id' => $city['id'],
                'province_id' => $city['province_id'],
                'province_name' => $city['province'],
                'postal_code' => $city['postal'],
            ]);
        }

        /** @var array<int, array{name: string, description: string, price: int, brand: string, condition: string, size: string, color: string, material: string, category_id: int, user_id: int}> $products */
        $products = [
            [
                'name' => 'Slim Fit Green Denim Jacket',
                'description' => 'High quality Slim Fit Green Denim Jacket by Vans. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 430000,
                'brand' => 'Vans',
                'condition' => 'good',
                'size' => '42',
                'color' => 'Green',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 4,
                'user_id' => 2,
            ],
            [
                'name' => 'Basic Pink Blouse',
                'description' => 'High quality Basic Pink Blouse by Levi\'s. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 50000,
                'brand' => 'Levi\'s',
                'condition' => 'good',
                'size' => '41',
                'color' => 'Pink',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 1,
                'user_id' => 3,
            ],
            [
                'name' => 'Casual Green Ring',
                'description' => 'High quality Casual Green Ring by Pull & Bear. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 250000,
                'brand' => 'Pull & Bear',
                'condition' => 'good',
                'size' => '43',
                'color' => 'Green',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 7,
                'user_id' => 3,
            ],
            [
                'name' => 'Elegant Blue Sneakers',
                'description' => 'High quality Elegant Blue Sneakers by Puma. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 270000,
                'brand' => 'Puma',
                'condition' => 'new',
                'size' => 'S',
                'color' => 'Blue',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 5,
                'user_id' => 2,
            ],
            [
                'name' => 'Stylish Grey Summer Dress',
                'description' => 'High quality Stylish Grey Summer Dress by H&M. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 220000,
                'brand' => 'H&M',
                'condition' => 'new',
                'size' => '40',
                'color' => 'Grey',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 3,
                'user_id' => 2,
            ],
            [
                'name' => 'Casual White Track Jacket',
                'description' => 'High quality Casual White Track Jacket by Vans. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 440000,
                'brand' => 'Vans',
                'condition' => 'new',
                'size' => 'L',
                'color' => 'White',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 8,
                'user_id' => 3,
            ],
            [
                'name' => 'Vintage Red Gym Shorts',
                'description' => 'High quality Vintage Red Gym Shorts by Vans. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 250000,
                'brand' => 'Vans',
                'condition' => 'new',
                'size' => 'One Size',
                'color' => 'Red',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 8,
                'user_id' => 2,
            ],
            [
                'name' => 'Slim Fit Multicolor Windbreaker',
                'description' => 'High quality Slim Fit Multicolor Windbreaker by Gucci. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 410000,
                'brand' => 'Gucci',
                'condition' => 'new',
                'size' => '41',
                'color' => 'Multicolor',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 4,
                'user_id' => 2,
            ],
            [
                'name' => 'Stylish Black Mini Dress',
                'description' => 'High quality Stylish Black Mini Dress by Local Brand. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 400000,
                'brand' => 'Local Brand',
                'condition' => 'good',
                'size' => '40',
                'color' => 'Black',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 3,
                'user_id' => 2,
            ],
            [
                'name' => 'Oversized Green Gym Shorts',
                'description' => 'High quality Oversized Green Gym Shorts by Converse. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 420000,
                'brand' => 'Converse',
                'condition' => 'new',
                'size' => '43',
                'color' => 'Green',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 8,
                'user_id' => 2,
            ],
            [
                'name' => 'Basic Grey Mini Dress',
                'description' => 'High quality Basic Grey Mini Dress by Coach. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 50000,
                'brand' => 'Coach',
                'condition' => 'good',
                'size' => '41',
                'color' => 'Grey',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 3,
                'user_id' => 3,
            ],
            [
                'name' => 'Basic Green Gym Shorts',
                'description' => 'High quality Basic Green Gym Shorts by Prada. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 400000,
                'brand' => 'Prada',
                'condition' => 'good',
                'size' => '40',
                'color' => 'Green',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 8,
                'user_id' => 2,
            ],
            [
                'name' => 'Slim Fit Pink Backpack',
                'description' => 'High quality Slim Fit Pink Backpack by Adidas. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 280000,
                'brand' => 'Adidas',
                'condition' => 'new',
                'size' => 'XL',
                'color' => 'Pink',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 6,
                'user_id' => 3,
            ],
            [
                'name' => 'Elegant Black Shoulder Bag',
                'description' => 'High quality Elegant Black Shoulder Bag by Local Brand. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 130000,
                'brand' => 'Local Brand',
                'condition' => 'good',
                'size' => '41',
                'color' => 'Black',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 6,
                'user_id' => 2,
            ],
            [
                'name' => 'Modern Multicolor Blouse',
                'description' => 'High quality Modern Multicolor Blouse by Coach. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 430000,
                'brand' => 'Coach',
                'condition' => 'good',
                'size' => 'One Size',
                'color' => 'Multicolor',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 1,
                'user_id' => 3,
            ],
            [
                'name' => 'Modern Green Shorts',
                'description' => 'High quality Modern Green Shorts by Coach. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 140000,
                'brand' => 'Coach',
                'condition' => 'good',
                'size' => 'S',
                'color' => 'Green',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 2,
                'user_id' => 3,
            ],
            [
                'name' => 'Basic Red Maxi Dress',
                'description' => 'High quality Basic Red Maxi Dress by Nike. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 60000,
                'brand' => 'Nike',
                'condition' => 'good',
                'size' => '43',
                'color' => 'Red',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 3,
                'user_id' => 3,
            ],
            [
                'name' => 'Elegant Black Jeans',
                'description' => 'High quality Elegant Black Jeans by Vans. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 100000,
                'brand' => 'Vans',
                'condition' => 'good',
                'size' => '41',
                'color' => 'Black',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 2,
                'user_id' => 2,
            ],
            [
                'name' => 'Premium Black Shirt',
                'description' => 'High quality Premium Black Shirt by Zara. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 400000,
                'brand' => 'Zara',
                'condition' => 'good',
                'size' => '41',
                'color' => 'Black',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 1,
                'user_id' => 3,
            ],
            [
                'name' => 'Modern White Sunglasses',
                'description' => 'High quality Modern White Sunglasses by Uniqlo. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 280000,
                'brand' => 'Uniqlo',
                'condition' => 'good',
                'size' => '43',
                'color' => 'White',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 7,
                'user_id' => 2,
            ],
            [
                'name' => 'Vintage Multicolor Skirt',
                'description' => 'High quality Vintage Multicolor Skirt by Vans. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 420000,
                'brand' => 'Vans',
                'condition' => 'good',
                'size' => '40',
                'color' => 'Multicolor',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 2,
                'user_id' => 3,
            ],
            [
                'name' => 'Slim Fit Brown Evening Gown',
                'description' => 'High quality Slim Fit Brown Evening Gown by Nike. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 290000,
                'brand' => 'Nike',
                'condition' => 'good',
                'size' => '41',
                'color' => 'Brown',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 3,
                'user_id' => 2,
            ],
            [
                'name' => 'Oversized Yellow Tote Bag',
                'description' => 'High quality Oversized Yellow Tote Bag by Converse. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 190000,
                'brand' => 'Converse',
                'condition' => 'good',
                'size' => 'L',
                'color' => 'Yellow',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 6,
                'user_id' => 2,
            ],
            [
                'name' => 'Stylish Black Summer Dress',
                'description' => 'High quality Stylish Black Summer Dress by Puma. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 160000,
                'brand' => 'Puma',
                'condition' => 'good',
                'size' => '43',
                'color' => 'Black',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 3,
                'user_id' => 2,
            ],
            [
                'name' => 'Vintage Black Leather Jacket',
                'description' => 'High quality Vintage Black Leather Jacket by Adidas. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 410000,
                'brand' => 'Adidas',
                'condition' => 'good',
                'size' => 'M',
                'color' => 'Black',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 4,
                'user_id' => 3,
            ],
            [
                'name' => 'Casual White Tote Bag',
                'description' => 'High quality Casual White Tote Bag by Zara. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 150000,
                'brand' => 'Zara',
                'condition' => 'good',
                'size' => '42',
                'color' => 'White',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 6,
                'user_id' => 2,
            ],
            [
                'name' => 'Modern Multicolor Necklace',
                'description' => 'High quality Modern Multicolor Necklace by Levi\'s. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 390000,
                'brand' => 'Levi\'s',
                'condition' => 'good',
                'size' => '43',
                'color' => 'Multicolor',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 7,
                'user_id' => 2,
            ],
            [
                'name' => 'Modern Blue Boots',
                'description' => 'High quality Modern Blue Boots by Puma. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 330000,
                'brand' => 'Puma',
                'condition' => 'new',
                'size' => 'M',
                'color' => 'Blue',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 5,
                'user_id' => 2,
            ],
            [
                'name' => 'Vintage Grey Trousers',
                'description' => 'High quality Vintage Grey Trousers by Stradivarius. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 240000,
                'brand' => 'Stradivarius',
                'condition' => 'new',
                'size' => 'M',
                'color' => 'Grey',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 2,
                'user_id' => 3,
            ],
            [
                'name' => 'Casual Yellow Jeans',
                'description' => 'High quality Casual Yellow Jeans by Puma. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 290000,
                'brand' => 'Puma',
                'condition' => 'good',
                'size' => 'XL',
                'color' => 'Yellow',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 2,
                'user_id' => 2,
            ],
            [
                'name' => 'Stylish Red T-Shirt',
                'description' => 'High quality Stylish Red T-Shirt by Converse. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 420000,
                'brand' => 'Converse',
                'condition' => 'good',
                'size' => '42',
                'color' => 'Red',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 1,
                'user_id' => 2,
            ],
            [
                'name' => 'Stylish Yellow Skirt',
                'description' => 'High quality Stylish Yellow Skirt by Stradivarius. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 460000,
                'brand' => 'Stradivarius',
                'condition' => 'good',
                'size' => 'One Size',
                'color' => 'Yellow',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 2,
                'user_id' => 3,
            ],
            [
                'name' => 'Oversized White Ring',
                'description' => 'High quality Oversized White Ring by Adidas. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 190000,
                'brand' => 'Adidas',
                'condition' => 'good',
                'size' => 'L',
                'color' => 'White',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 7,
                'user_id' => 3,
            ],
            [
                'name' => 'Stylish Black Leather Jacket',
                'description' => 'High quality Stylish Black Leather Jacket by Nike. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 320000,
                'brand' => 'Nike',
                'condition' => 'good',
                'size' => '41',
                'color' => 'Black',
                'material' => 'Cotton Blend',
                'department' => 'men',
                'category_id' => 4,
                'user_id' => 3,
            ],
            [
                'name' => 'Casual Multicolor Clutch',
                'description' => 'High quality Casual Multicolor Clutch by Nike. Perfect for your everyday look. Comfortable and stylish.',
                'price' => 360000,
                'brand' => 'Nike',
                'condition' => 'good',
                'size' => '41',
                'color' => 'Multicolor',
                'material' => 'Cotton Blend',
                'department' => 'women',
                'category_id' => 6,
                'user_id' => 2,
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert(array_merge($product, [
                'stock' => rand(1, 10),
                'status' => 'active',
            ]));
        }

        for ($i = 1; $i <= count($products); $i++) {
            DB::table('product_images')->insert([
                'product_id' => $i,
                'image_url' => 'https://loremflickr.com/600/800/fashion,clothing?random='.($i * 2 - 1),
            ]);
            DB::table('product_images')->insert([
                'product_id' => $i,
                'image_url' => 'https://loremflickr.com/600/800/fashion,clothing?random='.($i * 2),
            ]);
        }

        // Create a single transaction to cover multiple orders
        $transactionId = DB::table('transactions')->insertGetId([
            'buyer_id' => 1,
            'payment_method' => 'midtrans',
            'payment_status' => 'paid',
            'snap_token' => 'dummy-snap-token',
            'gross_amount' => 300000,
            'paid_at' => Carbon::now(),
        ]);

        for ($i = 1; $i <= 5; $i++) {
            DB::table('orders')->insert([
                'transaction_id' => $transactionId,
                'buyer_id' => 1,
                'seller_id' => 2,
                'total_price' => 50000,
                'shipping_courier' => 'jne',
                'shipping_service' => 'REG',
                'shipping_cost' => 10000,
                'shipping_etd' => 2,
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

        for ($i = 1; $i <= count($products); $i++) {
            DB::table('reviews')->insert([
                'user_id' => rand(1, 4),
                'product_id' => $i,
                'rating' => rand(3, 5),
                'comment' => $reviewComments[array_rand($reviewComments)],
            ]);
        }

        // Create a conversation between user 1 (buyer) and user 2 (seller)
        $conversationId = DB::table('conversations')->insertGetId([
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('conversation_user')->insert([
            ['conversation_id' => $conversationId, 'user_id' => 1, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['conversation_id' => $conversationId, 'user_id' => 2, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);

        for ($i = 1; $i <= 5; $i++) {
            DB::table('messages')->insert([
                'conversation_id' => $conversationId,
                'sender_id' => $i % 2 === 1 ? 1 : 2,
                'receiver_id' => $i % 2 === 1 ? 2 : 1,
                'message' => $i % 2 === 1 ? 'Hi, is this item still available?' : 'Yes it is! Would you like to purchase?',
                'created_at' => Carbon::now()->addMinutes($i),
                'updated_at' => Carbon::now()->addMinutes($i),
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            DB::table('notifications')->insert([
                'id' => Str::uuid(),
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
