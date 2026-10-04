<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

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

$orderId = isset($data['orderId']) ? trim((string) $data['orderId']) : '';
$sessionId = isset($data['sessionId']) ? trim((string) $data['sessionId']) : '';
if ($orderId === '' || $sessionId === '') {
    SessionAuth::json(['error' => 'orderId and sessionId required'], 400);
}

try {
    SessionAuth::json(MetalCheckout::confirmStripe($orderId, $sessionId));
} catch (\Throwable $e) {
    SessionAuth::json(['error' => 'Confirm failed', 'liveCustody' => false], 400);
}
