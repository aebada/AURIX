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
$email = is_array($session) ? strtolower(trim((string) ($session['email'] ?? ''))) : '';
$orderId = isset($_GET['order']) ? trim((string) $_GET['order']) : '';

if ($email === '' && $orderId !== '') {
    $order = MetalCheckout::find($orderId);
    if (is_array($order) && !empty($order['minted'])) {
        $email = strtolower(trim((string) ($order['email'] ?? '')));
    }
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    SessionAuth::json([
        'authenticated' => false,
        'wallet' => null,
        'liveVault' => false,
    ]);
}

SessionAuth::json([
    'authenticated' => $session !== null,
    'wallet' => MetalLedger::walletForEmail($email),
    'liveVault' => false,
]);
