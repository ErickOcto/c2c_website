<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Product\Models\Category;
use Modules\Product\Models\Product;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Product>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'brand' => fake()->company(),
            'condition' => fake()->randomElement(['new', 'good', 'bad', 'poor']),
            'size' => fake()->randomElement(['S', 'M', 'L', 'XL']),
            'color' => fake()->colorName(),
            'material' => fake()->randomElement(['Cotton', 'Polyester', 'Linen', 'Denim']),
            'department' => fake()->randomElement(['men', 'women', 'kids', 'unisex']),
            'price' => fake()->numberBetween(10000, 1000000),
            'stock' => fake()->numberBetween(1, 50),
            'status' => 'active',
        ];
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }
}
