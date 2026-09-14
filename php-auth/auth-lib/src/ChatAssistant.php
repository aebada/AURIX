<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * Public marketing-site chat helper. Mirrors services/backend AI provider
 * cascade (OpenAI-compatible chat completions). Keys stay in auth-lib/.env
 * — never in the static Next export.
 */
final class ChatAssistant
{
    private const SYSTEM_PROMPT =
        'You are the AURIX site assistant on aurixapp.de. AURIX is a regulated ' .
        'orchestration layer connecting vaulted gold and silver reserves to an ' .
        'instant global payment network, with a multi-asset wallet (cash, gold, ' .
        'silver). Help visitors understand the product, reserves, markets, ' .
        'security, and how to get started. Be concise and friendly. Do not give ' .
        'personal financial or investment advice — say so if asked. Do not invent ' .
        'prices, licenses, or partnership claims. For human contact, point people ' .
        'to the Contact page or contact@aurixapp.de.';

    /** @var list<array{name:string,baseUrl:string,apiKeyEnv:string,model:string}> */
    private const PROVIDERS = [
        [
            'name' => 'cerebras',
            'baseUrl' => 'https://api.cerebras.ai/v1',
            'apiKeyEnv' => 'CEREBRAS_API_KEY',
            'model' => 'llama-3.3-70b',
        ],
        [
            'name' => 'groq',
            'baseUrl' => 'https://api.groq.com/openai/v1',
            'apiKeyEnv' => 'GROQ_API_KEY',
            'model' => 'llama-3.3-70b-versatile',
        ],
        [
            'name' => 'sambanova',
            'baseUrl' => 'https://api.sambanova.ai/v1',
            'apiKeyEnv' => 'SAMBANOVA_API_KEY',
            'model' => 'Meta-Llama-3.1-8B-Instruct',
        ],
        [
            'name' => 'gemini',
            'baseUrl' => 'https://generativelanguage.googleapis.com/v1beta/openai',
            'apiKeyEnv' => 'GEMINI_API_KEY',
            'model' => 'gemini-2.0-flash',
        ],
        [
            'name' => 'openrouter',
            'baseUrl' => 'https://openrouter.ai/api/v1',
            'apiKeyEnv' => 'OPENROUTER_API_KEY',
            'model' => 'meta-llama/llama-3.3-70b-instruct:free',
        ],
        [
            'name' => 'openai',
            'baseUrl' => 'https://api.openai.com/v1',
            'apiKeyEnv' => 'OPENAI_API_KEY',
            'model' => 'gpt-4o-mini',
        ],
    ];

    /**
     * @param list<array{role:string,content:string}> $history
     * @return array{reply:string,provider:string,suggestions:list<string>}
     */
    public static function complete(string $message, array $history = []): array
    {
        $messages = [
            ['role' => 'system', 'content' => self::SYSTEM_PROMPT],
        ];
        foreach ($history as $item) {
            if (!isset($item['role'], $item['content'])) {
                continue;
            }
            if ($item['role'] !== 'user' && $item['role'] !== 'assistant') {
                continue;
            }
            $messages[] = [
                'role' => $item['role'],
                'content' => mb_substr((string) $item['content'], 0, 4000),
            ];
        }
        $messages[] = ['role' => 'user', 'content' => mb_substr($message, 0, 4000)];

        $lastError = 'no providers configured';

        foreach (self::PROVIDERS as $provider) {
            $apiKey = self::env($provider['apiKeyEnv']);
            if ($apiKey === '') {
                continue;
            }

            try {
                $reply = self::requestProvider($provider, $apiKey, $messages);
                if ($reply !== null) {
                    return [
                        'reply' => $reply,
                        'provider' => $provider['name'],
                        'suggestions' => self::suggestionsFor($message, $reply),
                    ];
                }
                $lastError = $provider['name'] . ': empty or failed response';
            } catch (\Throwable $e) {
                $lastError = $provider['name'] . ': ' . $e->getMessage();
            }
        }

        // Soft fallback so the marketing widget stays useful without keys.
        $reply = self::demoReply($message);

        return [
            'reply' => $reply,
            'provider' => 'demo',
            'suggestions' => self::suggestionsFor($message, $reply),
            // Callers may ignore; kept out of JSON by chat.php.
            '_debug' => $lastError,
        ];
    }

