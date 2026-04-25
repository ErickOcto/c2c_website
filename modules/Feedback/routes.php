<?php

use Illuminate\Support\Facades\Route;
use Modules\Feedback\Http\Controllers\ReportController;
use Modules\Feedback\Http\Controllers\ReviewController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/products/{product}/report', [ReportController::class, 'store'])->name('products.report');
    Route::post('/products/{product}/review', [ReviewController::class, 'store'])->name('products.review');
});
