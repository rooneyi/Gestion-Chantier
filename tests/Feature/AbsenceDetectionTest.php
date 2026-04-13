<?php

use App\Enums\UserRole;
use App\Models\AbsenceNotification;
use App\Models\Project;
use App\Models\User;
use App\Services\AbsenceDetectionService;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    Notification::fake();
});

it('detects absence when worker has no attendance', function () {
    $manager = User::factory()->create(['role' => UserRole::Manager->value]);
    $worker = User::factory()->create(['role' => UserRole::Worker->value]);
    $project = Project::factory()->create(['manager_id' => $manager->id]);
    $project->workers()->attach($worker);

    $service = app(AbsenceDetectionService::class);
    $count = $service->detectAbsences(now()->startOfDay());

    expect($count)->toBeGreaterThanOrEqual(1);
});

it('marks absence as resolved', function () {
    $notification = AbsenceNotification::factory()->create(['status' => 'pending']);
    $service = app(AbsenceDetectionService::class);

    $service->resolveAbsence($notification);
    $notification->refresh();

    expect($notification->status)->toBe('resolved');
});
