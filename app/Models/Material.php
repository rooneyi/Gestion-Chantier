<?php

namespace App\Models;

use Database\Factories\MaterialFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    /** @use HasFactory<MaterialFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'quantity_in_stock',
        'unit',
        'category',
    ];

    protected $casts = [
        'quantity_in_stock' => 'decimal:2',
    ];
}
