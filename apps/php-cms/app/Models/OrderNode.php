<?php

declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * Lightweight order record for commerce workflows (cart checkout stub).
 */
class OrderNode extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'commerce_order_nodes';

    protected $fillable = [
        'reference',
        'status',
        'currency',
        'total_cents',
        'line_items',
        'customer_email',
    ];

    protected $casts = [
        'line_items' => 'array',
        'total_cents' => 'integer',
    ];
}
