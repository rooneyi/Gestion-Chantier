<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            UserRole::Manager,
            UserRole::Engineer,
            UserRole::Worker,
            UserRole::Magasinier,
            UserRole::ChefChantier,
        ];

        foreach ($roles as $role) {
            for ($index = 1; $index <= 10; $index++) {
                User::updateOrCreate(
                    ['email' => "{$role->value}{$index}@example.com"],
                    [
                        'name' => ucfirst(str_replace('_', ' ', $role->value))." {$index}",
                        'password' => Hash::make('password'),
                        'role' => $role,
                    ]
                );
            }
        }
    }
}
