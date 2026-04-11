<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $project = Project::first();
        $worker = User::where('role', UserRole::Worker)->first();

        $task1 = Task::create([
            'project_id' => $project->id,
            'name' => 'Fondations Secteur A',
            'description' => 'Coulage des dalles de fondation.',
            'start_date' => now(),
            'end_date' => now()->addDays(5),
            'status' => 'en_cours',
        ]);
        $task1->workers()->attach($worker->id);

        Task::create([
            'project_id' => $project->id,
            'name' => 'Maçonnerie RDC',
            'description' => 'Élévation des murs porteurs.',
            'start_date' => now()->addDays(6),
            'end_date' => now()->addDays(15),
            'status' => 'planifie',
        ]);
    }
}
