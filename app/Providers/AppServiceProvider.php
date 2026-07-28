<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $storagePath = '/tmp/storage';
        $directories = [
            'app/public',
            'framework/cache/data',
            'framework/sessions',
            'framework/views',
            'logs',
        ];

        foreach ($directories as $dir) {
            if (!is_dir($storagePath . '/' . $dir)) {
                @mkdir($storagePath . '/' . $dir, 0755, true);
            }
        }

        $this->app->useStoragePath($storagePath);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
