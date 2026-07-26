import { Router } from "express";
import { z } from "zod";
import { adjustBalance, getBalance, nextId, db } from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { ApiError } from "../../middleware/error-handler.js";

export const paymentsRouter = Router();

const topupSchema = z.object({
  amount: z.number().positive(),
});

// Dev/testing only: simulates a Stripe/PayPal/Tap top-up webhook
// confirming a successful deposit (see docs/PRODUCT_PLAN.md 5.4). No real
// payment provider is integrated.
paymentsRouter.post("/topup", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const { amount } = topupSchema.parse(req.body);

  adjustBalance(userId, "FIAT", amount);

  const transaction = {
    id: nextId("txn"),
    type: "deposit" as const,
    toUserId: userId,
    asset: "FIAT" as const,
    amount,
    fee: 0,
    status: "settled" as const,
    partnerReference: `mock-payment-provider-${nextId("ref")}`,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(transaction);

  res.status(201).json({ transaction, balance: getBalance(userId, "FIAT") });
});

// Indicative spread only (see docs/PRODUCT_PLAN.md section 6 / pricing
// page) — final rates are set during vendor/commercial negotiation.
const SPREAD_PCT = 0.005;

const buySchema = z.object({
  asset: z.enum(["GOLD", "SILVER"]),
  fiatAmount: z.number().positive(),
  pricePerUnit: z.number().positive(),
});

// Mock buy: real implementation routes the order to a vault/liquidity
// partner (see docs/PRODUCT_PLAN.md 4.1) and only records the result here.
paymentsRouter.post("/buy", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const { asset, fiatAmount, pricePerUnit } = buySchema.parse(req.body);

  const fiatBalance = getBalance(userId, "FIAT");
  if (fiatBalance.balance < fiatAmount) {
    throw new ApiError(400, "Insufficient fiat balance");
  }

  const fee = Number((fiatAmount * SPREAD_PCT).toFixed(2));
  const netFiat = fiatAmount - fee;
  const unitsPurchased = Number((netFiat / pricePerUnit).toFixed(4));

  adjustBalance(userId, "FIAT", -fiatAmount);
  adjustBalance(userId, asset, unitsPurchased);

  const transaction = {
    id: nextId("txn"),
    type: "buy" as const,
    toUserId: userId,
    asset,
    amount: unitsPurchased,
    fee,
    status: "settled" as const,
    partnerReference: `mock-vault-${nextId("ref")}`,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(transaction);

  res.status(201).json({ transaction, balances: { fiat: getBalance(userId, "FIAT"), [asset.toLowerCase()]: getBalance(userId, asset) } });
});

const sellSchema = z.object({
  asset: z.enum(["GOLD", "SILVER"]),
  units: z.number().positive(),
  pricePerUnit: z.number().positive(),
});

paymentsRouter.post("/sell", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const { asset, units, pricePerUnit } = sellSchema.parse(req.body);

  const assetBalance = getBalance(userId, asset);
  if (assetBalance.balance < units) {
    throw new ApiError(400, `Insufficient ${asset.toLowerCase()} balance`);
  }

  const grossFiat = units * pricePerUnit;
  const fee = Number((grossFiat * SPREAD_PCT).toFixed(2));
  const netFiat = Number((grossFiat - fee).toFixed(2));

  adjustBalance(userId, asset, -units);
  adjustBalance(userId, "FIAT", netFiat);

  const transaction = {
    id: nextId("txn"),
    type: "sell" as const,
    fromUserId: userId,
    asset,
    amount: units,
    fee,
    status: "settled" as const,
    partnerReference: `mock-vault-${nextId("ref")}`,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(transaction);

  res.status(201).json({ transaction, balances: { fiat: getBalance(userId, "FIAT"), [asset.toLowerCase()]: getBalance(userId, asset) } });
});
