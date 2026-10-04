<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * London-linked indicative gold/silver spot (price rail only — not custody).
 * gold-api.com XAU/XAG USD per troy ounce + open.er-api.com USD/EUR.
 */
final class MetalQuotes
{
    private const TROY_OUNCE_GRAMS = 31.1034768;

    private const CACHE_FILE = 'metal-quotes-cache.json';

    private const CACHE_TTL = 45;

    /**
     * @return array<string, mixed>
     */
    public static function fetch(string $currency = 'USD'): array
    {
        $currency = strtoupper($currency) === 'EUR' ? 'EUR' : 'USD';
        $spot = self::loadSpot();
        $mult = $currency === 'EUR' ? $spot['eurPerUsd'] : 1.0;

        $quotes = [];
        foreach (['gold' => $spot['goldUsdOz'], 'silver' => $spot['silverUsdOz']] as $metal => $usdOz) {
            $oz = $usdOz * $mult;
            $gram = $oz / self::TROY_OUNCE_GRAMS;
            $quotes[] = [
                'metal' => $metal,
                'pricePerOunce' => round($oz, 4),
                'pricePerGram' => round($gram, 6),
                'quoteCurrency' => $currency,
                'asOf' => gmdate('c', $spot['at']),
                'kind' => 'indicative_spot',
                'reference' => 'LBMA',
                'source' => 'gold-api.com+open.er-api.com',
                'liveCustody' => false,
            ];
        }

        $gold = $quotes[0];
        $silver = $quotes[1];

        return [
            'asOf' => $gold['asOf'],
            'liveCustody' => false,
            'kind' => 'indicative_spot',
            'source' => 'gold-api.com+open.er-api.com',
            'reference' => 'LBMA',
            'prices' => [
                'goldUsdPerOunce' => $currency === 'USD' ? $gold['pricePerOunce'] : round($spot['goldUsdOz'], 4),
                'silverUsdPerOunce' => $currency === 'USD' ? $silver['pricePerOunce'] : round($spot['silverUsdOz'], 4),
                'goldUsdPerGram' => $currency === 'USD' ? $gold['pricePerGram'] : round($spot['goldUsdOz'] / self::TROY_OUNCE_GRAMS, 6),
                'silverUsdPerGram' => $currency === 'USD' ? $silver['pricePerGram'] : round($spot['silverUsdOz'] / self::TROY_OUNCE_GRAMS, 6),
            ],
            'quotes' => $quotes,
        ];
    }

    /**
     * @return array{at:int,goldUsdOz:float,silverUsdOz:float,eurPerUsd:float}
     */
    private static function loadSpot(): array
    {
        $dir = dirname(__DIR__) . '/data';
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }
        $path = $dir . '/' . self::CACHE_FILE;
        if (is_file($path)) {
            $raw = file_get_contents($path);
            $cached = is_string($raw) ? json_decode($raw, true) : null;
            if (
                is_array($cached)
                && isset($cached['at'], $cached['goldUsdOz'], $cached['silverUsdOz'], $cached['eurPerUsd'])
                && (time() - (int) $cached['at']) < self::CACHE_TTL
            ) {
                return [
                    'at' => (int) $cached['at'],
                    'goldUsdOz' => (float) $cached['goldUsdOz'],
                    'silverUsdOz' => (float) $cached['silverUsdOz'],
                    'eurPerUsd' => (float) $cached['eurPerUsd'],
                ];
            }
        }

        $gold = self::httpJson('https://api.gold-api.com/price/XAU');
        $silver = self::httpJson('https://api.gold-api.com/price/XAG');
        $fx = self::httpJson('https://open.er-api.com/v6/latest/USD');

        $goldOz = isset($gold['price']) ? (float) $gold['price'] : 0.0;
        $silverOz = isset($silver['price']) ? (float) $silver['price'] : 0.0;
        $eur = isset($fx['rates']['EUR']) ? (float) $fx['rates']['EUR'] : 0.0;
        if ($goldOz <= 0 || $silverOz <= 0 || $eur <= 0) {
            throw new \RuntimeException('metal_quote_upstream');
        }

        $spot = [
            'at' => time(),
            'goldUsdOz' => $goldOz,
            'silverUsdOz' => $silverOz,
            'eurPerUsd' => $eur,
        ];

        @file_put_contents($path, json_encode($spot), LOCK_EX);

        return $spot;
    }

    /**
     * @return array<string, mixed>
     */
    private static function httpJson(string $url): array
    {
        $ch = curl_init($url);
        if ($ch === false) {
            throw new \RuntimeException('metal_quote_curl');
        }
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_HTTPHEADER => ['Accept: application/json', 'User-Agent: AURIX-quotes/1.0'],
        ]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if (!is_string($body) || $body === '' || $code < 200 || $code >= 300) {
            throw new \RuntimeException('metal_quote_http');
        }
        $data = json_decode($body, true);

        return is_array($data) ? $data : [];
    }
}
