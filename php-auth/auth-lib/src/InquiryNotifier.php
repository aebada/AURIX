<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * Side effects after an inquiry is persisted: admin email, auto-reply, CRM upsert.
 * Failures are soft — the intake endpoint still returns success if the JSON file was written.
 */
final class InquiryNotifier
{
    public function __construct(
        private readonly Config $config,
        private readonly SmtpMailer $mailer,
        private readonly CrmLeadClient $crm,
    ) {
    }

    /**
     * @param array<string,mixed> $record
     * @return array{mail_notify:bool,mail_reply:bool,crm:bool}
     */
    public function notify(array $record): array
    {
        $result = [
            'mail_notify' => false,
            'mail_reply' => false,
            'crm' => false,
        ];

        $kind = (string) ($record['kind'] ?? 'contact');
        $name = (string) ($record['name'] ?? '');
        $email = (string) ($record['email'] ?? '');
        $message = (string) ($record['message'] ?? '');
        $org = isset($record['organization']) ? trim((string) $record['organization']) : '';
        $role = isset($record['role']) ? trim((string) $record['role']) : '';
        $vertical = isset($record['vertical']) ? trim((string) $record['vertical']) : '';
        $ticket = isset($record['ticketSize']) ? trim((string) $record['ticketSize']) : '';
        $id = (string) ($record['id'] ?? '');

        if ($this->mailer->isConfigured()) {
            $notifyTo = $this->config->mailNotifyTo !== ''
                ? $this->config->mailNotifyTo
                : $this->config->smtpFrom;
            $subject = sprintf('[AURIX %s] %s', strtoupper($kind), $name);
            $body = implode("\n", array_filter([
                'New AURIX website inquiry',
                '',
                'ID: ' . $id,
                'Kind: ' . $kind,
                'Name: ' . $name,
                'Email: ' . $email,
                $org !== '' ? 'Organization: ' . $org : null,
                $role !== '' ? 'Role: ' . $role : null,
                $vertical !== '' ? 'Vertical: ' . $vertical : null,
                $ticket !== '' ? 'Ticket size: ' . $ticket : null,
                '',
                'Message:',
                $message,
                '',
                '— aurixapp.de',
            ], static fn ($line) => $line !== null));

            $sent = $this->mailer->send([$notifyTo], $subject, $body, $email);
            $result['mail_notify'] = !empty($sent['ok']);

            if ($this->config->mailAutoReply && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $replySubject = 'We received your message — AURIX';
                $replyBody = implode("\n", [
                    'Hi ' . ($name !== '' ? $name : 'there') . ',',
                    '',
                    'Thanks for contacting AURIX. We received your message and will follow up shortly.',
                    '',
                    'If you need to reach us directly: ' . ($this->config->publicContactEmail ?: 'contact@aurixapp.de'),
                    '',
                    '— The AURIX team',
                    'https://aurixapp.de',
                ]);
                $reply = $this->mailer->send([$email], $replySubject, $replyBody, $notifyTo);
                $result['mail_reply'] = !empty($reply['ok']);
            }
        }

        if ($this->crm->isConfigured() && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $company = $org !== ''
                ? $org
                : ('AURIX ' . $kind . ' — ' . ($name !== '' ? $name : $email));
            // MTE outreach segments: startup|corporate|investor|sme|… (no "partner")
            $segment = match ($kind) {
                'investor' => 'investor',
                'partner' => 'corporate',
                'business' => 'corporate',
                default => 'other',
            };
            $notes = implode("\n", array_filter([
                gmdate('Y-m-d') . ': AURIX website inquiry (' . $kind . '); id=' . $id,
                $role !== '' ? 'role=' . $role : null,
                $vertical !== '' ? 'vertical=' . $vertical : null,
                $ticket !== '' ? 'ticket=' . $ticket : null,
                '',
                mb_substr($message, 0, 1500),
            ], static fn ($line) => $line !== null));

            $crm = $this->crm->upsertLead([
                'company_name' => $company,
                'contact_name' => $name,
                'contact_email' => $email,
                'contact_title' => $role !== '' ? $role : ucfirst($kind),
                'website' => 'https://aurixapp.de',
                'notes' => $notes,
                'email_source' => 'aurix_' . $kind,
                'tags' => 'AURIX,aurix_' . $kind,
                'status' => 'queued',
                'segment' => $segment,
                'categories' => $segment,
                'append_notes' => true,
                'force_new' => false,
            ]);
            $result['crm'] = !empty($crm['ok']);
        }

        return $result;
    }
}
