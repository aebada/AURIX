<?php

declare(strict_types=1);

$authLibDir = __DIR__;

$autoload = $authLibDir . '/vendor/autoload.php';
if (!is_readable($autoload)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Auth library is incomplete: vendor/autoload.php is missing. Run composer install in php-auth/ and redeploy auth-lib/.";
    exit(1);
}

require_once $autoload;

use Aurix\Auth\Config;
use Aurix\Auth\SessionAuth;
use Dotenv\Dotenv;

$envFile = $authLibDir . '/.env';
if (!is_readable($envFile)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Auth is not configured: create auth-lib/.env from auth-lib/.env.example (never commit real secrets).";
    exit(1);
}

Dotenv::createImmutable($authLibDir)->safeLoad();

$config = Config::fromEnvironment();
SessionAuth::start($config);
