import { ApiError } from "../middleware/error-handler.js";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResult {
  reply: string;
  provider: string;
}

interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  model: string;
}

// Every provider below speaks the OpenAI chat-completions wire format (native
// or via a compatibility endpoint), so one request/response shape covers all
// of them. Ordered roughly by how generous each one's free daily quota is —
// the most "free" capacity gets tried first, paid/limited providers last.
// Manus is a separate agent-task API (not chat-completions shaped) and isn't
// included here.
const PROVIDERS: ProviderConfig[] = [
  {
    name: "cerebras",
    baseUrl: "https://api.cerebras.ai/v1",
    apiKeyEnv: "CEREBRAS_API_KEY",
    model: "llama-3.3-70b",
  },
  {
    name: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
    model: "llama-3.3-70b-versatile",
  },
  {
    name: "sambanova",
    baseUrl: "https://api.sambanova.ai/v1",
    apiKeyEnv: "SAMBANOVA_API_KEY",
    model: "Meta-Llama-3.1-8B-Instruct",
  },
  {
    name: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKeyEnv: "GEMINI_API_KEY",
    model: "gemini-2.0-flash",
  },
  {
    name: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "meta-llama/llama-3.3-70b-instruct:free",
  },
  {
    name: "openai",
    baseUrl: "https://api.openai.com/v1",
    apiKeyEnv: "OPENAI_API_KEY",
    model: "gpt-4o-mini",
  },
];

// Providers that hit a quota/rate-limit error today get skipped on
// subsequent requests instead of being retried immediately — this is what
// lets the router "use up" each provider's free daily credits in turn
// rather than hammering an exhausted one. Resets at UTC midnight.
const exhaustedOn = new Map<string, string>();

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function markExhausted(name: string) {
  exhaustedOn.set(name, todayUtc());
}

function isExhausted(name: string): boolean {
  return exhaustedOn.get(name) === todayUtc();
}

function looksLikeQuotaError(status: number, body: string): boolean {
  if (status === 429) return true;
  const lowered = body.toLowerCase();
  return (
    lowered.includes("quota") ||
    lowered.includes("insufficient_quota") ||
    lowered.includes("rate limit") ||
    lowered.includes("rate_limit")
  );
}

export async function getChatCompletion(messages: ChatMessage[]): Promise<ChatResult> {
  const candidates = PROVIDERS.filter(
    (p) => process.env[p.apiKeyEnv] && !isExhausted(p.name),
  );

  if (candidates.length === 0) {
    throw new ApiError(
      503,
      "No AI provider is currently available (all configured providers are unconfigured or exhausted for today)",
    );
  }

  let lastError: string | undefined;

  for (const provider of candidates) {
    const apiKey = process.env[provider.apiKeyEnv]!;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    try {
      const res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: provider.model, messages, temperature: 0.6 }),
        signal: controller.signal,
      });
      const bodyText = await res.text();

      if (!res.ok) {
        if (looksLikeQuotaError(res.status, bodyText)) {
          markExhausted(provider.name);
        }
        lastError = `${provider.name}: ${res.status} ${bodyText.slice(0, 200)}`;
        continue;
      }

      const data = JSON.parse(bodyText);
      const reply = data.choices?.[0]?.message?.content;
      if (typeof reply !== "string" || !reply.trim()) {
        lastError = `${provider.name}: empty response`;
        continue;
      }

      return { reply, provider: provider.name };
    } catch (err) {
      lastError = `${provider.name}: ${err instanceof Error ? err.message : String(err)}`;
      continue;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new ApiError(503, `All AI providers failed. Last error: ${lastError ?? "unknown"}`);
}
