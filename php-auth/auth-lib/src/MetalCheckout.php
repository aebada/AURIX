<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * Stripe + PayPal checkout for gold/silver reservations.
 * Collects real fiat. Does not mint, allocate vault metal, or claim custody.
 */
final class MetalCheckout
{
    private const FILE = 'metal-checkouts.json';

    private const MIN_EUR = 10.0;

    private const MAX_EUR = 10000.0;

    private const FEE_RATE = 0.005;

    /**
     * @return array{stripe:bool,paypal:bool,paypalClientId:string,mode:string}
     */
    public static function publicConfig(): array
    {
        $paypalId = self::env('PAYPAL_CLIENT_ID');

        return [
            'stripe' => self::env('STRIPE_SECRET_KEY') !== '',
            'paypal' => $paypalId !== '' && self::env('PAYPAL_CLIENT_SECRET') !== '',
            'paypalClientId' => $paypalId,
            'mode' => self::env('PAYPAL_MODE', 'sandbox'),
            'liveCustody' => false,
            'note' => 'Payment reserves grams at the quoted price. Vault allocation stays pending until custody is certified.',
        ];
    }

    /**
     * @param array<string, mixed> $body
     * @return array<string, mixed>
     */
    public static function create(array $body, string $appUrl): array
    {
        $cfg = self::publicConfig();
        $provider = isset($body['provider']) ? strtolower(trim((string) $body['provider'])) : '';
        if ($provider !== 'stripe' && $provider !== 'paypal') {
            throw new \InvalidArgumentException('provider must be stripe or paypal');
        }
        if ($provider === 'stripe' && !$cfg['stripe']) {
            throw new \RuntimeException('Stripe is not configured (STRIPE_SECRET_KEY)');
        }
        if ($provider === 'paypal' && !$cfg['paypal']) {
            throw new \RuntimeException('PayPal is not configured (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)');
        }

        $metal = isset($body['metal']) ? strtolower(trim((string) $body['metal'])) : 'gold';
        if ($metal !== 'gold' && $metal !== 'silver') {
            throw new \InvalidArgumentException('metal must be gold or silver');
        }

        $fiat = isset($body['fiatEur']) ? (float) $body['fiatEur'] : 0.0;
        if ($fiat < self::MIN_EUR || $fiat > self::MAX_EUR) {
            throw new \InvalidArgumentException('fiatEur must be between 10 and 10000');
        }

        $pricePerGram = isset($body['pricePerGram']) ? (float) $body['pricePerGram'] : 0.0;
        if ($pricePerGram <= 0) {
            throw new \InvalidArgumentException('pricePerGram is required');
        }

        $email = isset($body['email']) ? trim((string) $body['email']) : '';
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('email is invalid');
        }

        $fee = round($fiat * self::FEE_RATE, 2);
        $net = max(0.01, $fiat - $fee);
        $grams = round($net / $pricePerGram, 6);
        $orderId = 'ord_' . bin2hex(random_bytes(8));
        $appUrl = rtrim($appUrl, '/');

        $order = [
            'id' => $orderId,
            'provider' => $provider,
            'status' => 'quoted',
            'metal' => $metal,
            'fiatEur' => round($fiat, 2),
            'feeEur' => $fee,
            'grams' => $grams,
            'pricePerGram' => $pricePerGram,
            'email' => $email,
            'liveMint' => false,
            'liveCustody' => false,
            'allocation' => 'pending_certification',
            'providerRef' => null,
            'createdAt' => gmdate('c'),
            'updatedAt' => gmdate('c'),
        ];

        if ($provider === 'stripe') {
            $success = $appUrl . '/app/checkout/return/?provider=stripe&order=' . rawurlencode($orderId) . '&session_id={CHECKOUT_SESSION_ID}';
            $cancel = $appUrl . '/app/trade/?checkout=cancel';
            $session = self::stripeCreateSession($order, $success, $cancel, $email);
            $order['providerRef'] = $session['id'] ?? null;
            $order['status'] = 'checkout_created';
            self::upsert($order);

            return [
                'orderId' => $orderId,
                'provider' => 'stripe',
                'checkoutUrl' => $session['url'] ?? '',
                'liveCustody' => false,
            ];
        }

