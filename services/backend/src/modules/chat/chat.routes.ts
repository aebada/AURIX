import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/require-auth.js";
import { getChatCompletion, type ChatMessage } from "../../lib/ai-providers.js";

export const chatRouter = Router();

const SYSTEM_PROMPT: ChatMessage = {
  role: "system",
  content:
    "You are the AURIX AI assistant. AURIX is a regulated orchestration layer " +
    "connecting vaulted gold and silver reserves to an instant global payment " +
    "network, with a multi-asset wallet (cash, gold, silver). Help users " +
    "understand their wallet, transactions, markets, and the AURIX product. Be " +
    "concise and friendly. This is a demo app with mock financial data — do not " +
    "give real financial or investment advice, and say so if asked for it.",
};

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
      ...(history ?? []),
      { role: "user", content: message },
    ];
    const result = await getChatCompletion(messages);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
