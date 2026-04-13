<?php

use App\Enums\UserRole;
use App\Models\AbsenceNotification;
use App\Models\Attendance;
use App\Models\Project;
use App\Models\User;
use App\Services\AbsenceDetectionService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    Notification::fake();
});

it('detects absence when worker has no attendance record', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager->value]);
    $worker = User::factory()->create(['role' => UserRole::Worker->value]);
    $project = Project::factory()->create(['manager_id' => $manager->id]);
    $project->workers()->attach($worker);

    $service = app(AbsenceDetectionService::class);
    $absenceCount = $service->detectAbsences(now()->startOfDay());

    expect($absenceCount)->toBe(1);
    expect(AbsenceNotification::where('user_id', $worker->id)->exists())->toBeTrue();
});

it('does not detect absence when worker has attendance record', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager->value]);
    $worker = User::factory()->create(['role' => UserRole::Worker->value]);
    $project = Project::factory()->create(['manager_id' => $manager->id]);
    $project->workers()->attach($worker);

    Attendance::factory()->create([
        'user_id' => $worker->id,
        'project_id' => $project->id,
        'date' => now(),
    ]);

    $service = app(AbsenceDetectionService::class);
    $absenceCount = $service->detectAbsences(now()->startOfDay());

    expect($absenceCount)->toBe(0);
});

it('can mark absence as resolved', function () {
    $notification = AbsenceNotification::factory()->create(['status' => 'pending']);
    $service = app(AbsenceDetectionService::class);

    $service->resolveAbsence($notification);

    $notification->refresh();
    expect($notification->status)->toBe('resolved');
});

it('can add reason to absence', function () {
    $notification = AbsenceNotification::factory()->create();
    $service = app(AbsenceDetectionService::class);

    $service->addAbsenceReason($notification, 'Congé malade');

    $notification->refresh();
    expect($notification->reason)->toBe('Congé malade');
});

it('skips weekends when checking for absences', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager->value]);
    $worker = User::factory()->create(['role' => UserRole::Worker->value]);
    $project = Project::factory()->create(['manager_id' => $manager->id]);
    $project->workers()->attach($worker);

    $service = app(AbsenceDetectionService::class);
    $saturday = now()->next(Carbon::SATURDAY)->startOfDay();

    $absenceCount = $service->detectAbsences($saturday);

    expect($absenceCount)->toBe(0);
});

it('can retrieve pending absences via controller', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager->value]);
    AbsenceNotification::factory()->create(['status' => 'pending']);

    $this->actingAs($manager);
    $response = $this->getJson('/api/absences/pending');

    $response->assertSuccessful();
    expect($response->json('count'))->toBeGreaterThanOrEqual(1);
});

it('can filter absence notifications', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager->value]);
    AbsenceNotification::factory()->create([
        'status' => 'pending',
        'absence_date' => now()->toDateString(),
    ]);

    $this->actingAs($manager);
    $response = $this->getJson('/api/absences/filter?status=pending');

    $response->assertSuccessful();
    expect($response->json('data'))->toHaveCount(1);
});


