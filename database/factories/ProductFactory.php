<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'description' => fake()->text(20),
            'stock' => fake()->numberBetween(1, 250),
            'price' => fake()->randomFloat(min: 10, max: 999),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
