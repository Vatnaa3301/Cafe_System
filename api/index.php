<?php

// Prepare /tmp storage and cache environment variables for Vercel
$storagePath = '/tmp/storage';
$bootstrapCachePath = '/tmp/bootstrap/cache';

$dirs = [
    $storagePath . '/app/public',
    $storagePath . '/framework/cache/data',
    $storagePath . '/framework/sessions',
    $storagePath . '/framework/views',
    $storagePath . '/logs',
    $bootstrapCachePath,
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

putenv("APP_SERVICES_CACHE={$bootstrapCachePath}/services.php");
putenv("APP_PACKAGES_CACHE={$bootstrapCachePath}/packages.php");
putenv("APP_ROUTES_CACHE={$bootstrapCachePath}/routes-v7.php");
putenv("APP_CONFIG_CACHE={$bootstrapCachePath}/config.php");
putenv("LOG_CHANNEL=stderr");

$_ENV['APP_SERVICES_CACHE'] = "{$bootstrapCachePath}/services.php";
$_ENV['APP_PACKAGES_CACHE'] = "{$bootstrapCachePath}/packages.php";
$_ENV['APP_ROUTES_CACHE']   = "{$bootstrapCachePath}/routes-v7.php";
$_ENV['APP_CONFIG_CACHE']   = "{$bootstrapCachePath}/config.php";
$_ENV['LOG_CHANNEL']         = "stderr";

$_SERVER['APP_SERVICES_CACHE'] = "{$bootstrapCachePath}/services.php";
$_SERVER['APP_PACKAGES_CACHE'] = "{$bootstrapCachePath}/packages.php";
$_SERVER['APP_ROUTES_CACHE']   = "{$bootstrapCachePath}/routes-v7.php";
$_SERVER['APP_CONFIG_CACHE']   = "{$bootstrapCachePath}/config.php";
$_SERVER['LOG_CHANNEL']         = "stderr";

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Vercel Execution Exception:\n";
    echo $e->getMessage() . "\n\n";
    echo "In " . $e->getFile() . " on line " . $e->getLine() . "\n\n";
    echo $e->getTraceAsString();
}



