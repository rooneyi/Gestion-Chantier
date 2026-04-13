<?php

namespace App\Console\Commands;

use App\Services\AbsenceDetectionService;
use Carbon\Carbon;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:detect-absences {--date= : The date to check for absences (YYYY-MM-DD)}')]
#[Description('Detect worker absences and send notifications')]
class DetectAbsences extends Command
{
    public function handle(AbsenceDetectionService $absenceDetectionService): int
    {
        $date = $this->option('date');
        $checkDate = $date ? Carbon::parse($date) : now();

        $this->info("Checking for absences on {$checkDate->format('Y-m-d')}...");

        try {
            $count = $absenceDetectionService->detectAbsences($checkDate);

            if ($count > 0) {
                $this->info("✓ Detected and notified {$count} absence(s).");
            } else {
                $this->line('No absences detected.');
            }

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Error detecting absences: {$e->getMessage()}");

            return self::FAILURE;
        }
    }
}
