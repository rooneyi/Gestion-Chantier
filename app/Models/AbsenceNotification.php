<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AbsenceNotification extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'absence_date',
        'status',
        'notified_at',
        'read_at',
        'reason',
    ];

    protected $casts = [
        'absence_date' => 'date',
        'notified_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function markAsResolved(): void
    {
        $this->update(['status' => 'resolved']);
    }
}
