// Marketing-site chat client. Calls a public (no-auth) endpoint when
 // configured — never embeds provider API keys in the static export.
 //
 // Resolution order for the endpoint:
 //   1. NEXT_PUBLIC_CHAT_API_URL (explicit override)
 //   2. /auth/chat.php when NEXT_PUBLIC_USE_PHP_AUTH=1 (Hostinger PHP proxy)
 //   3. unset → local demo replies only

import { USE_PHP_AUTH } from "@/lib/auth-urls";

export type ChatRole = "user" | "assistant";

export interface ChatHistoryItem {
  role: ChatRole;
  content: string;
}

export interface ChatReply {
  reply: string;
  provider: string;
  suggestions?: string[];
}

/** Default chips shown on welcome and when no topic is detected. */
export const WELCOME_SUGGESTIONS = [
  "Gold reserves",
  "Wallet & payments",
  "Pricing",
  "Investors",
  "Sign in help",
] as const;

type SuggestionTopic =
  | "reserves"
  | "wallet"
  | "pricing"
  | "kyc"
  | "ai"
  | "contact"
  | "investor"
  | "account"
  | "default";

const TOPIC_SUGGESTIONS: Record<SuggestionTopic, readonly string[]> = {
  reserves: [
    "Reserve transparency",
    "How backing works",
    "Gold vs silver",
    "Pricing",
    "Talk to someone",
  ],
  wallet: [
    "Send & receive",
    "Multi-asset wallet",
    "Create account",
    "Sign in help",
    "Pricing",
  ],
  pricing: [
    "Plans & tiers",
    "Markets",
    "Gold reserves",
    "Create account",
    "Contact support",
  ],
  kyc: [
    "Security overview",
    "AI governance",
    "Create account",
    "Sign in help",
    "Contact support",
  ],
  ai: [
    "AI governance",
    "Reserve transparency",
    "How AURIX works",
    "Security",
    "Contact support",
  ],
  contact: [
    "Gold reserves",
    "Wallet & payments",
    "Pricing",
    "Create account",
    "How AURIX works",
  ],
  investor: [
    "Reserve transparency",
    "How backing works",
    "Pricing",
    "Security",
    "Contact support",
  ],
  account: [
    "Sign in help",
    "Create account",
    "KYC & verification",
    "Wallet & payments",
    "Contact support",
  ],
  default: WELCOME_SUGGESTIONS,
};

function detectTopic(text: string): SuggestionTopic {
  const m = text.toLowerCase();
  if (/gold|silver|reserve|vault|backing|transparency/.test(m)) return "reserves";
  if (/wallet|cash|pay|transfer|send|receive/.test(m)) return "wallet";
  if (/price|fee|cost|pricing|subscription|plan|tier|market/.test(m)) return "pricing";
  if (/kyc|verify|identity|regulat|compliance|license/.test(m)) return "kyc";
  if (/ai|assistant|audit|governance/.test(m)) return "ai";
  if (/contact|support|help|human|email|talk/.test(m)) return "contact";
  if (/investor|invest|partner|press/.test(m)) return "investor";
  if (/sign.?in|log.?in|account|register|create/.test(m)) return "account";
  return "default";
}

/** Client-side contextual chips (3–5) from the latest user message and/or bot reply. */
export function getClientSuggestions(
  lastUserMessage: string,
  lastBotReply?: string,
): string[] {
  const combined = `${lastUserMessage} ${lastBotReply ?? ""}`.trim();
  const topic = detectTopic(combined);
  const pool = [...TOPIC_SUGGESTIONS[topic]];
  return pool.slice(0, 5);
}

function normalizeSuggestions(
  raw: unknown,
  fallback: string[],
): string[] {
  if (!Array.isArray(raw)) return fallback.slice(0, 5);
  const cleaned = raw
    .filter((s): s is string => typeof s === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 80);
  const unique = [...new Set(cleaned)];
  if (unique.length < 3) return fallback.slice(0, 5);
  return unique.slice(0, 5);
}

const EXPLICIT_URL = process.env.NEXT_PUBLIC_CHAT_API_URL?.trim() ?? "";

export const CHAT_API_URL =
  EXPLICIT_URL || (USE_PHP_AUTH ? "/auth/chat.php" : "");

export const CHAT_IS_LIVE = CHAT_API_URL.length > 0;

const DEMO_FAQS: { match: RegExp; reply: string }[] = [
  {
    match: /gold|silver|reserve|vault|backing/i,
    reply:
      "AURIX connects vaulted gold and silver reserves to an AI-audited payment network. Reserves sit with partner vaults; the app layer orchestrates ownership, payments, and transparency reporting — not speculative trading advice.",
  },
  {
    match: /wallet|cash|pay|transfer|send|receive/i,
    reply:
      "The AURIX wallet is multi-asset: cash, gold, and silver in one place. You can pay and transfer instantly on the network while reserves stay vaulted. For account access, use Sign in or Create account in the header.",
  },
  {
    match: /price|fee|cost|pricing|subscription/i,
    reply:
      "Pricing depends on plan and corridor. See the Pricing page for current tiers, and Markets for live metal references. This assistant does not quote executable rates.",
  },
  {
    match: /kyc|verify|identity|regulat|compliance|license/i,
    reply:
      "AURIX is built as a regulated orchestration layer. Identity verification (KYC) is required before full wallet features unlock. Details live on Security and AI Governance.",
  },
  {
    match: /ai|assistant|audit|governance/i,
    reply:
      "AI in AURIX supports auditing, risk signals, and product guidance — it does not replace regulated decision-making or give personal investment advice. See AI Governance for the oversight model.",
  },
  {
    match: /contact|support|help|human|email/i,
    reply:
      "For partnership, press, or account help, use the Contact page — the team replies from there. I can answer product questions here anytime.",
  },
  {
    match: /how|work|what is|aurix/i,
    reply:
      "AURIX is Measured Trust — real digital money: vaulted gold and silver reserves, connected to an instant global payment network with AI-assisted audit trails. Explore How it works, Features, and Reserve transparency for the full picture.",
  },
];

const DEMO_DEFAULT =
  "Thanks for asking. I'm the AURIX site assistant (demo mode — live AI is not connected on this build). I can outline how reserves, the multi-asset wallet, pricing, and security work. Try asking about gold reserves, the wallet, or KYC — or visit Contact for a human reply.";

export function demoChatReply(message: string): ChatReply {
  const hit = DEMO_FAQS.find((f) => f.match.test(message));
  const reply = hit?.reply ?? DEMO_DEFAULT;
  return {
    reply,
    provider: "demo",
    suggestions: getClientSuggestions(message, reply),
  };
}

export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[] = [],
): Promise<ChatReply> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error("Message is empty");
  }

  if (!CHAT_IS_LIVE) {
    // Small delay so the UI still feels conversational in demo mode.
    await new Promise((r) => setTimeout(r, 450));
    return demoChatReply(trimmed);
  }

  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: trimmed,
      history: history.slice(-20),
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    reply?: string;
    provider?: string;
    suggestions?: unknown;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(body.error ?? `Chat request failed (${res.status})`);
  }

  if (typeof body.reply !== "string" || !body.reply.trim()) {
    throw new Error("Empty chat reply");
  }

  const fallback = getClientSuggestions(trimmed, body.reply);
  return {
    reply: body.reply,
    provider: typeof body.provider === "string" ? body.provider : "api",
    suggestions: normalizeSuggestions(body.suggestions, fallback),
  };
}
