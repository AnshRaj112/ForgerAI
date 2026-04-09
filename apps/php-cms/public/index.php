<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap/app.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if ($method === 'GET' && $path === '/health') {
    json_response(['ok' => true, 'service' => 'php-cms']);
    return;
}

if ($method === 'POST' && $path === '/content/publish') {
    $payload = json_decode(file_get_contents('php://input') ?: '{}', true) ?? [];
    $title = $payload['title'] ?? 'Untitled';
    json_response([
        'ok' => true,
        'contentId' => 'content-' . time(),
        'title' => $title
    ]);
    return;
}

json_response(['ok' => false, 'error' => 'Not found'], 404);
