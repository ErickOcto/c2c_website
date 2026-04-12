<?php

use Illuminate\Support\Facades\Route;
use Modules\Transaction\Http\Controllers\PaymentNotificationController;

// Midtrans webhook — no auth, no CSRF
Route::post('/api/webhooks/midtrans', [PaymentNotificationController::class, 'handle'])
    ->name('webhooks.midtrans')
    ->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class]);
