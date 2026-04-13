<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;

class FilterController extends Controller
{
    public function projects()
    {
        $projects = Project::select('id', 'name')->orderBy('name')->get();

        return response()->json(['projects' => $projects]);
    }

    public function workers()
    {
        $workers = User::where('role', '!=', 'manager')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json(['workers' => $workers]);
    }
}
