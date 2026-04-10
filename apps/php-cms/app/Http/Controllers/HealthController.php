<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Redis;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        $redisOk = false;
        try {
            $pong = Redis::connection()->ping();
            $redisOk = $pong === true || $pong === 'PONG' || $pong === '+PONG';
        } catch (\Throwable) {
            $redisOk = false;
        }

        $mongoOk = false;
        try {
            \App\Models\ContentNode::query()->limit(1)->get();
            $mongoOk = true;
        } catch (\Throwable) {
            $mongoOk = false;
        }

        $ok = $redisOk && $mongoOk;

        return response()->json([
            'ok' => $ok,
            'service' => 'php-cms',
            'version' => '0.1.0',
            'checks' => [
                'mongo' => $mongoOk ? 'ok' : 'fail',
                'redis' => $redisOk ? 'ok' : 'fail',
            ],
        ], $ok ? 200 : 503);
    }
}
