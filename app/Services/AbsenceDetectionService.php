<?php

namespace App\Services;

use App\Models\AbsenceNotification;
use App\Models\Project;
use App\Models\User;
use App\Notifications\AbsenceDetectedNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AbsenceDetectionService
{
    private const ABSENCE_CHECK_TIME = '09:00'; // Check for absences after 9 AM

    /**
     * Detect absences for a given date and send notifications
     */
    public function detectAbsences(?Carbon $forDate = null): int
    {
        $forDate ??= now()->startOfDay();

        // Don't check on weekends
        if ($forDate->isWeekend()) {
            return 0;
        }

        // Get all active projects
        $projects = Project::where('status', '!=', 'completed')
            ->with('workers')
            ->get();

        $notificationsCreated = 0;

        foreach ($projects as $project) {
            $notificationsCreated += $this->checkProjectAbsences($project, $forDate);
        }

        return $notificationsCreated;
    }

    /**
     * Check absences for a specific project
     */
    private function checkProjectAbsences(Project $project, Carbon $forDate): int
    {
        $notificationsCreated = 0;

        foreach ($project->workers as $worker) {
            // Skip if already notified for this date and project
            $existingNotification = AbsenceNotification::where('user_id', $worker->id)
                ->where('project_id', $project->id)
                ->where('absence_date', $forDate->toDateString())
                ->exists();

            if ($existingNotification) {
                continue;
            }

            // Check if worker has any attendance record for this date and project
            $hasAttendance = $worker->attendances()
                ->where('project_id', $project->id)
                ->whereDate('date', $forDate->toDateString())
                ->exists();

            if (! $hasAttendance) {
                $notification = $this->createAbsenceNotification($worker, $project, $forDate);
                $this->notifyManager($project, $worker, $notification);
                $notificationsCreated++;
            }
        }

        return $notificationsCreated;
    }

    /**
     * Create an absence notification record
     */
    private function createAbsenceNotification(
        User $worker,
        Project $project,
        Carbon $forDate
    ): AbsenceNotification {
        return AbsenceNotification::create([
            'user_id' => $worker->id,
            'project_id' => $project->id,
            'absence_date' => $forDate->toDateString(),
            'status' => 'pending',
            'notified_at' => now(),
        ]);
    }

    /**
     * Send notification to project managers
     */
    private function notifyManager(Project $project, User $worker, AbsenceNotification $notification): void
    {
        // Get project manager (usually the ChefChantier or Engineer assigned to the project)
        $managers = $project->createdBy?->role === 'Engineer'
            ? collect([$project->createdBy])
            : User::whereIn('role', ['Manager', 'Engineer'])
                ->where('status', 'active')
                ->take(1)
                ->get();

        foreach ($managers as $manager) {
            try {
                $manager->notify(new AbsenceDetectedNotification($worker, $notification));
                Log::info('Absence notification sent', [
                    'worker_id' => $worker->id,
                    'project_id' => $project->id,
                    'manager_id' => $manager->id,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send absence notification', [
                    'error' => $e->getMessage(),
                    'worker_id' => $worker->id,
                    'project_id' => $project->id,
                ]);
            }
        }
    }

    /**
     * Mark absence as resolved
     */
    public function resolveAbsence(AbsenceNotification $notification): void
    {
        $notification->markAsResolved();
    }

    /**
     * Add reason for absence
     */
    public function addAbsenceReason(AbsenceNotification $notification, string $reason): void
    {
        $notification->update(['reason' => $reason]);
    }
}
