<?php

namespace App\Http\Controllers;

class HealthController extends Controller
{
    public function __invoke(): array
    {
        return ['ok' => true, 'service' => 'php-cms'];
    }
}
