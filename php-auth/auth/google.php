<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\Config;
use Aurix\Auth\Csrf;
use Aurix\Auth\GoogleOAuth;
use Aurix\Auth\SessionAuth;

$config = Config::fromEnvironment();
$callback = isset($_GET['callback']) ? (string) $_GET['callback'] : '';

if ($callback !== '') {
    $_SESSION['oauth_callback'] = $callback;
}

try {
    if ($config->shouldUseOauthBridge()) {
        // Optional legacy path: only when AIPASS_OAUTH_BRIDGE=true and
        // aipass.space /auth/google still proxies to Laravel. Prefer direct
        // Google OAuth so AURIX users never land on the AI-Pass marketing site.
        $bridgeCallback = $config->appUrl . '/auth/google/callback';
        $url = $config->aipassAuthUrl . '/auth/google'
            . '?bridge=1&callback=' . rawurlencode($bridgeCallback);
        SessionAuth::redirect($url);
    }

    $google = new GoogleOAuth($config);
    $state = Csrf::issueOAuthState();
    $url = $google->authorizationUrl($state);
    SessionAuth::redirect($url);
} catch (Throwable $e) {
    $message = rawurlencode($e->getMessage());
    SessionAuth::redirect('/auth/login.php?error=' . $message);
}
