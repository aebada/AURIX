import { Router } from "express";

export const marketDataRouter = Router();

// Mock market data: real implementation aggregates LBMA / metal price
// APIs, FX APIs, and crypto/stock exchange feeds (see
// docs/PRODUCT_PLAN.md 4.5 and 5). Prices below jitter slightly per
// request to simulate a live feed without any external dependency.
const basePrices = {
  GOLD_USD_PER_GRAM: 87.42,
  SILVER_USD_PER_GRAM: 1.03,
  BTC_USD: 68_450,
  EUR_USD: 1.08,
};

function jitter(value: number, pct = 0.002) {
  const delta = value * pct * (Math.random() * 2 - 1);
  return Number((value + delta).toFixed(4));
}

marketDataRouter.get("/prices", (_req, res) => {
  res.json({
    asOf: new Date().toISOString(),
    prices: {
      goldUsdPerGram: jitter(basePrices.GOLD_USD_PER_GRAM),
      silverUsdPerGram: jitter(basePrices.SILVER_USD_PER_GRAM),
      btcUsd: jitter(basePrices.BTC_USD),
      eurUsd: jitter(basePrices.EUR_USD, 0.0005),
    },
  });
});
