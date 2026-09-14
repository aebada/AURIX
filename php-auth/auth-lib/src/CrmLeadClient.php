<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * MunichTech EXPO / AIPass CRM connector (keyed upsert-outreach-lead).
 * Same pattern as Team-Management deploy/hostinger/includes/crm.php.
 */
final class CrmLeadClient
{
    public function __construct(private readonly Config $config)
    {
    }

    public function isConfigured(): bool
    {
        return $this->config->mteCrmEnabled
            && $this->config->mteCrmKey !== ''
            && $this->config->mteCrmBase !== '';
    }

    /**
     * @param array{
     *   company_name:string,
     *   contact_name?:string,
     *   contact_email:string,
     *   contact_title?:string,
     *   website?:string,
     *   notes?:string,
     *   email_source?:string,
     *   tags?:string,
     *   status?:string,
     *   segment?:string,
     *   categories?:string,
     *   append_notes?:bool,
     *   force_new?:bool
     * } $lead
     * @return array{ok:bool,status:int,json:?array,error?:string}
     */
    public function upsertLead(array $lead): array
    {
        if (!$this->isConfigured()) {
            return ['ok' => false, 'status' => 0, 'json' => null, 'error' => 'MTE CRM not configured'];
        }

        $company = trim((string) ($lead['company_name'] ?? ''));
        $email = strtolower(trim((string) ($lead['contact_email'] ?? '')));
        if ($company === '') {
            return ['ok' => false, 'status' => 0, 'json' => null, 'error' => 'company_name required'];
        }
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['ok' => false, 'status' => 0, 'json' => null, 'error' => 'valid contact_email required'];
        }

        $segment = trim((string) ($lead['segment'] ?? 'corporate'));
        $categories = trim((string) ($lead['categories'] ?? ''));
        if ($categories === '') {
            $categories = $segment;
        }

        $query = [
            'key' => $this->config->mteCrmKey,
            'company_name' => mb_substr($company, 0, 255),
            'contact_name' => mb_substr(trim((string) ($lead['contact_name'] ?? '')), 0, 120),
            'contact_email' => mb_substr($email, 0, 320),
            'contact_title' => mb_substr(trim((string) ($lead['contact_title'] ?? '')), 0, 120),
            'website' => mb_substr(trim((string) ($lead['website'] ?? 'https://aurixapp.de')), 0, 255),
            'notes' => (string) ($lead['notes'] ?? ''),
            'email_source' => mb_substr(trim((string) ($lead['email_source'] ?? 'aurix_website')), 0, 80),
            'tags' => trim((string) ($lead['tags'] ?? 'AURIX')),
            'status' => trim((string) ($lead['status'] ?? 'queued')),
            'segment' => $segment,
            'categories' => $categories,
            'append_notes' => !empty($lead['append_notes']) ? 1 : 0,
            'force_new' => !empty($lead['force_new']) ? 1 : 0,
            'country' => 'DE',
        ];

        $url = rtrim($this->config->mteCrmBase, '/') . '/upsert-outreach-lead?' . http_build_query($query);
        $ctx = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 20,
                'header' => "Accept: application/json\r\nUser-Agent: AURIX-php-auth/1.0\r\n",
                'ignore_errors' => true,
            ],
        ]);

        $raw = @file_get_contents($url, false, $ctx);
        $status = 0;
        if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
            $status = (int) $m[1];
        }
        if ($raw === false) {
            return ['ok' => false, 'status' => $status, 'json' => null, 'error' => 'Could not reach MTE CRM'];
        }

        $json = json_decode($raw, true);
        if (!is_array($json)) {
            return ['ok' => false, 'status' => $status, 'json' => null, 'error' => 'CRM returned non-JSON'];
        }

        $ok = $status >= 200 && $status < 300 && !empty($json['success']);

        return [
            'ok' => $ok,
            'status' => $status,
            'json' => $json,
            'error' => $ok ? null : (string) ($json['message'] ?? $json['error'] ?? 'CRM upsert failed'),
        ];
    }
}
