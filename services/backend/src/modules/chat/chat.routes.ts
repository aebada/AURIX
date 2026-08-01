import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/require-auth.js";
import { getChatCompletion, type ChatMessage } from "../../lib/ai-providers.js";
import { ETF_CATALOG } from "../../data/etf-catalog.js";
import { db, getBalance } from "../../data/mock-db.js";

export const chatRouter = Router();

// Compact enough to embed directly in every request (24 entries) — gives
// the assistant real tickers/categories/risk levels to ground suggestions
// in, rather than inventing products that don't exist on the platform.
const CATALOG_SUMMARY = ETF_CATALOG.map(
  (e) =>
    `${e.ticker} (${e.name}, ${e.category}, risk: ${e.riskLevel}, 1Y return: ${e.oneYearReturnPct}%, min $${e.minInvestment})`,
).join("; ");

const SYSTEM_PROMPT: ChatMessage = {
  role: "system",
  content:
    "You are the AURIX AI assistant. AURIX is a regulated orchestration layer " +
    "connecting vaulted gold and silver reserves to an instant global payment " +
    "network, with a multi-asset wallet (cash, gold, silver) and fractional ETF " +
    "investing. Help users understand their wallet, transactions, markets, and " +
    "the AURIX product. Be concise and friendly.\n\n" +
    "When a user describes their financial situation, goals, or risk tolerance " +
    "and asks what to invest in, you may suggest 1-3 relevant options grounded " +
    "ONLY in AURIX's own catalog below plus their own account context (also " +
    "below) — never invent a ticker or product that isn't in this catalog. " +
    "Briefly explain why each fits what they described (goal, risk tolerance, " +
    "time horizon). This is illustrative/educational guidance only, not " +
    "licensed financial advice: always say so plainly when you suggest " +
    "anything, never promise or imply guaranteed returns, and encourage the " +
    "user to do their own research or consult a licensed advisor before " +
    "acting. This is a demo app with mock/simulated pricing data.\n\n" +
    `AURIX's investable catalog — gold and silver (fractional, buy/sell via ` +
    `the wallet) plus these ETFs: ${CATALOG_SUMMARY}`,
};

function buildAccountContext(userId: string): ChatMessage {
  const fiat = getBalance(userId, "FIAT").balance;
  const gold = getBalance(userId, "GOLD").balance;
  const silver = getBalance(userId, "SILVER").balance;
  const etfHoldings = Array.from(db.etfHoldings.values()).filter(
    (h) => h.userId === userId && h.units > 0,
  );
  const holdingsSummary = etfHoldings.length
    ? etfHoldings.map((h) => `${h.ticker}: ${h.units.toFixed(4)} units`).join(", ")
    : "none";

  return {
    role: "system",
    content:
      `This user's current AURIX account: $${fiat.toFixed(2)} fiat balance, ` +
      `${gold.toFixed(4)}g gold, ${silver.toFixed(4)}g silver, ETF holdings: ${holdingsSummary}.`,
  };
}

const messageSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .max(20)
    .optional(),
});

chatRouter.post("/message", requireAuth, async (req, res, next) => {
  try {
    const { message, history } = messageSchema.parse(req.body);
    const messages: ChatMessage[] = [
      SYSTEM_PROMPT,
      buildAccountContext(req.auth!.sub),
      ...(history ?? []),
      { role: "user", content: message },
    ];
    const result = await getChatCompletion(messages);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
