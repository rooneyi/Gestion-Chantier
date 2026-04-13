<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::with('engineer', 'manager', 'tasks.workers')->latest()->get();

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'deadline' => 'required|date|after:today',
            'steps' => 'required|array|min:1',
            'steps.*.name' => 'required|string|max:255',
            'steps.*.budget' => 'required|numeric|min:0',
            'budget' => 'nullable|numeric|min:0',
            'engineer_id' => 'nullable|exists:users,id',
        ]);

        $steps = $validated['steps'];

        // Calculate total budget from steps
        $totalBudget = collect($steps)->sum('budget');

        // Allow manager to override the auto-calculated budget
        $finalBudget = $validated['budget'] ?? $totalBudget;

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'] ?? null,
            'budget' => $finalBudget,
            'deadline' => $validated['deadline'],
            'engineer_id' => $validated['engineer_id'] ?? null,
            'manager_id' => auth()->id(),
            'status' => 'initialisation',
        ]);

        // Create project steps
        foreach ($steps as $index => $step) {
            $project->steps()->create([
                'name' => $step['name'],
                'budget' => $step['budget'],
                'order' => $index + 1,
            ]);
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'create_project',
            'description' => "Création du projet : {$project->name} avec ".count($steps).' étape(s)',
            'properties' => [
                'project_id' => $project->id,
                'steps_count' => count($steps),
                'total_budget' => $finalBudget,
            ],
        ]);

        return response()->json([
            'project' => $project->load('steps'),
            'message' => 'Projet créé avec succès',
        ], 201);
    }

    public function show(Project $project): Response
    {
        $project->load(['engineer', 'manager', 'steps', 'tasks.workers']);

        // Calculate total unique workers for the project
        $totalWorkers = $project->tasks
            ->flatMap(fn ($task) => $task->workers)
            ->unique('id')
            ->count();

        return Inertia::render('projects/show', [
            'project' => $project,
            'totalWorkers' => $totalWorkers,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'status' => 'required|in:initialisation,planifie,en_cours,termine',
        ]);

        $oldStatus = $project->status;
        $project->update($validated);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'update_project',
            'description' => "Mise à jour du projet : {$project->name} (Statut: {$oldStatus} → {$validated['status']})",
            'properties' => [
                'project_id' => $project->id,
                'old_status' => $oldStatus,
                'new_status' => $validated['status'],
            ],
        ]);

        return response()->json([
            'project' => $project,
            'message' => 'Projet mis à jour avec succès',
        ]);
    }

    public function destroy(Project $project)
    {
        $projectName = $project->name;

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_project',
            'description' => "Suppression du projet : {$projectName}",
            'properties' => [
                'project_id' => $project->id,
            ],
        ]);

        $project->delete();

        return response()->json([
            'message' => 'Projet supprimé avec succès',
        ]);
    }
}
