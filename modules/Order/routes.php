<?php

use Illuminate\Support\Facades\Route;
use Modules\Order\Http\Controllers\CheckoutController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/shipping', [CheckoutController::class, 'calculateShipping'])->name('checkout.calculate-shipping');
    Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');
    Route::post('/checkout/confirm-payment', [CheckoutController::class, 'confirmPayment'])->name('checkout.confirm-payment');
});
