<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';
require_once __DIR__ . '/_layout.php';

use Aurix\Auth\AuthService;
use Aurix\Auth\Config;
use Aurix\Auth\Csrf;
use Aurix\Auth\SessionAuth;

$config = Config::fromEnvironment();
$callback = isset($_GET['callback']) ? (string) $_GET['callback'] : '';

if (SessionAuth::check()) {
    SessionAuth::redirect(AuthService::make($config)->successRedirect($callback));
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? null;
    if (!Csrf::validate($token)) {
        $error = 'Invalid form submission. Please try again.';
    } else {
        try {
            $auth = AuthService::make($config);
            $user = $auth->registerWithEmail(
                (string) ($_POST['email'] ?? ''),
                (string) ($_POST['password'] ?? ''),
                trim((string) ($_POST['name'] ?? '')) ?: null,
            );
            SessionAuth::login($user);
            SessionAuth::redirect($auth->successRedirect($callback));
        } catch (Throwable $e) {
            $error = $e->getMessage();
        }
    }
}

$csrf = Csrf::token();

ob_start();
?>
<?= auth_google_button($callback) ?>

<div class="divider">or register with email</div>

<form class="form" method="post" action="/auth/register.php<?= $callback !== '' ? '?callback=' . rawurlencode($callback) : '' ?>">
  <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>" />
  <label class="label">
    Full name
    <input class="input" type="text" name="name" autocomplete="name" value="<?= htmlspecialchars((string) ($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" />
  </label>
  <label class="label">
    Email
    <input class="input" type="email" name="email" required autocomplete="email" value="<?= htmlspecialchars((string) ($_POST['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" />
  </label>
  <label class="label">
    Password
    <input class="input" type="password" name="password" required autocomplete="new-password" minlength="8" />
  </label>
  <button class="submit-btn" type="submit">Create account</button>
</form>

<p class="hint">Already have an account? <a href="/auth/login.php">Sign in</a></p>
<?php
$body = ob_get_clean() ?: '';

auth_render_page([
    'title' => 'Register — AURIX',
    'badge' => 'Create account',
    'heading' => 'Create your AURIX account',
    'subtitle' => 'Sign up with Google or email.',
    'error' => $error,
    'body' => $body,
]);
