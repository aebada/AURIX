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
    $google = new GoogleOAuth($config);
    $state = Csrf::issueOAuthState();
    $url = $google->authorizationUrl($state);
    SessionAuth::redirect($url);
} catch (Throwable $e) {
    $message = rawurlencode($e->getMessage());
    SessionAuth::redirect('/auth/login.php?error=' . $message);
}
