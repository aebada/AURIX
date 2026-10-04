import { Router } from "express";
import { getPriceProvider, mockPriceProvider } from "../../providers/price/index.js";

export const marketDataRouter = Router();

marketDataRouter.get("/prices", async (req, res, next) => {
  try {
    const ccy = String(req.query.currency ?? "USD").toUpperCase() === "EUR" ? "EUR" : "USD";
    const provider = getPriceProvider();
    let quotes;
    let used = provider.id;
    try {
      quotes = await provider.getQuotes(ccy);
    } catch {
      quotes = await mockPriceProvider.getQuotes(ccy);
      used = mockPriceProvider.id;
    }
    const gold = quotes.find((q) => q.metal === "gold");
    const silver = quotes.find((q) => q.metal === "silver");
    res.json({
      asOf: gold?.asOf ?? new Date().toISOString(),
      liveCustody: false,
      kind: gold?.kind ?? "practice_indicative",
      source: used,
      reference: "LBMA",
      quoteCurrency: ccy,
      prices: {
        goldUsdPerOunce: gold?.pricePerOunce ?? null,
        silverUsdPerOunce: silver?.pricePerOunce ?? null,
        goldUsdPerGram: gold?.pricePerGram ?? null,
        silverUsdPerGram: silver?.pricePerGram ?? null,
      },
      quotes,
    });
  } catch (err) {
    next(err);
  }
});
