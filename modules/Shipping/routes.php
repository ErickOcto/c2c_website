<?php

use Illuminate\Support\Facades\Route;
use Modules\Shipping\Http\Controllers\ShippingController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/shipping/provinces', [ShippingController::class, 'provinces'])->name('shipping.provinces');
    Route::get('/api/shipping/cities', [ShippingController::class, 'cities'])->name('shipping.cities');
});
