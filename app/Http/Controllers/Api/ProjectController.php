<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'budget' => 'required|numeric|min:0',
            'deadline' => 'required|date|after:today',
            'engineer_id' => 'nullable|exists:users,id',
        ]);

        $project = Project::create([
            ...$validated,
            'manager_id' => auth()->id(),
            'status' => 'initialisation',
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'create_project',
            'description' => "Création du projet : {$project->name}",
            'properties' => $project->toArray(),
        ]);

        return back()->with('success', 'Projet créé avec succès');
    }
}
