<?php

declare(strict_types=1);

$origins = array_filter(array_map('trim', explode(',', (string) env('FORGE_CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000'))));

return [
    'paths' => ['*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $origins ?: ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
