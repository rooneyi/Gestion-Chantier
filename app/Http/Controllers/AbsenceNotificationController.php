<?php

namespace App\Http\Controllers;

use App\Models\AbsenceNotification;
use App\Services\AbsenceDetectionService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class AbsenceNotificationController extends Controller
{
    public function __construct(private AbsenceDetectionService $absenceDetectionService) {}

    /**
     * Display all absence notifications
     */
    public function index(): Response
    {
        $absenceNotifications = AbsenceNotification::with(['user', 'project'])
            ->latest('absence_date')
            ->paginate(15);

        // Count pending notifications
        $pendingCount = AbsenceNotification::where('status', 'pending')->count();

        return Inertia::render('absence-notifications/index', [
            'absenceNotifications' => $absenceNotifications,
            'pendingCount' => $pendingCount,
        ]);
    }

    /**
     * Show details for a specific absence notification
     */
    public function show(AbsenceNotification $absenceNotification): Response
    {
        $absenceNotification->load(['user', 'project']);

        return Inertia::render('absence-notifications/show', [
            'absenceNotification' => $absenceNotification,
        ]);
    }

    /**
     * Mark absence notification as read
     */
    public function markAsRead(AbsenceNotification $absenceNotification): JsonResponse
    {
        $absenceNotification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Resolve absence notification with optional reason
     */
    public function resolve(AbsenceNotification $absenceNotification): JsonResponse
    {
        $validated = request()->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validated['reason'] ?? null) {
            $this->absenceDetectionService->addAbsenceReason($absenceNotification, $validated['reason']);
        }

        $this->absenceDetectionService->resolveAbsence($absenceNotification);

        return response()->json([
            'message' => 'Absence marked as resolved',
        ]);
    }

    /**
     * Get pending absences for dashboard widget
     */
    public function getPendingAbsences(): JsonResponse
    {
        $pendingAbsences = AbsenceNotification::where('status', 'pending')
            ->with(['user', 'project'])
            ->latest('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'count' => AbsenceNotification::where('status', 'pending')->count(),
            'absences' => $pendingAbsences,
        ]);
    }

    /**
     * Filter absence notifications
     */
    public function filter(): JsonResponse
    {
        $query = AbsenceNotification::with(['user', 'project']);

        // Filter by status
        if (request()->has('status')) {
            $query->where('status', request('status'));
        }

        // Filter by date range
        if (request()->has('from_date') && request('from_date')) {
            $query->where('absence_date', '>=', request('from_date'));
        }

        if (request()->has('to_date') && request('to_date')) {
            $query->where('absence_date', '<=', request('to_date'));
        }

        // Filter by project
        if (request()->has('project_id') && request('project_id')) {
            $query->where('project_id', request('project_id'));
        }

        // Filter by worker
        if (request()->has('user_id') && request('user_id')) {
            $query->where('user_id', request('user_id'));
        }

        $absences = $query->latest('absence_date')->paginate(20);

        return response()->json($absences);
    }
}
