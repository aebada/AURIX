import { Router } from "express";
import { z } from "zod";
import { ETF_CATALOG, findEtf, livePrice, isAvailableInCountry, type EtfCategory } from "../../data/etf-catalog.js";
import { db, nextId, adjustBalance, getBalance, etfHoldingKey } from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { ApiError } from "../../middleware/error-handler.js";

export const etfsRouter = Router();

// Indicative spread only, same convention as payments/buy-sell for
// GOLD/SILVER (see docs/PRODUCT_PLAN.md section 6) — real brokerage
// commissions are set during vendor negotiation with DriveWealth / Alpaca
// / Interactive Brokers.
const SPREAD_PCT = 0.003;

function serializeEtf(ticker: (typeof ETF_CATALOG)[number]) {
  return {
    ticker: ticker.ticker,
    isin: ticker.isin,
    name: ticker.name,
    provider: ticker.provider,
    category: ticker.category,
    theme: ticker.theme,
    exchange: ticker.exchange,
    currency: ticker.currency,
    price: livePrice(ticker),
    expenseRatioPct: ticker.expenseRatioPct,
    dividendYieldPct: ticker.dividendYieldPct,
    oneYearReturnPct: ticker.oneYearReturnPct,
    riskLevel: ticker.riskLevel,
    minInvestment: ticker.minInvestment,
    fractionalSupported: ticker.fractionalSupported,
    description: ticker.description,
    topHoldings: ticker.topHoldings,
  };
}

const CATEGORIES: EtfCategory[] = ["equity", "bond", "dividend", "esg", "sector", "commodity", "islamic"];

// GET /etfs?country=DE&category=equity&q=world — catalog dynamically
// filtered by jurisdiction (see docs/PRODUCT_PLAN.md "Availability Rules").
// Verification/subscription-plan gating described in the feature spec is
// not enforced here — see the module doc comment at the bottom of this file.
etfsRouter.get("/", (req, res) => {
  const country = typeof req.query.country === "string" ? req.query.country : undefined;
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const q = typeof req.query.q === "string" ? req.query.q.toLowerCase() : undefined;

  let results = ETF_CATALOG.filter((e) => isAvailableInCountry(e, country));
  if (category && CATEGORIES.includes(category as EtfCategory)) {
    results = results.filter((e) => e.category === category);
  }
  if (q) {
    results = results.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.ticker.toLowerCase().includes(q) ||
        e.isin.toLowerCase().includes(q) ||
        e.theme.toLowerCase().includes(q),
    );
  }

  res.json({ categories: CATEGORIES, etfs: results.map(serializeEtf) });
});

etfsRouter.get("/me/portfolio", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const holdings = Array.from(db.etfHoldings.values()).filter((h) => h.userId === userId && h.units > 0);

  const rows = holdings.map((h) => {
    const def = findEtf(h.ticker);
    const price = def ? livePrice(def) : 0;
    const currentValue = Number((h.units * price).toFixed(2));
    const costBasis = Number((h.units * h.avgCostUsd).toFixed(2));
    return {
      ticker: h.ticker,
      name: def?.name ?? h.ticker,
      units: h.units,
      avgCostUsd: h.avgCostUsd,
      price,
      currentValue,
      costBasis,
      gainLossUsd: Number((currentValue - costBasis).toFixed(2)),
      gainLossPct: costBasis > 0 ? Number((((currentValue - costBasis) / costBasis) * 100).toFixed(2)) : 0,
    };
  });

  const totalValue = Number(rows.reduce((sum, r) => sum + r.currentValue, 0).toFixed(2));
  const totalCost = Number(rows.reduce((sum, r) => sum + r.costBasis, 0).toFixed(2));

  res.json({
    holdings: rows,
    totalValue,
    totalCost,
    totalGainLossUsd: Number((totalValue - totalCost).toFixed(2)),
  });
});

etfsRouter.get("/me/watchlist", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const tickers = Array.from(db.etfWatchlists.get(userId) ?? []);
  res.json({ etfs: tickers.map((t) => findEtf(t)).filter((e) => e).map((e) => serializeEtf(e!)) });
});

etfsRouter.post("/:ticker/watchlist", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const def = findEtf(req.params.ticker);
  if (!def) throw new ApiError(404, "ETF not found");

  const set = db.etfWatchlists.get(userId) ?? new Set<string>();
  set.add(def.ticker);
  db.etfWatchlists.set(userId, set);
  res.status(201).json({ watchlisted: true });
});

etfsRouter.delete("/:ticker/watchlist", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const set = db.etfWatchlists.get(userId);
  set?.delete(req.params.ticker.toUpperCase());
  res.json({ watchlisted: false });
});

