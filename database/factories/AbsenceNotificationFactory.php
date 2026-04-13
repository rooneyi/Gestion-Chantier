<?php

namespace Database\Factories;

use App\Models\AbsenceNotification;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AbsenceNotification>
 */
class AbsenceNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fn () => User::factory(),
            'project_id' => fn () => Project::factory(),
            'absence_date' => $this->faker->date(),
            'status' => $this->faker->randomElement(['pending', 'notified', 'resolved']),
            'notified_at' => now(),
            'read_at' => null,
            'reason' => null,
        ];
    }
}
