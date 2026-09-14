<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * Minimal SMTP client for Hostinger Mail (ssl://smtp.hostinger.com:465
 * or STARTTLS on 587) — no PHPMailer dependency.
 * Credentials come from Config / auth-lib/.env only. Never use SMTP_PASS
 * as FTP/SSH deploy credentials.
 */
final class SmtpMailer
{
    public function __construct(private readonly Config $config)
    {
    }

    public function isConfigured(): bool
    {
        return $this->config->smtpHost !== ''
            && $this->config->smtpUser !== ''
            && $this->config->smtpPass !== ''
            && $this->config->smtpFrom !== '';
    }

    /**
     * @param list<string> $to
     * @return array{ok:bool,error?:string}
     */
    public function send(array $to, string $subject, string $textBody, ?string $replyTo = null): array
    {
        if (!$this->isConfigured()) {
            return ['ok' => false, 'error' => 'SMTP not configured'];
        }

        $recipients = [];
        foreach ($to as $addr) {
            $addr = trim(strtolower($addr));
            if ($addr !== '' && filter_var($addr, FILTER_VALIDATE_EMAIL)) {
                $recipients[] = $addr;
            }
        }
        $recipients = array_values(array_unique($recipients));
        if ($recipients === []) {
            return ['ok' => false, 'error' => 'No valid recipients'];
        }

        $host = $this->config->smtpHost;
        $port = $this->config->smtpPort;
        $encryption = strtolower($this->config->smtpEncryption);
        $timeout = 25;

        $remote = ($encryption === 'ssl' || $encryption === 'smtps')
            ? 'ssl://' . $host . ':' . $port
            : 'tcp://' . $host . ':' . $port;

        $errno = 0;
        $errstr = '';
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'peer_name' => $host,
                'SNI_enabled' => true,
            ],
        ]);
        $fp = @stream_socket_client(
            $remote,
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT,
            $context,
        );
        if ($fp === false) {
            return ['ok' => false, 'error' => 'SMTP connect failed'];
        }

        stream_set_timeout($fp, $timeout);

        try {
            $this->expect($fp, [220]);
            $this->command($fp, 'EHLO aurixapp.de', [250]);

            if ($encryption === 'tls' || $encryption === 'starttls') {
                $this->command($fp, 'STARTTLS', [220]);
                $crypto = STREAM_CRYPTO_METHOD_TLS_CLIENT;
                if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
                    $crypto |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
                }
                if (!@stream_socket_enable_crypto($fp, true, $crypto)) {
                    throw new \RuntimeException('STARTTLS failed');
                }
                $this->command($fp, 'EHLO aurixapp.de', [250]);
            }

            $this->command($fp, 'AUTH LOGIN', [334]);
            $this->command($fp, base64_encode($this->config->smtpUser), [334]);
            $this->command($fp, base64_encode($this->config->smtpPass), [235]);

            $from = $this->config->smtpFrom;
            $fromName = $this->config->smtpFromName !== '' ? $this->config->smtpFromName : 'AURIX';
            $this->command($fp, 'MAIL FROM:<' . $from . '>', [250]);
            foreach ($recipients as $rcpt) {
                $this->command($fp, 'RCPT TO:<' . $rcpt . '>', [250, 251]);
            }
            $this->command($fp, 'DATA', [354]);

            $headers = [
                'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
                'From: ' . $this->encodeAddress($fromName, $from),
                'To: ' . implode(', ', $recipients),
                'Subject: ' . $this->encodeHeader($subject),
                'MIME-Version: 1.0',
                'Content-Type: text/plain; charset=UTF-8',
                'Content-Transfer-Encoding: 8bit',
                'Message-ID: <' . bin2hex(random_bytes(12)) . '@aurixapp.de>',
            ];
            if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
                $headers[] = 'Reply-To: ' . $replyTo;
            }

            $body = preg_replace("/\r\n|\r|\n/", "\r\n", $textBody) ?? $textBody;
            // Dot-stuffing
            $body = preg_replace('/^\./m', '..', $body) ?? $body;

            $payload = implode("\r\n", $headers) . "\r\n\r\n" . $body . "\r\n.";
            fwrite($fp, $payload . "\r\n");
            $this->expect($fp, [250]);
            $this->command($fp, 'QUIT', [221]);
        } catch (\Throwable $e) {
            fclose($fp);

            return ['ok' => false, 'error' => 'SMTP send failed'];
        }

        fclose($fp);

        return ['ok' => true];
    }

    private function encodeAddress(string $name, string $email): string
    {
        $safe = trim(str_replace(["\r", "\n"], '', $name));
        if ($safe === '') {
            return $email;
        }

        return $this->encodeHeader($safe) . ' <' . $email . '>';
    }

    private function encodeHeader(string $value): string
    {
        $value = str_replace(["\r", "\n"], '', $value);
        if (preg_match('/^[\x20-\x7E]*$/', $value) === 1) {
            return $value;
        }

        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }

    /**
     * @param resource $fp
     * @param list<int> $okCodes
     */
    private function command($fp, string $line, array $okCodes): void
    {
        fwrite($fp, $line . "\r\n");
        $this->expect($fp, $okCodes);
    }

    /**
     * @param resource $fp
     * @param list<int> $okCodes
     */
    private function expect($fp, array $okCodes): void
    {
        $response = '';
        while (($line = fgets($fp, 515)) !== false) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
            if (strlen($line) < 4) {
                break;
            }
        }
        $code = (int) substr($response, 0, 3);
        if (!in_array($code, $okCodes, true)) {
            throw new \RuntimeException('Unexpected SMTP code ' . $code);
        }
    }
}
