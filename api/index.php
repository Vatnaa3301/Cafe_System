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

// Copy SQLite database to writable /tmp directory if not present
$tmpDb = '/tmp/database.sqlite';
$sourceDb = __DIR__ . '/../database/database.sqlite';
if (!file_exists($tmpDb) && file_exists($sourceDb)) {
    @copy($sourceDb, $tmpDb);
}

putenv("APP_SERVICES_CACHE={$bootstrapCachePath}/services.php");
putenv("APP_PACKAGES_CACHE={$bootstrapCachePath}/packages.php");
putenv("APP_ROUTES_CACHE={$bootstrapCachePath}/routes-v7.php");
putenv("APP_CONFIG_CACHE={$bootstrapCachePath}/config.php");
putenv("LOG_CHANNEL=stderr");
putenv("DB_CONNECTION=sqlite");
putenv("DB_DATABASE={$tmpDb}");

$_ENV['APP_SERVICES_CACHE'] = "{$bootstrapCachePath}/services.php";
$_ENV['APP_PACKAGES_CACHE'] = "{$bootstrapCachePath}/packages.php";
$_ENV['APP_ROUTES_CACHE']   = "{$bootstrapCachePath}/routes-v7.php";
$_ENV['APP_CONFIG_CACHE']   = "{$bootstrapCachePath}/config.php";
$_ENV['LOG_CHANNEL']         = "stderr";
$_ENV['DB_CONNECTION']      = 'sqlite';
$_ENV['DB_DATABASE']        = $tmpDb;

$_SERVER['APP_SERVICES_CACHE'] = "{$bootstrapCachePath}/services.php";
$_SERVER['APP_PACKAGES_CACHE'] = "{$bootstrapCachePath}/packages.php";
$_SERVER['APP_ROUTES_CACHE']   = "{$bootstrapCachePath}/routes-v7.php";
$_SERVER['APP_CONFIG_CACHE']   = "{$bootstrapCachePath}/config.php";
$_SERVER['LOG_CHANNEL']         = "stderr";
$_SERVER['DB_CONNECTION']      = 'sqlite';
$_SERVER['DB_DATABASE']        = $tmpDb;

// Override SCRIPT_NAME to prevent Laravel from stripping /api from request URIs on Vercel
$_SERVER['SCRIPT_NAME'] = '/index.php';

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



