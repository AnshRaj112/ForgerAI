<?php

declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * CMS content node (pages, articles, builder-linked content).
 */
class ContentNode extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'cms_content_nodes';

    protected $fillable = [
        'title',
        'slug',
        'body',
        'meta',
        'status',
        'locale',
        'node_type',
        'published_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'published_at' => 'datetime',
    ];
}
