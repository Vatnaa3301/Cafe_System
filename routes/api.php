<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CashierController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Products & categories — readable by all authenticated users
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // Cashier selection list (all authenticated users)
    Route::get('/cashiers', [CashierController::class, 'index']);

    // Cashier can place orders
    Route::post('/orders', [OrderController::class, 'store']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/chart', [DashboardController::class, 'chart']);

        // Category management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        // Product management
        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/{product}', [ProductController::class, 'update']); // POST for file upload
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        // Cashier management
        Route::get('/cashiers/all', [CashierController::class, 'adminIndex']);
        Route::post('/cashiers', [CashierController::class, 'store']);
        Route::put('/cashiers/{cashier}', [CashierController::class, 'update']);
        Route::delete('/cashiers/{cashier}', [CashierController::class, 'destroy']);

        // Order management
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::patch('/orders/{order}/payment', [OrderController::class, 'updatePayment']);
        Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
    });
});
