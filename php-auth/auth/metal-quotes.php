<?php

declare(strict_types=1);

/**
 * Indicative London-linked gold/silver spot for the static site.
 * GET /auth/metal-quotes.php?currency=USD|EUR
 * Price rail only — not custody, mint, or redeem.
 */

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\MetalQuotes;
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

$currency = isset($_GET['currency']) ? (string) $_GET['currency'] : 'USD';

try {
    SessionAuth::json(MetalQuotes::fetch($currency));
} catch (\Throwable $e) {
    SessionAuth::json(['error' => 'Quotes unavailable', 'liveCustody' => false], 503);
}
