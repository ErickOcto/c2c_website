<?php

use Illuminate\Support\Facades\Route;
use Modules\Feedback\Http\Controllers\ReportController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/products/{product}/report', [ReportController::class, 'store'])->name('products.report');
});
