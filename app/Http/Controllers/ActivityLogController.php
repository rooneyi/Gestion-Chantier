<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ActivityLog::with('user')->latest();

        if ($request->has('action') && $request->input('action') !== 'all') {
            $query->where('action', $request->input('action'));
        }

        $logs = $query->paginate(50)->withQueryString();

        return Inertia::render('activity-logs/index', [
            'logs' => $logs->items(),
            'currentFilter' => $request->input('action', 'all'),
        ]);
    }
}
