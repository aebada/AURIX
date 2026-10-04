<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\Config;
use Aurix\Auth\MetalCheckout;
use Aurix\Auth\SessionAuth;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    SessionAuth::json(['error' => 'Method not allowed'], 405);
}

$raw = file_get_contents('php://input');
$data = is_string($raw) ? json_decode($raw, true) : null;
if (!is_array($data)) {
    SessionAuth::json(['error' => 'Invalid JSON body'], 400);
}

try {
    $result = MetalCheckout::create($data, Config::fromEnvironment()->appUrl);
    SessionAuth::json($result, 201);
} catch (\InvalidArgumentException $e) {
    SessionAuth::json(['error' => $e->getMessage(), 'liveCustody' => false], 400);
} catch (\RuntimeException $e) {
    SessionAuth::json(['error' => $e->getMessage(), 'liveCustody' => false], 503);
} catch (\Throwable $e) {
    SessionAuth::json(['error' => 'Checkout unavailable', 'liveCustody' => false], 503);
}
