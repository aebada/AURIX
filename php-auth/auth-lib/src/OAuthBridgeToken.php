<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * Verifies short-lived HMAC tokens issued by AI-Pass after Google consent
 * (same wire format as Invoice AI / AI-Pass OAuthBridgeToken).
 */
final class OAuthBridgeToken
{
    public function __construct(private readonly string $secret)
    {
    }

    /**
     * @return array{google_id: string, email: string, name: ?string, avatar_url: ?string}
     */
    public function verify(string $token): array
    {
        if ($this->secret === '') {
            throw new \RuntimeException('OAuth bridge secret is not configured.');
        }

        $parts = explode('.', $token, 2);
        if (count($parts) !== 2) {
            throw new \InvalidArgumentException('Invalid bridge token.');
        }

        [$body, $signature] = $parts;
        $expected = self::base64UrlEncode(hash_hmac('sha256', $body, $this->secret, true));

        if (!hash_equals($expected, $signature)) {
            throw new \InvalidArgumentException('Invalid bridge token signature.');
        }

        /** @var array<string, mixed> $payload */
        $payload = json_decode(self::base64UrlDecode($body), true, 512, JSON_THROW_ON_ERROR);

        if (($payload['exp'] ?? 0) < time()) {
            throw new \InvalidArgumentException('Bridge token expired.');
        }

        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $googleId = (string) ($payload['sub'] ?? '');

        if ($email === '' || $googleId === '') {
            throw new \InvalidArgumentException('Bridge token missing profile fields.');
        }

        return [
            'google_id' => $googleId,
            'email' => $email,
            'name' => isset($payload['name']) ? (string) $payload['name'] : null,
            'avatar_url' => isset($payload['avatar']) ? (string) $payload['avatar'] : null,
        ];
    }

    private static function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $value): string
    {
        $padding = strlen($value) % 4;
        if ($padding > 0) {
            $value .= str_repeat('=', 4 - $padding);
        }

        return base64_decode(strtr($value, '-_', '+/'), true) ?: '';
    }
}