        $returnUrl = $appUrl . '/auth/checkout-paypal-return.php?order=' . rawurlencode($orderId);
        $cancelUrl = $appUrl . '/app/trade/?checkout=cancel';
        $pp = self::paypalCreateOrder($order, $returnUrl, $cancelUrl);
        $order['providerRef'] = $pp['id'] ?? null;
        $order['status'] = 'checkout_created';
        $approve = '';
        if (isset($pp['links']) && is_array($pp['links'])) {
            foreach ($pp['links'] as $link) {
                if (is_array($link) && ($link['rel'] ?? '') === 'approve') {
                    $approve = (string) ($link['href'] ?? '');
                }
            }
        }
        self::upsert($order);

        return [
            'orderId' => $orderId,
            'provider' => 'paypal',
            'checkoutUrl' => $approve,
            'liveCustody' => false,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function confirmStripe(string $orderId, string $sessionId): array
    {
        $order = self::find($orderId);
        if ($order === null) {
            throw new \RuntimeException('order_not_found');
        }
        $session = self::stripeGet('checkout/sessions/' . rawurlencode($sessionId));
        $paid = ($session['payment_status'] ?? '') === 'paid' || ($session['status'] ?? '') === 'complete';
        if (!$paid) {
            $order['status'] = 'failed';
            $order['updatedAt'] = gmdate('c');
            self::upsert($order);

            return $order;
        }

        return self::markPaid($order, $sessionId);
    }

    /**
     * @return array<string, mixed>
     */
    public static function confirmPaypal(string $orderId, string $token): array
    {
        $order = self::find($orderId);
        if ($order === null) {
            throw new \RuntimeException('order_not_found');
        }
        $captured = self::paypalCapture($token);
        $status = strtoupper((string) ($captured['status'] ?? ''));
        if ($status !== 'COMPLETED' && $status !== 'APPROVED') {
            $order['status'] = 'failed';
            $order['updatedAt'] = gmdate('c');
            self::upsert($order);

            return $order;
        }

        return self::markPaid($order, $token);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function find(string $id): ?array
    {
        foreach (self::all() as $row) {
            if (($row['id'] ?? '') === $id) {
                return $row;
            }
        }

        return null;
    }

    /**
     * @param array<string, mixed> $order
     * @return array<string, mixed>
     */
    private static function markPaid(array $order, string $ref): array
    {
        $order['status'] = 'paid';
        $order['providerRef'] = $ref;
        $order['allocation'] = 'pending_certification';
        $order['liveMint'] = false;
        $order['liveCustody'] = false;
        $order['updatedAt'] = gmdate('c');
        self::upsert($order);

        try {
            $cfg = Config::fromEnvironment();
            $mailer = new SmtpMailer($cfg);
            $mailer->send(
                [$cfg->mailNotifyTo],
                'AURIX paid gold reservation ' . $order['id'],
                'Paid €' . $order['fiatEur'] . ' for ~' . $order['grams'] . ' g ' . $order['metal'] . ".\nAllocation pending certification. Not vault-delivered.\nOrder " . $order['id'],
            );
        } catch (\Throwable $e) {
            // notify is best-effort
        }

        return $order;
    }

    /**
     * @param array<string, mixed> $order
     * @return array<string, mixed>
     */
    private static function stripeCreateSession(array $order, string $success, string $cancel, string $email): array
    {
        $cents = (int) round(((float) $order['fiatEur']) * 100);
        $fields = [
            'mode' => 'payment',
            'success_url' => $success,
            'cancel_url' => $cancel,
            'line_items[0][quantity]' => '1',
            'line_items[0][price_data][currency]' => 'eur',
            'line_items[0][price_data][unit_amount]' => (string) $cents,
            'line_items[0][price_data][product_data][name]' => 'AURIX ' . $order['metal'] . ' reservation (indicative grams)',
            'line_items[0][price_data][product_data][description]' =>
                '~' . $order['grams'] . ' g at live quote. Payment now; vault allocation pending certification.',
            'metadata[aurix_order]' => (string) $order['id'],
            'metadata[metal]' => (string) $order['metal'],
            'metadata[grams]' => (string) $order['grams'],
        ];
        if ($email !== '') {
            $fields['customer_email'] = $email;
        }

        return self::stripePost('checkout/sessions', $fields);
    }

    /**
     * @return array<string, mixed>
     */
    private static function stripeGet(string $path): array
    {
        return self::stripeRequest('GET', $path, null);
    }

    /**
     * @param array<string, string> $fields
     * @return array<string, mixed>
     */
    private static function stripePost(string $path, array $fields): array
    {
        return self::stripeRequest('POST', $path, $fields);
    }

    /**
     * @param array<string, string>|null $fields
     * @return array<string, mixed>
     */
    private static function stripeRequest(string $method, string $path, ?array $fields): array
    {
        $key = self::env('STRIPE_SECRET_KEY');
        $ch = curl_init('https://api.stripe.com/v1/' . ltrim($path, '/'));
        if ($ch === false) {
            throw new \RuntimeException('stripe_curl');
        }
        $opts = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_USERPWD => $key . ':',
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ];
        if ($method === 'POST') {
            $opts[CURLOPT_POST] = true;
            $opts[CURLOPT_POSTFIELDS] = http_build_query($fields ?? []);
        }
        curl_setopt_array($ch, $opts);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $data = is_string($body) ? json_decode($body, true) : null;
        if (!is_array($data) || $code >= 400) {
            throw new \RuntimeException('stripe_http');
        }

        return $data;
    }

    /**
     * @param array<string, mixed> $order
     * @return array<string, mixed>
     */
    private static function paypalCreateOrder(array $order, string $returnUrl, string $cancelUrl): array
    {
        $payload = [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'reference_id' => $order['id'],
                'description' => 'AURIX ' . $order['metal'] . ' reservation ~' . $order['grams'] . ' g',
                'amount' => [
                    'currency_code' => 'EUR',
                    'value' => number_format((float) $order['fiatEur'], 2, '.', ''),
                ],
            ]],
            'application_context' => [
                'brand_name' => 'AURIX',
                'user_action' => 'PAY_NOW',
                'return_url' => $returnUrl,
                'cancel_url' => $cancelUrl,
            ],
        ];