    /**
     * Contextual quick-reply chips (3–5) for the chat widget.
     *
     * @return list<string>
     */
    public static function suggestionsFor(string $userMessage, string $botReply = ''): array
    {
        $combined = mb_strtolower($userMessage . ' ' . $botReply);

        $pools = [
            'reserves' => [
                'Reserve transparency',
                'How backing works',
                'Gold vs silver',
                'Pricing',
                'Talk to someone',
            ],
            'wallet' => [
                'Send & receive',
                'Multi-asset wallet',
                'Create account',
                'Sign in help',
                'Pricing',
            ],
            'pricing' => [
                'Plans & tiers',
                'Markets',
                'Gold reserves',
                'Create account',
                'Contact support',
            ],
            'kyc' => [
                'Security overview',
                'AI governance',
                'Create account',
                'Sign in help',
                'Contact support',
            ],
            'ai' => [
                'AI governance',
                'Reserve transparency',
                'How AURIX works',
                'Security',
                'Contact support',
            ],
            'contact' => [
                'Gold reserves',
                'Wallet & payments',
                'Pricing',
                'Create account',
                'How AURIX works',
            ],
            'investor' => [
                'Reserve transparency',
                'How backing works',
                'Pricing',
                'Security',
                'Contact support',
            ],
            'account' => [
                'Sign in help',
                'Create account',
                'KYC & verification',
                'Wallet & payments',
                'Contact support',
            ],
            'default' => [
                'Gold reserves',
                'Wallet & payments',
                'Pricing',
                'Investors',
                'Sign in help',
            ],
        ];

        $topic = 'default';
        if (preg_match('/gold|silver|reserve|vault|backing|transparency/', $combined)) {
            $topic = 'reserves';
        } elseif (preg_match('/wallet|cash|pay|transfer|send|receive/', $combined)) {
            $topic = 'wallet';
        } elseif (preg_match('/price|fee|cost|pricing|subscription|plan|tier|market/', $combined)) {
            $topic = 'pricing';
        } elseif (preg_match('/kyc|verify|identity|regulat|compliance|license/', $combined)) {
            $topic = 'kyc';
        } elseif (preg_match('/ai|assistant|audit|governance/', $combined)) {
            $topic = 'ai';
        } elseif (preg_match('/contact|support|help|human|email|talk/', $combined)) {
            $topic = 'contact';
        } elseif (preg_match('/investor|invest|partner|press/', $combined)) {
            $topic = 'investor';
        } elseif (preg_match('/sign.?in|log.?in|account|register|create/', $combined)) {
            $topic = 'account';
        }

        return array_slice($pools[$topic], 0, 5);
    }

    /**
     * @param array{name:string,baseUrl:string,apiKeyEnv:string,model:string} $provider
     * @param list<array{role:string,content:string}> $messages
     */
    private static function requestProvider(array $provider, string $apiKey, array $messages): ?string
    {
        $payload = json_encode([
            'model' => $provider['model'],
            'messages' => $messages,
            'temperature' => 0.6,
        ], JSON_THROW_ON_ERROR);

        $ch = curl_init($provider['baseUrl'] . '/chat/completions');
        if ($ch === false) {
            throw new \RuntimeException('curl_init failed');
        }

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey,
            ],
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
        ]);

        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);

        if ($body === false) {
            throw new \RuntimeException($err !== '' ? $err : 'request failed');
        }

        if ($status < 200 || $status >= 300) {
            throw new \RuntimeException('HTTP ' . $status . ' ' . mb_substr((string) $body, 0, 180));
        }

        $data = json_decode((string) $body, true);
        $reply = $data['choices'][0]['message']['content'] ?? null;
        if (!is_string($reply) || trim($reply) === '') {
            return null;
        }

        return trim($reply);
    }

    private static function demoReply(string $message): string
    {
        $m = mb_strtolower($message);
        if (preg_match('/gold|silver|reserve|vault|backing/', $m)) {
            return 'AURIX connects vaulted gold and silver reserves to an AI-audited payment network. Reserves sit with partner vaults; the app orchestrates ownership, payments, and transparency — not speculative trading advice.';
        }
        if (preg_match('/wallet|cash|pay|transfer|send|receive/', $m)) {
            return 'The AURIX wallet is multi-asset: cash, gold, and silver. Sign in from the header to open an account. For live balances you will need a verified profile once the wallet app is available for your region.';
        }
        if (preg_match('/price|fee|cost|pricing|subscription/', $m)) {
            return 'See the Pricing page for plan tiers and Markets for metal references. This assistant does not quote executable rates.';
        }
        if (preg_match('/kyc|verify|identity|regulat|compliance/', $m)) {
            return 'AURIX is built as a regulated orchestration layer. KYC unlocks full wallet features — details are on Security and AI Governance.';
        }
        if (preg_match('/contact|support|help|human|email/', $m)) {
            return 'For partnership, press, or account help, use the Contact page or email contact@aurixapp.de. I can keep answering product questions here.';
        }

        return 'Thanks for asking. Live AI providers are not configured on this host yet, so you are seeing a short product FAQ reply. Ask about reserves, the wallet, pricing, or KYC — or visit Contact for the team.';
    }

    private static function env(string $key): string
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
        if ($value === false || $value === null || $value === '') {
            return '';
        }

        return (string) $value;
    }
}
