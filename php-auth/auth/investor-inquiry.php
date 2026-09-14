<?php

declare(strict_types=1);

/**
 * Public investor / partner / business / contact inquiry intake.
 * POST JSON → appends to auth-lib/data/inquiries.json (created if missing),
 * then best-effort SMTP notify + auto-reply + MTE CRM upsert.
 * Never prints secrets. No auth required for create.
 */

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\CrmLeadClient;
use Aurix\Auth\InquiryNotifier;
use Aurix\Auth\SessionAuth;
use Aurix\Auth\SmtpMailer;

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

$name = isset($data['name']) ? trim((string) $data['name']) : '';
$email = isset($data['email']) ? trim((string) $data['email']) : '';
$message = isset($data['message']) ? trim((string) $data['message']) : '';
$kind = isset($data['kind']) ? trim((string) $data['kind']) : 'investor';

$allowedKinds = ['investor', 'partner', 'business', 'contact'];
if (!in_array($kind, $allowedKinds, true)) {
    $kind = 'contact';
}

if ($name === '' || mb_strlen($name) > 200) {
    SessionAuth::json(['error' => 'name is required (max 200)'], 400);
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 320) {
    SessionAuth::json(['error' => 'valid email is required'], 400);
}
if ($message === '' || mb_strlen($message) > 8000) {
    SessionAuth::json(['error' => 'message must be 1–8000 characters'], 400);
}

$id = isset($data['id']) && is_string($data['id']) && $data['id'] !== ''
    ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['id'])
    : ('inq_' . bin2hex(random_bytes(8)));

$record = [
    'id' => $id,
    'kind' => $kind,
    'name' => mb_substr($name, 0, 200),
    'email' => mb_substr($email, 0, 320),
    'organization' => isset($data['organization']) ? mb_substr(trim((string) $data['organization']), 0, 300) : null,
    'role' => isset($data['role']) ? mb_substr(trim((string) $data['role']), 0, 120) : null,
    'vertical' => isset($data['vertical']) ? mb_substr(trim((string) $data['vertical']), 0, 64) : null,
    'ticketSize' => isset($data['ticketSize']) ? mb_substr(trim((string) $data['ticketSize']), 0, 120) : null,
    'message' => mb_substr($message, 0, 8000),
    'locale' => isset($data['locale']) ? mb_substr(trim((string) $data['locale']), 0, 16) : null,
    'status' => 'new',
    'createdAt' => gmdate('c'),
];

$dir = dirname(__DIR__) . '/auth-lib/data';
if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
    SessionAuth::json(['error' => 'Could not create data directory'], 500);
}

$file = $dir . '/inquiries.json';
$items = [];
if (is_file($file)) {
    $existing = json_decode((string) file_get_contents($file), true);
    if (is_array($existing)) {
        $items = $existing;
    }
}

array_unshift($items, $record);
$items = array_slice($items, 0, 500);

$json = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if ($json === false || file_put_contents($file, $json . "\n", LOCK_EX) === false) {
    SessionAuth::json(['error' => 'Could not persist inquiry'], 500);
}

/** @var \Aurix\Auth\Config $config */
$mailer = new SmtpMailer($config);
$crm = new CrmLeadClient($config);
$sideEffects = (new InquiryNotifier($config, $mailer, $crm))->notify($record);

SessionAuth::json([
    'ok' => true,
    'id' => $id,
    'notified' => $sideEffects,
], 201);
