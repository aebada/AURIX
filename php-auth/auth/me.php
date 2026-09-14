<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\SessionAuth;

$user = SessionAuth::user();

if ($user === null) {
    // 200 (not 401) so same-origin fetch from PhpAuthBridge stays quiet
    // in the browser console when the visitor is simply signed out.
    SessionAuth::json(['authenticated' => false]);
}

SessionAuth::json([
    'authenticated' => true,
    'user' => [
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'avatarUrl' => $user['avatar_url'] ?? null,
        'provider' => $user['auth_provider'] ?? 'email',
    ],
]);
