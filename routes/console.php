<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule absence detection every day at 9 AM
Schedule::command('app:detect-absences')
    ->dailyAt('09:00')
    ->withoutOverlapping()
    ->onFailure(function () {
        Log::error('Failed to execute absence detection');
    });
