<?php

declare(strict_types=1);

/**
 * Public employer company application for AURIX for Payroll (§3.4 / §8.1).
 * POST JSON → appends to auth-lib/data/payroll-employers.json, then
 * best-effort SMTP notify + auto-reply + MTE CRM upsert
 * (email_source=aurix-payroll-employer-apply).
 * Never prints secrets. No auth required for create.
 */

require_once dirname(__DIR__) . '/auth-lib/bootstrap.php';

use Aurix\Auth\CrmLeadClient;
use Aurix\Auth\SessionAuth;
use Aurix\Auth\SmtpMailer;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    SessionAuth::json(['error' => 'Method not allowed'], 405);
}

$raw = file_get_contents('php://input');
$data = is_string($raw) ? json_decode($raw, true) : null;
if (!is_array($data)) {
    SessionAuth::json(['error' => 'Invalid JSON body'], 400);
}

// Honeypot — silent success for bots
$website = isset($data['website']) ? trim((string) $data['website']) : '';
if ($website !== '') {
    SessionAuth::json(['ok' => true, 'id' => 'honeypot'], 201);
}

$company = isset($data['companyLegalName']) ? trim((string) $data['companyLegalName']) : '';
$reg = isset($data['registrationNumber']) ? trim((string) $data['registrationNumber']) : '';
$country = isset($data['country']) ? strtoupper(trim((string) $data['country'])) : '';
$address = isset($data['address']) ? trim((string) $data['address']) : '';
$contactName = isset($data['contactName']) ? trim((string) $data['contactName']) : '';
$contactEmail = isset($data['contactEmail']) ? trim((string) $data['contactEmail']) : '';
$contactPhone = isset($data['contactPhone']) ? trim((string) $data['contactPhone']) : '';
$employeeCount = isset($data['employeeCount']) ? trim((string) $data['employeeCount']) : '';
$industry = isset($data['industry']) ? trim((string) $data['industry']) : '';
$locale = isset($data['locale']) ? trim((string) $data['locale']) : '';
$additionality = !empty($data['additionalityAttested']);
$privacy = !empty($data['privacyConsent']);

if ($company === '' || mb_strlen($company) > 300) {
    SessionAuth::json(['error' => 'companyLegalName is required (max 300)'], 400);
}
if ($reg === '' || mb_strlen($reg) > 120) {
    SessionAuth::json(['error' => 'registrationNumber is required (max 120)'], 400);
}
if (!in_array($country, ['DE', 'AT'], true)) {
    SessionAuth::json(['error' => 'country must be DE or AT'], 400);
}
if ($address === '' || mb_strlen($address) > 500) {
    SessionAuth::json(['error' => 'address is required (max 500)'], 400);
}
if ($contactName === '' || mb_strlen($contactName) > 200) {
    SessionAuth::json(['error' => 'contactName is required (max 200)'], 400);
}
if ($contactEmail === '' || !filter_var($contactEmail, FILTER_VALIDATE_EMAIL) || mb_strlen($contactEmail) > 320) {
    SessionAuth::json(['error' => 'valid contactEmail is required'], 400);
}
if ($contactPhone === '' || mb_strlen($contactPhone) > 40) {
    SessionAuth::json(['error' => 'contactPhone is required (max 40)'], 400);
}
if ($employeeCount === '' || mb_strlen($employeeCount) > 40) {
    SessionAuth::json(['error' => 'employeeCount is required (max 40)'], 400);
}
if (!$additionality) {
    SessionAuth::json(['error' => 'additionality attestation is required'], 400);
}
if (!$privacy) {
    SessionAuth::json(['error' => 'privacy consent is required'], 400);
}

$id = 'pe_' . bin2hex(random_bytes(8));
$clientIp = '';
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']) && is_string($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $clientIp = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
} elseif (!empty($_SERVER['REMOTE_ADDR']) && is_string($_SERVER['REMOTE_ADDR'])) {
    $clientIp = $_SERVER['REMOTE_ADDR'];
}

$now = gmdate('c');
$record = [
    'id' => $id,
    'companyLegalName' => mb_substr($company, 0, 300),
    'registrationNumber' => mb_substr($reg, 0, 120),
    'country' => $country,
    'address' => mb_substr($address, 0, 500),
    'contactName' => mb_substr($contactName, 0, 200),
    'contactEmail' => mb_substr(strtolower($contactEmail), 0, 320),
    'contactPhone' => mb_substr($contactPhone, 0, 40),
    'employeeCount' => mb_substr($employeeCount, 0, 40),
    'industry' => $industry !== '' ? mb_substr($industry, 0, 120) : null,
    'locale' => $locale !== '' ? mb_substr($locale, 0, 16) : null,
    'kybStatus' => 'pending',
    'additionalityAttested' => true,
    'additionalityAttestedAt' => $now,
    'additionalityAttestedBy' => mb_substr($contactName, 0, 200),
    'additionalityAttestedIp' => mb_substr($clientIp, 0, 64),
    'privacyConsent' => true,
    'createdAt' => $now,
];

