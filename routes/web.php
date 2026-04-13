<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\Api\FilterController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // User routes
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Project routes
    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Activity Log routes
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

    // Report routes
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('reports/generate', [ReportController::class, 'generate'])->name('reports.generate');

    // API routes
    Route::get('api/projects', [FilterController::class, 'projects']);
    Route::get('api/workers', [FilterController::class, 'workers']);

    // Attendance routes
    Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('attendance/check-in', [AttendanceController::class, 'checkIn'])->name('attendance.check-in');
    Route::put('attendance/{attendance}/check-out', [AttendanceController::class, 'checkOut'])->name('attendance.check-out');
    Route::get('attendance/worker/{worker}', [AttendanceController::class, 'workerOverview'])->name('attendance.worker');
    Route::get('attendance/monthly', [AttendanceController::class, 'monthlyOverview'])->name('attendance.monthly');
});

require __DIR__.'/settings.php';
