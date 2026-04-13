<?php

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\User;

test('manager can create project with steps and auto-calculated budget', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager]);
    
    $this->actingAs($manager)->postJson('/projects', [
        'name' => 'Chantier Centre Ville',
        'description' => 'Rénovation complète',
        'deadline' => now()->addDays(30)->toDateString(),
        'steps' => [
            ['name' => 'Phase 1', 'budget' => 1000],
            ['name' => 'Phase 2', 'budget' => 2000],
            ['name' => 'Phase 3', 'budget' => 1500],
        ],
    ])->assertStatus(201)
    ->assertJson(['message' => 'Projet créé avec succès'])
    ->assertJsonPath('project.budget', '4500.00')
    ->assertJsonPath('project.status', 'initialisation')
    ->assertJsonPath('project.manager_id', $manager->id)
    ->assertJsonCount(3, 'project.steps');
    
    expect(Project::count())->toBe(1);
    $project = Project::first();
    expect((float) $project->budget)->toBe(4500.0);
    expect($project->steps->count())->toBe(3);
    expect($project->steps[0]->name)->toBe('Phase 1');
    expect((float) $project->steps[0]->budget)->toBe(1000.0);
});

test('manager can override auto-calculated budget', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager]);
    
    $this->actingAs($manager)->postJson('/projects', [
        'name' => 'Projet avec override',
        'description' => 'Budget override test',
        'deadline' => now()->addDays(30)->toDateString(),
        'budget' => 5500, // Override the calculated total (1000 + 2000 = 3000)
        'steps' => [
            ['name' => 'Étape 1', 'budget' => 1000],
            ['name' => 'Étape 2', 'budget' => 2000],
        ],
    ])->assertStatus(201)
    ->assertJsonPath('project.budget', '5500.00'); // Should use the override
});

test('project requires deadline in future', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager]);
    
    $this->actingAs($manager)->postJson('/projects', [
        'name' => 'Invalid Project',
        'deadline' => now()->subDays(1)->toDateString(),
        'steps' => [
            ['name' => 'Phase 1', 'budget' => 1000],
        ],
    ])->assertStatus(422)
    ->assertJsonValidationErrors('deadline');
});

test('project requires at least one step', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager]);
    
    $this->actingAs($manager)->postJson('/projects', [
        'name' => 'No Steps Project',
        'deadline' => now()->addDays(30)->toDateString(),
        'steps' => [],
    ])->assertStatus(422)
    ->assertJsonValidationErrors('steps');
});

test('each step requires name and budget', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager]);
    
    $response = $this->actingAs($manager)->postJson('/projects', [
        'name' => 'Invalid Steps',
        'deadline' => now()->addDays(30)->toDateString(),
        'steps' => [
            ['name' => 'Phase 1'], // Missing budget
            ['budget' => 1000], // Missing name
        ],
    ]);
    
    $response->assertStatus(422);
    expect($response->json('errors'))->toHaveKey('steps.0.budget');
    expect($response->json('errors'))->toHaveKey('steps.1.name');
});

test('steps are created with correct order', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager]);
    
    $this->actingAs($manager)->postJson('/projects', [
        'name' => 'Order Test',
        'deadline' => now()->addDays(30)->toDateString(),
        'steps' => [
            ['name' => 'First', 'budget' => 1000],
            ['name' => 'Second', 'budget' => 2000],
            ['name' => 'Third', 'budget' => 3000],
        ],
    ])->assertStatus(201);
    
    $project = Project::first();
    expect($project->steps[0]->order)->toBe(1);
    expect($project->steps[1]->order)->toBe(2);
    expect($project->steps[2]->order)->toBe(3);
});

