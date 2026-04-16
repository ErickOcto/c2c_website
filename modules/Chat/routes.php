<?php

use Illuminate\Support\Facades\Route;
use Modules\Chat\Http\Controllers\ConversationController;
use Modules\Chat\Http\Controllers\MessageController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/chat', [ConversationController::class, 'index'])->name('chat.index');
    Route::post('/chat', [ConversationController::class, 'store'])->name('chat.store');
    Route::get('/chat/products/search', [ConversationController::class, 'searchProducts'])->name('chat.products.search');
    Route::get('/chat/{conversation}', [ConversationController::class, 'show'])->name('chat.show');
    Route::post('/chat/{conversation}/messages', [MessageController::class, 'store'])->name('chat.messages.store');
});
