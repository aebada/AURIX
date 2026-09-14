<?php

declare(strict_types=1);

/**
 * Public marketing chat endpoint for the static site widget.
 * POST JSON: { "message": string, "history"?: [{role, content}] }
 * → { "reply": string, "provider": string, "suggestions"?: string[] }
 *
 * AI provider keys (optional) live in auth-lib/.env — never in the
 * Next.js static export. Without keys, returns demo FAQ replies.
 */

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\ChatAssistant;
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

$message = isset($data['message']) ? trim((string) $data['message']) : '';
if ($message === '' || mb_strlen($message) > 4000) {
    SessionAuth::json(['error' => 'message must be 1–4000 characters'], 400);
}

$history = [];
if (isset($data['history']) && is_array($data['history'])) {
    $slice = array_slice($data['history'], -20);
    foreach ($slice as $item) {
        if (!is_array($item)) {
            continue;
        }
        $role = $item['role'] ?? '';
        $content = isset($item['content']) ? trim((string) $item['content']) : '';
        if (($role !== 'user' && $role !== 'assistant') || $content === '') {
            continue;
        }
        $history[] = [
            'role' => $role,
            'content' => mb_substr($content, 0, 4000),
        ];
    }
}

try {
    $result = ChatAssistant::complete($message, $history);
    $payload = [
        'reply' => $result['reply'],
        'provider' => $result['provider'],
    ];
    if (!empty($result['suggestions']) && is_array($result['suggestions'])) {
        $payload['suggestions'] = array_values(array_slice($result['suggestions'], 0, 5));
    }
    SessionAuth::json($payload);
} catch (\Throwable $e) {
    SessionAuth::json(['error' => 'Assistant unavailable'], 503);
}
