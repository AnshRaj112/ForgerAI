<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

if (PHP_SAPI === 'cli-server' && is_file(__DIR__.parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH))) {
    return false;
}

require __DIR__.'/../vendor/autoload.php';

(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());