$dir = dirname(__DIR__) . '/auth-lib/data';
if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
    SessionAuth::json(['error' => 'Could not create data directory'], 500);
}

$file = $dir . '/payroll-employers.json';
$items = [];
if (is_file($file)) {
    $existing = json_decode((string) file_get_contents($file), true);
    if (is_array($existing)) {
        $items = $existing;
    }
}

array_unshift($items, $record);
$items = array_slice($items, 0, 500);

$json = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if ($json === false || file_put_contents($file, $json . "\n", LOCK_EX) === false) {
    SessionAuth::json(['error' => 'Could not persist application'], 500);
}

/** @var \Aurix\Auth\Config $config */
$mailer = new SmtpMailer($config);
$crm = new CrmLeadClient($config);

$sideEffects = [
    'mail_notify' => false,
    'mail_reply' => false,
    'crm' => false,
];

$messageBlock = implode("\n", array_filter([
    'Company: ' . $record['companyLegalName'],
    'Registration: ' . $record['registrationNumber'],
    'Country: ' . $record['country'],
    'Address: ' . $record['address'],
    'Employees (est.): ' . $record['employeeCount'],
    $record['industry'] ? 'Industry: ' . $record['industry'] : null,
    'Contact: ' . $record['contactName'],
    'Email: ' . $record['contactEmail'],
    'Phone: ' . $record['contactPhone'],
    'Additionality attested: ' . $record['additionalityAttestedAt'],
    'IP: ' . ($record['additionalityAttestedIp'] ?: 'n/a'),
]));

if ($mailer->isConfigured()) {
    $notifyTo = $config->mailNotifyTo !== ''
        ? $config->mailNotifyTo
        : $config->smtpFrom;
    $subject = sprintf('[AURIX PAYROLL EMPLOYER] %s', $record['companyLegalName']);
    $body = implode("\n", [
        'New AURIX for Payroll employer application',
        '',
        'ID: ' . $id,
        'Status: pending KYB review',
        '',
        $messageBlock,
        '',
        '— aurixapp.de/for-business/payroll/apply/',
    ]);
    $sent = $mailer->send([$notifyTo], $subject, $body, $record['contactEmail']);
    $sideEffects['mail_notify'] = !empty($sent['ok']);

    if ($config->mailAutoReply) {
        $replySubject = 'We received your company application — AURIX for Payroll';
        $replyBody = implode("\n", [
            'Hi ' . $record['contactName'] . ',',
            '',
            'Thanks for applying. Your company application for AURIX for Payroll is under review (typically 1–2 business days).',
            '',
            'Application ID: ' . $id,
            '',
            'We will email you when the review status changes. Live gold grants remain gated until certification for your country.',
            '',
            'If you need to reach us: ' . ($config->publicContactEmail ?: 'contact@aurixapp.de'),
            '',
            '— The AURIX team',
            'https://aurixapp.de/for-business/payroll/',
        ]);
        $reply = $mailer->send([$record['contactEmail']], $replySubject, $replyBody, $notifyTo);
        $sideEffects['mail_reply'] = !empty($reply['ok']);
    }
}

if ($crm->isConfigured()) {
    $notes = implode("\n", [
        gmdate('Y-m-d') . ': AURIX payroll employer apply; id=' . $id . '; kyb=pending',
        $messageBlock,
    ]);
    $crmResult = $crm->upsertLead([
        'company_name' => $record['companyLegalName'],
        'contact_name' => $record['contactName'],
        'contact_email' => $record['contactEmail'],
        'contact_title' => 'Payroll employer applicant',
        'website' => 'https://aurixapp.de/for-business/payroll/apply/',
        'notes' => mb_substr($notes, 0, 2000),
        'email_source' => 'aurix-payroll-employer-apply',
        'tags' => 'AURIX,aurix-payroll-employer-apply,payroll,' . $record['country'],
        'status' => 'queued',
        'segment' => 'corporate',
        'categories' => 'corporate',
        'append_notes' => true,
        'force_new' => false,
    ]);
    $sideEffects['crm'] = !empty($crmResult['ok']);
}

SessionAuth::json([
    'ok' => true,
    'id' => $id,
    'kybStatus' => 'pending',
    'notified' => $sideEffects,
], 201);
