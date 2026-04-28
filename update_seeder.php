<?php

$seeder = file_get_contents('database/seeders/DatabaseSeeder.php');
$array_str = file_get_contents('products_array.txt');

// 1. Replace the products array
$pattern = '/\$products = \[\n(.*?)\];\n/s';
$seeder = preg_replace($pattern, $array_str, $seeder, 1);

// 2. Replace the image generation loop
$old_image_loop = <<<EOT
        for (\$i = 1; \$i <= 10; \$i++) {
            DB::table('product_images')->insert([
                'product_id' => \$i,
                'image_url' => 'https://placehold.co/600x800/e2e8f0/475569?text=Fashion+'.\$i,
            ]);
            DB::table('product_images')->insert([
                'product_id' => \$i,
                'image_url' => 'https://placehold.co/600x800/fecaca/991b1b?text=Detail+'.\$i,
            ]);
        }
EOT;

$new_image_loop = <<<EOT
        for (\$i = 1; \$i <= count(\$products); \$i++) {
            DB::table('product_images')->insert([
                'product_id' => \$i,
                'image_url' => 'https://loremflickr.com/600/800/fashion,clothing?random=' . (\$i * 2 - 1),
            ]);
            DB::table('product_images')->insert([
                'product_id' => \$i,
                'image_url' => 'https://loremflickr.com/600/800/fashion,clothing?random=' . (\$i * 2),
            ]);
        }
EOT;

$seeder = str_replace($old_image_loop, $new_image_loop, $seeder);

// 3. Update reviews loop to cover all products
$old_reviews_loop = <<<EOT
        for (\$i = 1; \$i <= 10; \$i++) {
            DB::table('reviews')->insert([
                'user_id' => \$i <= 5 ? 1 : 4,
                'product_id' => \$i,
                'rating' => rand(3, 5),
                'comment' => \$reviewComments[\$i - 1],
            ]);
        }
EOT;

$new_reviews_loop = <<<EOT
        for (\$i = 1; \$i <= count(\$products); \$i++) {
            DB::table('reviews')->insert([
                'user_id' => rand(1, 4),
                'product_id' => \$i,
                'rating' => rand(3, 5),
                'comment' => \$reviewComments[array_rand(\$reviewComments)],
            ]);
        }
EOT;

$seeder = str_replace($old_reviews_loop, $new_reviews_loop, $seeder);

file_put_contents('database/seeders/DatabaseSeeder.php', $seeder);
echo "Updated Seeder.\n";
