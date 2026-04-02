<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
public function run()
{
    DB::table('users')->insert([
        ['name'=>'User1','email'=>'u1@mail.com','password'=>Hash::make('123'),'role'=>'buyer'],
        ['name'=>'User2','email'=>'u2@mail.com','password'=>Hash::make('123'),'role'=>'seller'],
        ['name'=>'User3','email'=>'u3@mail.com','password'=>Hash::make('123'),'role'=>'seller'],
        ['name'=>'User4','email'=>'u4@mail.com','password'=>Hash::make('123'),'role'=>'buyer'],
        ['name'=>'Admin','email'=>'admin@mail.com','password'=>Hash::make('123'),'role'=>'admin'],
    ]);

    DB::table('categories')->insert([
        ['name'=>'Electronics'],
        ['name'=>'Fashion'],
        ['name'=>'Books'],
        ['name'=>'Furniture'],
        ['name'=>'Others'],
    ]);

    for ($i=1; $i<=5; $i++) {
        DB::table('profiles')->insert([
            'user_id'=>$i,
            'phone'=>'08123'.$i,
            'address'=>'Address '.$i,
            'city'=>'City '.$i,
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('products')->insert([
            'user_id'=>2,
            'category_id'=>$i,
            'name'=>'Product '.$i,
            'description'=>'Description '.$i,
            'price'=>10000*$i,
            'stock'=>10,
            'status'=>'active',
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('product_images')->insert([
            'product_id'=>$i,
            'image_url'=>'image'.$i.'.jpg',
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('orders')->insert([
            'buyer_id'=>1,
            'total_price'=>50000,
            'status'=>'pending',
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('order_items')->insert([
            'order_id'=>$i,
            'product_id'=>$i,
            'quantity'=>1,
            'price'=>10000,
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('transactions')->insert([
            'order_id'=>$i,
            'payment_method'=>'midtrans',
            'payment_status'=>'paid',
            'paid_at'=>Carbon::now(),
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('reviews')->insert([
            'user_id'=>1,
            'product_id'=>$i,
            'rating'=>5,
            'comment'=>'Good product '.$i,
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('messages')->insert([
            'sender_id'=>1,
            'receiver_id'=>2,
            'message'=>'Hello '.$i,
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('notifications')->insert([
            'user_id'=>1,
            'title'=>'Notif '.$i,
            'content'=>'Content '.$i,
            'is_read'=>false,
        ]);
    }

    for ($i=1; $i<=5; $i++) {
        DB::table('reports')->insert([
            'reporter_id'=>1,
            'product_id'=>$i,
            'reason'=>'Fake product '.$i,
            'status'=>'pending',
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

    for ($i = 1; $i <= 5; $i++) {
        DB::table('cart_items')->insert([
            'cart_id' => 1,
            'product_id' => $i,
            'quantity' => rand(1, 3),
        ]);
    }

    for ($i = 1; $i <= 5; $i++) {
        DB::table('shippings')->insert([
            'order_id' => $i,
            'courier' => 'JNE',
            'tracking_number' => 'RESI00' . $i,
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
            'description' => 'Product ' . $i . ' is not original',
            'status' => 'open',
        ]);
    }

    foreach (range(1, 5) as $i) {
        DB::table('dispute_messages')->insert([
            [
                'dispute_id' => $i,
                'sender_id' => 1,
                'message' => 'I want refund for order ' . $i,
            ],
            [
                'dispute_id' => $i,
                'sender_id' => 2,
                'message' => 'Please provide proof',
            ],
        ]);
    }    
}
}
