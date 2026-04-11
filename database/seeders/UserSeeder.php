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
        User::create([
            'name' => 'Manager Demo',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Manager,
        ]);
        User::create([
            'name' => 'Engineer Demo',
            'email' => 'engineer@example.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Engineer,
        ]);
        User::create([
            'name' => 'Worker Demo',
            'email' => 'worker@example.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Worker,
        ]);
        User::create([
            'name' => 'Magasinier Demo',
            'email' => 'magasinier@example.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Magasinier,
        ]);
        User::create([
            'name' => 'Chef Chantier Demo',
            'email' => 'chefchantier@example.com',
            'password' => Hash::make('password'),
            'role' => UserRole::ChefChantier,
        ]);
    }
}
