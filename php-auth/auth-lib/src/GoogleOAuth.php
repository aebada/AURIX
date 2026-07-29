<?php

declare(strict_types=1);

namespace Aurix\Auth;

// Plain cURL against Google's OAuth2 endpoints — deliberately not using
// google/apiclient, which pulls in google/apiclient-services (bindings
// for every Google API, ~370MB / 36k files) just to use two HTTP calls.
final class GoogleOAuth
{
    private const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';
    private const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

    public function __construct(private readonly Config $config)
    {
    }

    private function assertConfigured(): void
    {
        if ($this->config->googleClientId === '' || $this->config->googleClientSecret === '') {
            throw new \RuntimeException('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
        }
    }

    public function authorizationUrl(string $state): string
    {
        $this->assertConfigured();

        $params = [
            'client_id' => $this->config->googleClientId,
            'redirect_uri' => $this->config->googleRedirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'access_type' => 'online',
            'prompt' => 'select_account',
            'state' => $state,
        ];

        return self::AUTH_URL . '?' . http_build_query($params);
    }

    /**
     * @return array{google_id: string, email: string, name: ?string, avatar_url: ?string}
     */
    public function fetchUserFromCode(string $code): array
    {
        $this->assertConfigured();

        $token = $this->request(self::TOKEN_URL, 'POST', [
            'code' => $code,
            'client_id' => $this->config->googleClientId,
            'client_secret' => $this->config->googleClientSecret,
            'redirect_uri' => $this->config->googleRedirectUri,
            'grant_type' => 'authorization_code',
        ]);

        if (isset($token['error'])) {
            throw new \RuntimeException('Google token error: ' . ($token['error_description'] ?? $token['error']));
        }

        $accessToken = $token['access_token'] ?? null;
        if (!is_string($accessToken)) {
            throw new \RuntimeException('Google did not return an access token.');
        }

        $userinfo = $this->request(self::USERINFO_URL, 'GET', null, ['Authorization: Bearer ' . $accessToken]);

        $email = $userinfo['email'] ?? null;
        $googleId = $userinfo['sub'] ?? null;

        if (!is_string($email) || !is_string($googleId)) {
            throw new \RuntimeException('Google did not return required profile fields.');
        }

        $name = $userinfo['name'] ?? null;
        $picture = $userinfo['picture'] ?? null;

        return [
            'google_id' => $googleId,
            'email' => strtolower($email),
            'name' => is_string($name) ? $name : null,
            'avatar_url' => is_string($picture) ? $picture : null,
        ];
    }

    /**
     * @param array<string, string>|null $fields
     * @param string[] $headers
     * @return array<string, mixed>
     */
    private function request(string $url, string $method, ?array $fields = null, array $headers = []): array
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 15,
        ]);

        if ($method === 'POST' && $fields !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields));
        }

        $response = curl_exec($ch);
        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new \RuntimeException('Google request failed: ' . $error);
        }
        curl_close($ch);

        $data = json_decode((string) $response, true);

        return is_array($data) ? $data : [];
    }
}
