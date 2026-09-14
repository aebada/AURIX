<?php

declare(strict_types=1);

namespace Aurix\Auth;

final class Config
{
    public function __construct(
        public readonly string $appUrl,
        public readonly string $appEnv,
        public readonly string $dbDriver,
        public readonly string $dbHost,
        public readonly int $dbPort,
        public readonly string $dbName,
        public readonly string $dbUser,
        public readonly string $dbPass,
        public readonly string $googleClientId,
        public readonly string $googleClientSecret,
        public readonly string $googleRedirectUri,
        public readonly string $sessionSecret,
        public readonly string $loginSuccessUrl,
        public readonly string $aipassAuthUrl,
        public readonly bool $useOauthBridge,
        public readonly string $oauthBridgeSecret,
        public readonly string $smtpHost,
        public readonly int $smtpPort,
        public readonly string $smtpEncryption,
        public readonly string $smtpUser,
        public readonly string $smtpPass,
        public readonly string $smtpFrom,
        public readonly string $smtpFromName,
        public readonly string $mailNotifyTo,
        public readonly bool $mailAutoReply,
        public readonly string $publicContactEmail,
        public readonly string $mteCrmBase,
        public readonly string $mteCrmKey,
        public readonly bool $mteCrmEnabled,
    ) {
    }

    public static function fromEnvironment(): self
    {
        $appUrl = rtrim(self::env('APP_URL', 'http://localhost'), '/');
        $redirectUri = self::env('GOOGLE_REDIRECT_URI', '');
        if ($redirectUri === '') {
            // HOPn / Invoice convention (not google-callback.php).
            $redirectUri = $appUrl . '/auth/google/callback';
        }

        $bridgeSecret = self::env('AIPASS_OAUTH_BRIDGE_SECRET', '');
        if ($bridgeSecret === '') {
            $bridgeSecret = self::env('GOOGLE_CLIENT_SECRET', '');
        }

        $useBridge = filter_var(self::env('AIPASS_OAUTH_BRIDGE', 'true'), FILTER_VALIDATE_BOOLEAN);
        // Local PHP server uses direct Google OAuth (register localhost redirect URI).
        if (self::env('APP_ENV', 'production') === 'local') {
            $useBridge = false;
        }

        $smtpFrom = self::env('SMTP_FROM', self::env('SMTP_USER', 'contact@aurixapp.de'));
        $mailNotifyTo = self::env('MAIL_NOTIFY_TO', $smtpFrom);
        $publicContact = self::env('PUBLIC_CONTACT_EMAIL', 'contact@aurixapp.de');

        $mteKey = self::env('MTE_CRM_KEY', '');
        if ($mteKey === '') {
            $mteKey = self::env('MIGRATE_DEPLOY_KEY', '');
        }

        return new self(
            appUrl: $appUrl,
            appEnv: self::env('APP_ENV', 'production'),
            // "mysql" in production (shared hosting); "sqlite" is only for
            // local testing without a MySQL server — see auth-lib/README.md.
            dbDriver: self::env('DB_DRIVER', 'mysql'),
            dbHost: self::env('DB_HOST', 'localhost'),
            dbPort: (int) self::env('DB_PORT', '3306'),
            dbName: self::env('DB_NAME', ''),
            dbUser: self::env('DB_USER', ''),
            dbPass: self::env('DB_PASS', ''),
            googleClientId: self::env('GOOGLE_CLIENT_ID', ''),
            googleClientSecret: self::env('GOOGLE_CLIENT_SECRET', ''),
            googleRedirectUri: $redirectUri,
            sessionSecret: self::env('SESSION_SECRET', ''),
            loginSuccessUrl: self::env('LOGIN_SUCCESS_URL', '/'),
            aipassAuthUrl: rtrim(self::env('AIPASS_AUTH_URL', 'https://aipass.space'), '/'),
            useOauthBridge: $useBridge,
            oauthBridgeSecret: $bridgeSecret,
            smtpHost: self::env('SMTP_HOST', 'smtp.hostinger.com'),
            smtpPort: (int) self::env('SMTP_PORT', '465'),
            smtpEncryption: self::env('SMTP_ENCRYPTION', 'ssl'),
            smtpUser: self::env('SMTP_USER', ''),
            smtpPass: self::env('SMTP_PASS', ''),
            smtpFrom: $smtpFrom,
            smtpFromName: self::env('SMTP_FROM_NAME', 'AURIX'),
            mailNotifyTo: $mailNotifyTo,
            mailAutoReply: filter_var(self::env('MAIL_AUTO_REPLY', 'true'), FILTER_VALIDATE_BOOLEAN),
            publicContactEmail: $publicContact,
            mteCrmBase: rtrim(self::env('MTE_CRM_BASE', 'https://munichtechexpo.com/back/admin'), '/'),
            mteCrmKey: $mteKey,
            mteCrmEnabled: filter_var(self::env('MTE_CRM_ENABLED', 'true'), FILTER_VALIDATE_BOOLEAN),
        );
    }

    public function isProduction(): bool
    {
        return $this->appEnv === 'production';
    }

    /**
     * Production default: route Google consent through AI-Pass so the shared
     * AlPass OAuth client’s already-registered redirect URI is used
     * (https://aipass.space/auth/google/callback), same pattern as Invoice AI.
     */
    public function shouldUseOauthBridge(): bool
    {
        if (!$this->useOauthBridge || $this->aipassAuthUrl === '') {
            return false;
        }

        return $this->oauthBridgeSecret !== '';
    }

    private static function env(string $key, string $default = ''): string
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
        if ($value === false || $value === null || $value === '') {
            return $default;
        }

        return (string) $value;
    }
}
