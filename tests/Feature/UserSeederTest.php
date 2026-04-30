<?php

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\Hash;

test('user seeder creates 10 users per role', function () {
    $this->seed(UserSeeder::class);

    expect(
        User::where('role', UserRole::Manager)->count()
    )->toBe(10);

    expect(
        User::where('role', UserRole::Engineer)->count()
    )->toBe(10);

    expect(
        User::where('role', UserRole::Worker)->count()
    )->toBe(10);

    expect(
        User::where('role', UserRole::Magasinier)->count()
    )->toBe(10);

    expect(
        User::where('role', UserRole::ChefChantier)->count()
    )->toBe(10);

    $manager = User::where('email', 'manager1@example.com')->first();

    expect($manager)->not()->toBeNull();
    expect(Hash::check('password', $manager->password))->toBeTrue();
});