        return self::paypalRequest('POST', '/v2/checkout/orders', $payload);
    }

    /**
     * @return array<string, mixed>
     */
    private static function paypalCapture(string $orderId): array
    {
        return self::paypalRequest('POST', '/v2/checkout/orders/' . rawurlencode($orderId) . '/capture', new \stdClass());
    }

    /**
     * @return array<string, mixed>
     */
    private static function paypalRequest(string $method, string $path, mixed $json): array
    {
        $token = self::paypalAccessToken();
        $base = self::env('PAYPAL_MODE', 'sandbox') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
        $ch = curl_init($base . $path);
        if ($ch === false) {
            throw new \RuntimeException('paypal_curl');
        }
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_POSTFIELDS => json_encode($json),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $token,
            ],
        ]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $data = is_string($body) ? json_decode($body, true) : null;
        if (!is_array($data) || $code >= 400) {
            throw new \RuntimeException('paypal_http');
        }

        return $data;
    }

    private static function paypalAccessToken(): string
    {
        $id = self::env('PAYPAL_CLIENT_ID');
        $secret = self::env('PAYPAL_CLIENT_SECRET');
        $base = self::env('PAYPAL_MODE', 'sandbox') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
        $ch = curl_init($base . '/v1/oauth2/token');
        if ($ch === false) {
            throw new \RuntimeException('paypal_curl');
        }
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_USERPWD => $id . ':' . $secret,
            CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        $body = curl_exec($ch);
        curl_close($ch);
        $data = is_string($body) ? json_decode($body, true) : null;
        $token = is_array($data) ? (string) ($data['access_token'] ?? '') : '';
        if ($token === '') {
            throw new \RuntimeException('paypal_token');
        }

        return $token;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function all(): array
    {
        $path = self::path();
        if (!is_file($path)) {
            return [];
        }
        $raw = file_get_contents($path);
        $data = is_string($raw) ? json_decode($raw, true) : null;

        return is_array($data) ? $data : [];
    }

    /**
     * @param array<string, mixed> $order
     */
    private static function upsert(array $order): void
    {
        $rows = self::all();
        $found = false;
        foreach ($rows as $i => $row) {
            if (($row['id'] ?? '') === ($order['id'] ?? '')) {
                $rows[$i] = $order;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $rows[] = $order;
        }
        $dir = dirname(self::path());
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }
        file_put_contents(self::path(), json_encode($rows, JSON_PRETTY_PRINT), LOCK_EX);
    }

    private static function path(): string
    {
        return dirname(__DIR__) . '/data/' . self::FILE;
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