const buySchema = z.object({ fiatAmount: z.number().positive() });

// Fractional market-order buy: real implementation routes this to a
// brokerage partner (DriveWealth / Alpaca / Interactive Brokers) and
// settles T+1/T+2; this mock settles instantly.
etfsRouter.post("/:ticker/buy", requireAuth, (req, res, next) => {
  try {
    const userId = req.auth!.sub;
    const def = findEtf(req.params.ticker);
    if (!def) throw new ApiError(404, "ETF not found");

    const { fiatAmount } = buySchema.parse(req.body);
    if (fiatAmount < def.minInvestment) {
      throw new ApiError(400, `Minimum investment for ${def.ticker} is $${def.minInvestment}`);
    }

    const fiatBalance = getBalance(userId, "FIAT");
    if (fiatBalance.balance < fiatAmount) {
      throw new ApiError(400, "Insufficient fiat balance");
    }

    const price = livePrice(def);
    const fee = Number((fiatAmount * SPREAD_PCT).toFixed(2));
    const netFiat = fiatAmount - fee;
    const units = Number((netFiat / price).toFixed(6));

    adjustBalance(userId, "FIAT", -fiatAmount);

    const key = etfHoldingKey(userId, def.ticker);
    const existing = db.etfHoldings.get(key);
    if (existing) {
      const totalUnits = existing.units + units;
      existing.avgCostUsd = Number(
        ((existing.units * existing.avgCostUsd + units * price) / totalUnits).toFixed(4),
      );
      existing.units = totalUnits;
      db.etfHoldings.set(key, existing);
    } else {
      db.etfHoldings.set(key, { userId, ticker: def.ticker, units, avgCostUsd: price });
    }

    const order = {
      id: nextId("etford"),
      userId,
      ticker: def.ticker,
      side: "buy" as const,
      units,
      pricePerUnitUsd: price,
      fiatAmountUsd: fiatAmount,
      feeUsd: fee,
      status: "settled" as const,
      createdAt: new Date().toISOString(),
    };
    db.etfOrders.push(order);

    res.status(201).json({ order, balance: getBalance(userId, "FIAT") });
  } catch (err) {
    next(err);
  }
});

const sellSchema = z.object({ units: z.number().positive() });

etfsRouter.post("/:ticker/sell", requireAuth, (req, res, next) => {
  try {
    const userId = req.auth!.sub;
    const def = findEtf(req.params.ticker);
    if (!def) throw new ApiError(404, "ETF not found");

    const { units } = sellSchema.parse(req.body);
    const key = etfHoldingKey(userId, def.ticker);
    const holding = db.etfHoldings.get(key);
    if (!holding || holding.units < units) {
      throw new ApiError(400, `Insufficient ${def.ticker} units`);
    }

    const price = livePrice(def);
    const grossFiat = units * price;
    const fee = Number((grossFiat * SPREAD_PCT).toFixed(2));
    const netFiat = Number((grossFiat - fee).toFixed(2));

    holding.units = Number((holding.units - units).toFixed(6));
    db.etfHoldings.set(key, holding);
    adjustBalance(userId, "FIAT", netFiat);

    const order = {
      id: nextId("etford"),
      userId,
      ticker: def.ticker,
      side: "sell" as const,
      units,
      pricePerUnitUsd: price,
      fiatAmountUsd: netFiat,
      feeUsd: fee,
      status: "settled" as const,
      createdAt: new Date().toISOString(),
    };
    db.etfOrders.push(order);

    res.status(201).json({ order, balance: getBalance(userId, "FIAT") });
  } catch (err) {
    next(err);
  }
});

etfsRouter.get("/me/orders", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  const orders = db.etfOrders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ orders });
});

// Registered last among GET routes deliberately — "/me/..." above must be
// matched before this generic "/:ticker" catch-all, or e.g. GET
// /etfs/me/portfolio would bind "me" to :ticker instead of reaching the
// portfolio handler.
etfsRouter.get("/:ticker", (req, res) => {
  const def = findEtf(req.params.ticker);
  if (!def) throw new ApiError(404, "ETF not found");
  res.json(serializeEtf(def));
});

// Deliberately not implemented in this mock (see docs/PRODUCT_PLAN.md and
// the ETF feature spec) — all require either a live brokerage/market-data
// integration or product/compliance decisions beyond this API surface:
// limit orders, recurring/scheduled investments, subscription-plan gating,
// KYC/AML/tax-residency enforcement, AI rebalancing recommendations,
// dividend/corporate-action processing, and historical price charts.
