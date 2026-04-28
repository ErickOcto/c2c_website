<?php
$categories = [
    1 => ['name' => 'Tops', 'department' => 'women'],
    2 => ['name' => 'Bottoms', 'department' => 'women'],
    3 => ['name' => 'Dresses', 'department' => 'women'],
    4 => ['name' => 'Outerwear', 'department' => 'men'],
    5 => ['name' => 'Shoes', 'department' => 'men'],
    6 => ['name' => 'Bags', 'department' => 'women'],
    7 => ['name' => 'Accessories', 'department' => 'women'],
    8 => ['name' => 'Activewear', 'department' => 'men'],
];

$brands = ['Levi\'s', 'Zara', 'Uniqlo', 'H&M', 'Converse', 'Coach', 'Nike', 'Adidas', 'Puma', 'Vans', 'Gucci', 'Prada', 'Local Brand', 'Stradivarius', 'Pull & Bear'];
$colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Brown', 'Grey', 'Pink', 'Multicolor'];
$sizes = ['S', 'M', 'L', 'XL', 'One Size', '40', '41', '42', '43'];
$conditions = ['new', 'good', 'fair'];

$products = [];
$id = 1;

$adjectives = ['Vintage', 'Classic', 'Modern', 'Elegant', 'Casual', 'Oversized', 'Slim Fit', 'Premium', 'Basic', 'Stylish'];
$items = [
    1 => ['T-Shirt', 'Blouse', 'Crop Top', 'Tank Top', 'Shirt'],
    2 => ['Jeans', 'Trousers', 'Shorts', 'Skirt', 'Sweatpants'],
    3 => ['Maxi Dress', 'Mini Dress', 'Summer Dress', 'Evening Gown'],
    4 => ['Denim Jacket', 'Leather Jacket', 'Windbreaker', 'Coat', 'Blazer'],
    5 => ['Sneakers', 'Boots', 'Running Shoes', 'Sandals', 'Loafers'],
    6 => ['Crossbody Bag', 'Tote Bag', 'Backpack', 'Clutch', 'Shoulder Bag'],
    7 => ['Necklace', 'Sunglasses', 'Watch', 'Bracelet', 'Ring'],
    8 => ['Leggings', 'Sports Bra', 'Track Jacket', 'Gym Shorts'],
];

for ($i = 1; $i <= 35; $i++) {
    $cat_id = array_rand($categories);
    $cat = $categories[$cat_id];
    
    $adj = $adjectives[array_rand($adjectives)];
    $item = $items[$cat_id][array_rand($items[$cat_id])];
    $color = $colors[array_rand($colors)];
    $brand = $brands[array_rand($brands)];
    
    $name = "$adj $color $item";
    $description = "High quality $name by $brand. Perfect for your everyday look. Comfortable and stylish.";
    
    $products[] = [
        'name' => $name,
        'description' => $description,
        'price' => rand(5, 50) * 10000,
        'brand' => $brand,
        'condition' => $conditions[array_rand($conditions)],
        'size' => $sizes[array_rand($sizes)],
        'color' => $color,
        'material' => 'Cotton Blend', // simplifying
        'department' => $cat['department'],
        'category_id' => $cat_id,
        'user_id' => rand(2, 3), // Sellers are user 2 and 3
    ];
}

echo "        \$products = [\n";
foreach ($products as $p) {
    echo "            [\n";
    foreach ($p as $k => $v) {
        if (is_string($v)) {
            $v = addslashes($v);
            echo "                '$k' => '$v',\n";
        } else {
            echo "                '$k' => $v,\n";
        }
    }
    echo "            ],\n";
}
echo "        ];\n";
