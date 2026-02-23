<?php

use Illuminate\Support\Facades\Route;

// Catch-all route — serve the React SPA for every web request
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
