<?php

namespace Database\Factories;

use App\Models\Material;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Material>
 */
class MaterialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $units = ['sacs', 'tonnes', 'milliers', 'm3'];

        return [
            'name' => $this->faker->randomElement(['Ciment', 'Acier', 'Briques', 'Bois']),
            'description' => 'Fournisseur '.$this->faker->randomElement(['A', 'B', 'C']),
            'quantity_in_stock' => $this->faker->randomFloat(2, 20, 800),
            'unit' => $this->faker->randomElement($units),
            'category' => $this->faker->randomElement(['construction', 'metaux', 'maconnerie', 'charpente']),
        ];
    }
}
