<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\AuthService;
use Aurix\Auth\Config;
use Aurix\Auth\Csrf;
use Aurix\Auth\GoogleOAuth;
use Aurix\Auth\OAuthBridgeToken;
use Aurix\Auth\SessionAuth;

$config = Config::fromEnvironment();
$state = $_GET['state'] ?? null;
$code = $_GET['code'] ?? null;
$error = $_GET['error'] ?? null;
$bridgeToken = $_GET['bridge_token'] ?? null;

if ($error !== null) {
    $message = (string) $error === 'access_denied'
        ? 'Google sign-in was cancelled.'
        : (string) $error;
    SessionAuth::redirect('/auth/login.php?error=' . rawurlencode($message));
}

$callback = isset($_SESSION['oauth_callback']) ? (string) $_SESSION['oauth_callback'] : '';
unset($_SESSION['oauth_callback']);

try {
    $auth = AuthService::make($config);

    if (is_string($bridgeToken) && $bridgeToken !== '') {
        $bridge = new OAuthBridgeToken($config->oauthBridgeSecret);
        $profile = $bridge->verify($bridgeToken);
        $user = $auth->loginWithGoogleProfile($profile);
        SessionAuth::login($user);
        SessionAuth::redirect($auth->successRedirect($callback));
    }

    if (!Csrf::validateOAuthState(is_string($state) ? $state : null)) {
        SessionAuth::redirect('/auth/login.php?error=' . rawurlencode('Invalid OAuth state. Please try again.'));
    }

    if (!is_string($code) || $code === '') {
        SessionAuth::redirect('/auth/login.php?error=' . rawurlencode('Missing authorization code from Google.'));
    }

    $google = new GoogleOAuth($config);
    $profile = $google->fetchUserFromCode($code);
    $user = $auth->loginWithGoogleProfile($profile);
    SessionAuth::login($user);
    SessionAuth::redirect($auth->successRedirect($callback));
} catch (Throwable $e) {
    SessionAuth::redirect('/auth/login.php?error=' . rawurlencode($e->getMessage()));
}
