import { Router } from "express";
import { z } from "zod";
import { db, getBalance, adjustBalance, nextId, type Asset } from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { ApiError } from "../../middleware/error-handler.js";

export const walletRouter = Router();

const ASSETS: Asset[] = ["GOLD", "SILVER", "FIAT"];

walletRouter.get("/", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const balances = ASSETS.map((asset) => getBalance(userId, asset));
  res.json({ balances });
});

const transferSchema = z.object({
  toEmail: z.string().email(),
  asset: z.enum(["GOLD", "SILVER", "FIAT"]),
  amount: z.number().positive(),
});

// Internal wallet-to-wallet transfer only. AURIX does not move real
// money/metal here — this adjusts the platform-state entitlement ledger;
// a production system reconciles this against partner APIs.
walletRouter.post("/transfer", requireAuth, (req, res) => {
  const { toEmail, asset, amount } = transferSchema.parse(req.body);
  const fromUserId = req.auth!.sub;

  const toUserId = db.usersByEmail.get(toEmail.toLowerCase());
  const toUser = toUserId ? db.users.get(toUserId) : undefined;
  if (!toUser) throw new ApiError(404, "Recipient not found");
  if (toUser.id === fromUserId) {
    throw new ApiError(400, "Cannot transfer to yourself");
  }

  const senderBalance = getBalance(fromUserId, asset);
  if (senderBalance.balance < amount) {
    throw new ApiError(400, "Insufficient balance");
  }

  adjustBalance(fromUserId, asset, -amount);
  adjustBalance(toUser.id, asset, amount);

  const transaction = {
    id: nextId("txn"),
    type: "transfer" as const,
    fromUserId,
    toUserId: toUser.id,
    asset,
    amount,
    fee: 0,
    status: "settled" as const,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(transaction);

  res.status(201).json({ transaction });
});

walletRouter.get("/transactions", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const transactions = db.transactions.filter(
    (t) => t.fromUserId === userId || t.toUserId === userId,
  );
  res.json({ transactions });
});
