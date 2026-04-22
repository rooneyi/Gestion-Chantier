<?php

namespace App\Models;

use Database\Factories\ResourceRequestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceRequest extends Model
{
    /** @use HasFactory<ResourceRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'material_id',
        'user_id',
        'project_id',
        'quantity_requested',
        'status',
        'comment',
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
