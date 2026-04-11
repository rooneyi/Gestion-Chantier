<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $manager = User::where('role', UserRole::Manager)->first();
        $engineer = User::where('role', UserRole::Engineer)->first();

        Project::create([
            'name' => 'Résidence Horizon',
            'description' => 'Construction d\'un complexe résidentiel de 20 appartements.',
            'budget' => 250000.00,
            'deadline' => now()->addMonths(6),
            'status' => 'en_cours',
            'manager_id' => $manager->id,
            'engineer_id' => $engineer->id,
        ]);

        Project::create([
            'name' => 'Centre Commercial Rivoli',
            'description' => 'Réhabilitation complète du centre commercial.',
            'budget' => 450000.00,
            'deadline' => now()->addMonths(12),
            'status' => 'initialisation',
            'manager_id' => $manager->id,
            'engineer_id' => $engineer->id,
        ]);
    }
}
