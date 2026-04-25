<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\DashboardController as BuyerDashboardController;
use App\Http\Controllers\Seller\DashboardController;
use App\Http\Controllers\Seller\OrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Middleware\EnsureIsAdmin;
use Illuminate\Support\Facades\Route;

// OTP Email Verification routes
Route::middleware(['auth', 'throttle:6,1'])->group(function () {
    Route::post('email/verify-otp', [OtpVerificationController::class, 'verify'])->name('verification.verify-otp');
    Route::post('email/resend-otp', [OtpVerificationController::class, 'resend'])->name('verification.resend-otp');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [BuyerDashboardController::class, 'index'])->name('dashboard');

    // Seller Dashboard Routes
    Route::prefix('seller')->name('seller.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::get('orders/export', [OrderController::class, 'exportCsv'])->name('orders.export');
        Route::get('products', [SellerProductController::class, 'index'])->name('products.index');
        Route::get('products/create', [SellerProductController::class, 'create'])->name('products.create');
        Route::post('products', [SellerProductController::class, 'store'])->name('products.store');
        Route::get('products/{product}/edit', [SellerProductController::class, 'edit'])->name('products.edit');
        Route::put('products/{product}', [SellerProductController::class, 'update'])->name('products.update');
        Route::delete('products/{product}', [SellerProductController::class, 'destroy'])->name('products.destroy');
        Route::patch('products/{product}/toggle', [SellerProductController::class, 'toggleStatus'])->name('products.toggle');
    });

    // Admin Dashboard Routes
    Route::prefix('admin')->name('admin.')->middleware(EnsureIsAdmin::class)->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
        Route::patch('users/{user}/ban', [AdminUserController::class, 'ban'])->name('users.ban');
        Route::patch('users/{user}/unban', [AdminUserController::class, 'unban'])->name('users.unban');
        Route::get('reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::patch('reports/{report}/status', [AdminReportController::class, 'updateStatus'])->name('reports.update-status');
        Route::post('reports/{report}/remove-product', [AdminReportController::class, 'removeProduct'])->name('reports.remove-product');
    });
});

require __DIR__.'/settings.php';
