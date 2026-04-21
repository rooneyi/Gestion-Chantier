<?php

use App\Models\Material;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when visiting materials page', function () {
    $this->get(route('materials.index'))->assertRedirect(route('login'));
});

test('authenticated users can view materials page', function () {
    $user = User::factory()->create();
    Material::factory()->create([
        'name' => 'Ciment',
        'description' => 'Fournisseur A',
        'quantity_in_stock' => 250,
        'unit' => 'sacs',
    ]);

    $this->actingAs($user)
        ->get(route('materials.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('materials/index')
            ->has('materials', 1)
            ->where('materials.0.name', 'Ciment')
        );
});
