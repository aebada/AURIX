<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\Config;
use Aurix\Auth\MetalCheckout;

$orderId = isset($_GET['order']) ? trim((string) $_GET['order']) : '';
$token = isset($_GET['token']) ? trim((string) $_GET['token']) : '';
$app = rtrim(Config::fromEnvironment()->appUrl, '/');

if ($orderId === '' || $token === '') {
    header('Location: ' . $app . '/app/trade/?checkout=cancel', true, 302);
    exit;
}

try {
    MetalCheckout::confirmPaypal($orderId, $token);
    header(
        'Location: ' . $app . '/app/checkout/return/?provider=paypal&order=' . rawurlencode($orderId) . '&ok=1',
        true,
        302,
    );
} catch (\Throwable $e) {
    header(
        'Location: ' . $app . '/app/checkout/return/?provider=paypal&order=' . rawurlencode($orderId) . '&ok=0',
        true,
        302,
    );
}
exit;
