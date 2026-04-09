<?php

use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\Seller\DashboardController;
use App\Http\Controllers\Seller\OrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use Illuminate\Support\Facades\Route;

// OTP Email Verification routes
Route::middleware(['auth', 'throttle:6,1'])->group(function () {
    Route::post('email/verify-otp', [OtpVerificationController::class, 'verify'])->name('verification.verify-otp');
    Route::post('email/resend-otp', [OtpVerificationController::class, 'resend'])->name('verification.resend-otp');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Seller Dashboard Routes
    Route::prefix('seller')->name('seller.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::get('products', [SellerProductController::class, 'index'])->name('products.index');
        Route::get('products/create', [SellerProductController::class, 'create'])->name('products.create');
        Route::post('products', [SellerProductController::class, 'store'])->name('products.store');
        Route::get('products/{product}/edit', [SellerProductController::class, 'edit'])->name('products.edit');
        Route::put('products/{product}', [SellerProductController::class, 'update'])->name('products.update');
        Route::delete('products/{product}', [SellerProductController::class, 'destroy'])->name('products.destroy');
        Route::patch('products/{product}/toggle', [SellerProductController::class, 'toggleStatus'])->name('products.toggle');
    });
});

require __DIR__.'/settings.php';
