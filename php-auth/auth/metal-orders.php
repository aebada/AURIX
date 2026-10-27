<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\MetalCheckout;
use Aurix\Auth\MetalLedger;
use Aurix\Auth\SessionAuth;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    SessionAuth::json(['error' => 'Method not allowed'], 405);
}

$session = SessionAuth::user();
if ($session === null) {
    SessionAuth::json(['authenticated' => false, 'orders' => [], 'wallet' => null], 200);
}

$email = strtolower(trim((string) ($session['email'] ?? '')));
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    SessionAuth::json(['authenticated' => true, 'orders' => [], 'wallet' => null]);
}

SessionAuth::json([
    'authenticated' => true,
    'email' => $email,
    'wallet' => MetalLedger::walletForEmail($email),
    'orders' => MetalCheckout::forEmail($email),
    'liveVault' => false,
]);
