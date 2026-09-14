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
        // Same concept as Invoice AI / HOPn apps: Google consent happens on
        // aipass.space (redirect_uri already registered). AI-Pass returns
        // bridge_token to our HOPn-style callback path.
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
