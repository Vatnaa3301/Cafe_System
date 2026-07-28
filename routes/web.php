<?php

use Illuminate\Support\Facades\Route;

// Catch-all route — serve the React SPA for non-API web requests
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
