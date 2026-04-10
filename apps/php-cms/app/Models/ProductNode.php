<?php

declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * E-commerce product catalog node.
 */
class ProductNode extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'commerce_product_nodes';

    protected $fillable = [
        'sku',
        'title',
        'description',
        'price_cents',
        'currency',
        'inventory',
        'attributes',
        'status',
    ];

    protected $casts = [
        'attributes' => 'array',
        'inventory' => 'integer',
        'price_cents' => 'integer',
    ];
}
