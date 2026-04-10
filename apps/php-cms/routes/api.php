<?php

declare(strict_types=1);

use App\Http\Controllers\CommerceController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'index']);

Route::prefix('v1/cms')->group(function () {
    Route::get('/content', [ContentController::class, 'index']);
    Route::post('/content', [ContentController::class, 'store']);
    Route::get('/content/{id}', [ContentController::class, 'show']);
});

Route::prefix('v1/commerce')->group(function () {
    Route::get('/products', [CommerceController::class, 'productsIndex']);
    Route::post('/products', [CommerceController::class, 'productsStore']);
    Route::get('/products/{id}', [CommerceController::class, 'productsShow']);
    Route::get('/orders', [CommerceController::class, 'ordersIndex']);
    Route::post('/orders', [CommerceController::class, 'ordersStore']);
});

/** @deprecated Use POST /v1/cms/content — kept for existing web client. */
Route::post('/content/publish', [ContentController::class, 'publish']);
