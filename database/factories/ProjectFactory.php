<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'budget' => fake()->numberBetween(10000, 100000),
            'start_date' => now(),
            'deadline' => now()->addMonths(6),
            'status' => 'en_cours',
            'manager_id' => fn () => User::factory()->create(['role' => UserRole::Manager->value])->id,
        ];
    }
}
