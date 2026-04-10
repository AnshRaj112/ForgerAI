<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'ok' => true,
        'service' => 'php-cms',
        'docs' => 'REST routes are registered without /api prefix; see /health and /v1/*',
    ]);
});
