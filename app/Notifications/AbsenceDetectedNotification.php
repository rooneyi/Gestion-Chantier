<?php

namespace App\Notifications;

use App\Models\AbsenceNotification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AbsenceDetectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected User $absent_user,
        protected AbsenceNotification $notification,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $date = $this->notification->absence_date->format('d/m/Y');
        $projectName = $this->notification->project?->name ?? 'Non assigné';

        return (new MailMessage)
            ->subject("Absence détectée: {$this->absent_user->name}")
            ->greeting("Absence détectée!")
            ->line("L'ouvrier **{$this->absent_user->name}** n'a pas de pointage pour le **{$date}**.")
            ->line("Projet: **{$projectName}**")
            ->line("Veuillez vérifier son statut ou noter la raison de son absence.")
            ->action('Voir les absences', url('/attendance'))
            ->line('Merci d\'utiliser notre application!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'player_id' => $this->absent_user->id,
            'player_name' => $this->absent_user->name,
            'project_name' => $this->notification->project?->name ?? 'Non assigné',
            'absence_date' => $this->notification->absence_date->format('d/m/Y'),
            'notification_id' => $this->notification->id,
        ];
    }
}
