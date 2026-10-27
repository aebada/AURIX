<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * Internal metal + BPC ledger (paper mint path).
 *
 * 1 BPC = 0.0001 g. Paid fiat → allocate on this ledger → mint BPC.
 * This is AURIX's operating reserve, not an attested London vault.
 * liveVault / liveCustody stay false until a signed custodian + audit.
 */
final class MetalLedger
{
    private const FILE = 'metal-ledger.json';

    public const GRAMS_PER_BPC = 0.0001;

    /**
     * @param array<string, mixed> $order
     * @return array<string, mixed>
     */
    public static function settlePaidOrder(array $order): array
    {
        if (($order['minted'] ?? false) === true) {
            return $order;
        }

        $email = strtolower(trim((string) ($order['email'] ?? '')));
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $email = 'guest+' . $order['id'] . '@aurixapp.de';
            $order['email'] = $email;
        }

        $metal = ($order['metal'] ?? 'gold') === 'silver' ? 'silver' : 'gold';
        $grams = round((float) ($order['grams'] ?? 0), 6);
        if ($grams <= 0) {
            throw new \RuntimeException('cannot_mint_zero');
        }

        $bpc = (int) round($grams / self::GRAMS_PER_BPC);
        $state = self::load();
        $wallet = $state['wallets'][$email] ?? self::emptyWallet($email);

        if ($metal === 'gold') {
            $wallet['goldGrams'] = round($wallet['goldGrams'] + $grams, 6);
            $wallet['goldBpc'] += $bpc;
            $state['vault']['goldGrams'] = round($state['vault']['goldGrams'] + $grams, 6);
        } else {
            $wallet['silverGrams'] = round($wallet['silverGrams'] + $grams, 6);
            $wallet['silverBpc'] += $bpc;
            $state['vault']['silverGrams'] = round($state['vault']['silverGrams'] + $grams, 6);
        }

        $wallet['orders'][] = $order['id'];
        $wallet['updatedAt'] = gmdate('c');
        $state['wallets'][$email] = $wallet;
        $state['vault']['updatedAt'] = gmdate('c');
        self::save($state);

        $order['status'] = 'minted';
        $order['allocation'] = 'internal_reserve';
        $order['minted'] = true;
        $order['bpc'] = $bpc;
        $order['liveMint'] = false;
        $order['liveCustody'] = false;
        $order['liveVault'] = false;
        $order['note'] = 'Minted BPC against AURIX internal reserve. London vault attestation is not live.';

        return $order;
    }

    /**
     * @return array<string, mixed>
     */
    public static function walletForEmail(string $email): array
    {
        $email = strtolower(trim($email));
        $state = self::load();
        $wallet = $state['wallets'][$email] ?? self::emptyWallet($email);
        $wallet['liveVault'] = false;
        $wallet['liveCustody'] = false;
        $wallet['note'] = 'Internal reserve + BPC mint. Not an independently attested London vault.';

        return $wallet;
    }

    /**
     * @return array<string, mixed>
     */
    public static function vaultReport(): array
    {
        $state = self::load();

        return [
            'asOf' => $state['vault']['updatedAt'] ?? gmdate('c'),
            'goldGrams' => $state['vault']['goldGrams'],
            'silverGrams' => $state['vault']['silverGrams'],
            'practice' => false,
            'internalReserve' => true,
            'liveVault' => false,
            'attested' => false,
            'note' => 'Sum of paid internal allocations. Not LBMA-attested London bars.',
        ];
    }

    /**
     * @return array{email:string,goldGrams:float,silverGrams:float,goldBpc:int,silverBpc:int,orders:list<string>,updatedAt:?string}
     */
    private static function emptyWallet(string $email): array
    {
        return [
            'email' => $email,
            'goldGrams' => 0.0,
            'silverGrams' => 0.0,
            'goldBpc' => 0,
            'silverBpc' => 0,
            'orders' => [],
            'updatedAt' => null,
        ];
    }

    /**
     * @return array{wallets:array<string,mixed>,vault:array{goldGrams:float,silverGrams:float,updatedAt:?string}}
     */
    private static function load(): array
    {
        $path = self::path();
        if (!is_file($path)) {
            return [
                'wallets' => [],
                'vault' => ['goldGrams' => 0.0, 'silverGrams' => 0.0, 'updatedAt' => null],
            ];
        }
        $raw = file_get_contents($path);
        $data = is_string($raw) ? json_decode($raw, true) : null;
        if (!is_array($data)) {
            return [
                'wallets' => [],
                'vault' => ['goldGrams' => 0.0, 'silverGrams' => 0.0, 'updatedAt' => null],
            ];
        }
        $data['wallets'] = is_array($data['wallets'] ?? null) ? $data['wallets'] : [];
        $vault = is_array($data['vault'] ?? null) ? $data['vault'] : [];
        $data['vault'] = [
            'goldGrams' => (float) ($vault['goldGrams'] ?? 0),
            'silverGrams' => (float) ($vault['silverGrams'] ?? 0),
            'updatedAt' => $vault['updatedAt'] ?? null,
        ];

        return $data;
    }

    /**
     * @param array<string, mixed> $state
     */
    private static function save(array $state): void
    {
        $dir = dirname(self::path());
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }
        file_put_contents(self::path(), json_encode($state, JSON_PRETTY_PRINT), LOCK_EX);
    }

    private static function path(): string
    {
        return dirname(__DIR__) . '/data/' . self::FILE;
    }
}
