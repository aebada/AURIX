"use client";

import { useEffect, useMemo, useState } from "react";
import type { Currency } from "./currencies";

// Illustrative only — jittered client-side, not a real market data feed.
// Mirrors the same "simulate a live feed without an external dependency"
// approach as services/backend's mock market-data endpoint.
//
// Metals stays a complete, honest list of real traded metals/commodities —
// there are only a few dozen of those in the world, so padding to 1000
// would mean inventing fictional ones. Crypto and Stocks each have
// thousands of real listings, so those two are padded with clearly
// synthetic placeholder entries (e.g. "Coin #0483") up to ~1000, on top of
// the real, recognizable names.
export interface MarketInstrument {
  symbol: string;
  name: string;
  category: "Metal" | "Crypto" | "Stock" | "ETF";
  price: number;
  changePct: number;
}

const REAL_METALS: MarketInstrument[] = [
  { symbol: "XAU", name: "Gold", category: "Metal", price: 3387.4, changePct: 0.8 },
  { symbol: "XAG", name: "Silver", category: "Metal", price: 40.85, changePct: 1.4 },
  { symbol: "XPT", name: "Platinum", category: "Metal", price: 1428.2, changePct: -0.3 },
  { symbol: "XPD", name: "Palladium", category: "Metal", price: 1102.6, changePct: -1.1 },
  { symbol: "HG", name: "Copper", category: "Metal", price: 4.52, changePct: 0.6 },
  { symbol: "ALU", name: "Aluminum", category: "Metal", price: 2.48, changePct: 0.2 },
  { symbol: "NI", name: "Nickel", category: "Metal", price: 7.15, changePct: -0.5 },
  { symbol: "ZNC", name: "Zinc", category: "Metal", price: 2.89, changePct: 1.0 },
  { symbol: "SN", name: "Tin", category: "Metal", price: 15.42, changePct: 0.4 },
  { symbol: "PB", name: "Lead", category: "Metal", price: 0.98, changePct: -0.2 },
  { symbol: "URA", name: "Uranium", category: "Metal", price: 78.3, changePct: 2.3 },
  { symbol: "CO", name: "Cobalt", category: "Metal", price: 14.6, changePct: -0.8 },
  { symbol: "LI", name: "Lithium", category: "Metal", price: 9.85, changePct: -1.5 },
  { symbol: "RH", name: "Rhodium", category: "Metal", price: 5450, changePct: 3.1 },
  { symbol: "IR", name: "Iridium", category: "Metal", price: 4650, changePct: 0.7 },
  { symbol: "HRC", name: "Steel (HRC)", category: "Metal", price: 780, changePct: -0.4 },
  { symbol: "TIO", name: "Iron Ore", category: "Metal", price: 102.5, changePct: 0.3 },
];

const REAL_CRYPTO: MarketInstrument[] = [
  { symbol: "BTC", name: "Bitcoin", category: "Crypto", price: 118450, changePct: -1.2 },
  { symbol: "ETH", name: "Ethereum", category: "Crypto", price: 4210, changePct: 2.1 },
  { symbol: "BNB", name: "BNB", category: "Crypto", price: 712.4, changePct: 0.5 },
  { symbol: "SOL", name: "Solana", category: "Crypto", price: 198.4, changePct: 3.4 },
  { symbol: "XRP", name: "XRP", category: "Crypto", price: 2.87, changePct: -0.6 },
  { symbol: "ADA", name: "Cardano", category: "Crypto", price: 0.94, changePct: 1.8 },
  { symbol: "DOGE", name: "Dogecoin", category: "Crypto", price: 0.31, changePct: -2.4 },
  { symbol: "DOT", name: "Polkadot", category: "Crypto", price: 6.42, changePct: 0.9 },
  { symbol: "AVAX", name: "Avalanche", category: "Crypto", price: 38.6, changePct: 2.7 },
  { symbol: "LINK", name: "Chainlink", category: "Crypto", price: 22.1, changePct: -1.0 },
  { symbol: "LTC", name: "Litecoin", category: "Crypto", price: 108.5, changePct: 0.3 },
  { symbol: "MATIC", name: "Polygon", category: "Crypto", price: 0.58, changePct: 1.2 },
  { symbol: "TRX", name: "Tron", category: "Crypto", price: 0.27, changePct: 0.1 },
  { symbol: "SHIB", name: "Shiba Inu", category: "Crypto", price: 0.0000212, changePct: -3.1 },
  { symbol: "UNI", name: "Uniswap", category: "Crypto", price: 11.4, changePct: 1.6 },
  { symbol: "XLM", name: "Stellar", category: "Crypto", price: 0.41, changePct: 0.6 },
  { symbol: "XMR", name: "Monero", category: "Crypto", price: 178.3, changePct: -0.4 },
  { symbol: "ATOM", name: "Cosmos", category: "Crypto", price: 7.85, changePct: 0.8 },
  { symbol: "ALGO", name: "Algorand", category: "Crypto", price: 0.22, changePct: -1.3 },
  { symbol: "VET", name: "VeChain", category: "Crypto", price: 0.045, changePct: 1.1 },
  { symbol: "FIL", name: "Filecoin", category: "Crypto", price: 5.2, changePct: -0.9 },
  { symbol: "APT", name: "Aptos", category: "Crypto", price: 9.6, changePct: 2.0 },
  { symbol: "ARB", name: "Arbitrum", category: "Crypto", price: 0.82, changePct: 1.4 },
  { symbol: "OP", name: "Optimism", category: "Crypto", price: 1.68, changePct: 0.7 },
  { symbol: "TON", name: "Toncoin", category: "Crypto", price: 5.9, changePct: -0.2 },
  { symbol: "NEAR", name: "NEAR Protocol", category: "Crypto", price: 4.15, changePct: 1.9 },
];

const REAL_STOCKS: MarketInstrument[] = [
  { symbol: "SPX", name: "S&P 500", category: "Stock", price: 6390, changePct: 0.3 },
  { symbol: "NDX", name: "Nasdaq 100", category: "Stock", price: 22140, changePct: 0.5 },
  { symbol: "AAPL", name: "Apple", category: "Stock", price: 231.5, changePct: -0.4 },
  { symbol: "MSFT", name: "Microsoft", category: "Stock", price: 468.2, changePct: 0.7 },
  { symbol: "GOOGL", name: "Alphabet", category: "Stock", price: 192.3, changePct: 0.4 },
  { symbol: "AMZN", name: "Amazon", category: "Stock", price: 224.6, changePct: 1.0 },
  { symbol: "META", name: "Meta Platforms", category: "Stock", price: 612.8, changePct: -0.6 },
  { symbol: "NVDA", name: "Nvidia", category: "Stock", price: 138.4, changePct: 2.3 },
  { symbol: "TSLA", name: "Tesla", category: "Stock", price: 312.8, changePct: -2.1 },
  { symbol: "BRK.B", name: "Berkshire Hathaway", category: "Stock", price: 468.9, changePct: 0.2 },
  { symbol: "JPM", name: "JPMorgan Chase", category: "Stock", price: 246.1, changePct: 0.5 },
  { symbol: "V", name: "Visa", category: "Stock", price: 318.4, changePct: 0.3 },
  { symbol: "MA", name: "Mastercard", category: "Stock", price: 524.7, changePct: 0.4 },
  { symbol: "WMT", name: "Walmart", category: "Stock", price: 96.2, changePct: 0.6 },
  { symbol: "XOM", name: "ExxonMobil", category: "Stock", price: 118.5, changePct: -0.3 },
  { symbol: "UNH", name: "UnitedHealth", category: "Stock", price: 512.3, changePct: -1.2 },
  { symbol: "JNJ", name: "Johnson & Johnson", category: "Stock", price: 162.4, changePct: 0.1 },
  { symbol: "PG", name: "Procter & Gamble", category: "Stock", price: 168.9, changePct: 0.2 },
  { symbol: "HD", name: "Home Depot", category: "Stock", price: 402.6, changePct: 0.5 },
  { symbol: "KO", name: "Coca-Cola", category: "Stock", price: 71.8, changePct: 0.1 },
  { symbol: "DIS", name: "Disney", category: "Stock", price: 112.4, changePct: -0.5 },
  { symbol: "NFLX", name: "Netflix", category: "Stock", price: 892.1, changePct: 1.3 },
  { symbol: "ADBE", name: "Adobe", category: "Stock", price: 512.6, changePct: -0.7 },
  { symbol: "CRM", name: "Salesforce", category: "Stock", price: 328.4, changePct: 0.6 },
  { symbol: "INTC", name: "Intel", category: "Stock", price: 32.1, changePct: -1.8 },
  { symbol: "AMD", name: "AMD", category: "Stock", price: 168.3, changePct: 2.1 },
  { symbol: "AVGO", name: "Broadcom", category: "Stock", price: 218.6, changePct: 1.0 },
  { symbol: "ORCL", name: "Oracle", category: "Stock", price: 178.2, changePct: 0.4 },
  { symbol: "IBM", name: "IBM", category: "Stock", price: 236.5, changePct: 0.2 },
  { symbol: "CVX", name: "Chevron", category: "Stock", price: 156.8, changePct: -0.4 },
  { symbol: "PEP", name: "PepsiCo", category: "Stock", price: 148.3, changePct: 0.1 },
  { symbol: "MCD", name: "McDonald's", category: "Stock", price: 296.4, changePct: 0.3 },
  { symbol: "NKE", name: "Nike", category: "Stock", price: 78.9, changePct: -0.9 },
  { symbol: "BA", name: "Boeing", category: "Stock", price: 178.6, changePct: -1.1 },
];

const REAL_ETFS: MarketInstrument[] = [
  { symbol: "URTH", name: "MSCI World ETF", category: "ETF", price: 168.42, changePct: 0.4 },
  { symbol: "VWRL", name: "FTSE All-World UCITS ETF", category: "ETF", price: 129.87, changePct: 0.3 },
  { symbol: "VOO", name: "S&P 500 ETF", category: "ETF", price: 512.3, changePct: 0.5 },
  { symbol: "QQQ", name: "Nasdaq-100 ETF", category: "ETF", price: 478.6, changePct: 0.8 },
  { symbol: "EXW1", name: "Euro Stoxx 50 ETF", category: "ETF", price: 55.14, changePct: -0.2 },
  { symbol: "IEMG", name: "Core MSCI Emerging Markets ETF", category: "ETF", price: 54.21, changePct: -0.4 },
  { symbol: "AGGG", name: "Global Aggregate Bond ETF", category: "ETF", price: 5.32, changePct: 0.1 },
  { symbol: "IEF", name: "7-10 Year Treasury Bond ETF", category: "ETF", price: 94.15, changePct: 0.1 },
  { symbol: "LQD", name: "Investment Grade Corporate Bond ETF", category: "ETF", price: 108.7, changePct: 0.2 },
  { symbol: "VYM", name: "High Dividend Yield ETF", category: "ETF", price: 132.9, changePct: 0.3 },
  { symbol: "NOBL", name: "Dividend Aristocrats ETF", category: "ETF", price: 101.4, changePct: 0.2 },
  { symbol: "ESGU", name: "ESG Aware MSCI USA ETF", category: "ETF", price: 112.6, changePct: 0.5 },
  { symbol: "ICLN", name: "Global Clean Energy ETF", category: "ETF", price: 13.8, changePct: -1.2 },
  { symbol: "BOTZ", name: "Robotics & Artificial Intelligence ETF", category: "ETF", price: 32.5, changePct: 1.4 },
  { symbol: "CIBR", name: "Cybersecurity ETF", category: "ETF", price: 58.9, changePct: 0.9 },
  { symbol: "XLV", name: "Health Care Select Sector ETF", category: "ETF", price: 145.2, changePct: 0.2 },
  { symbol: "SOXX", name: "Semiconductor ETF", category: "ETF", price: 236.4, changePct: 1.8 },
  { symbol: "SKYY", name: "Cloud Computing ETF", category: "ETF", price: 87.3, changePct: 1.1 },
  { symbol: "ARKX", name: "Space Exploration & Innovation ETF", category: "ETF", price: 14.6, changePct: -0.6 },
  { symbol: "GLD", name: "Gold Trust ETF", category: "ETF", price: 241.8, changePct: 0.7 },
  { symbol: "SLV", name: "Silver Trust ETF", category: "ETF", price: 27.3, changePct: 1.2 },
  { symbol: "DBA", name: "Agriculture Fund ETF", category: "ETF", price: 21.9, changePct: 0.1 },
  { symbol: "HLAL", name: "Wahed FTSE USA Sharia ETF", category: "ETF", price: 42.7, changePct: 0.6 },
  { symbol: "SPSK", name: "Sukuk ETF", category: "ETF", price: 21.4, changePct: 0.1 },
];

// A simple deterministic pseudo-random generator so synthetic entries and
// jitter ticks are stable/reproducible from an integer seed rather than
// truly random (avoids hydration mismatches and gives consistent demos).
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Longer lookback windows than 24h aren't backed by any real historical
// series (there is no live feed underneath this page) — each is derived
// deterministically from the instrument's authored 24h change plus a
// per-symbol/timeframe seeded wobble, with amplitude growing ~sqrt(days)
// the way a random walk's would. Illustrative only, like the rest of this
// page's pricing.
export type ChangeTimeframe =
  | "24h"
  | "7d"
  | "1m"
  | "3m"
  | "6m"
  | "ytd"
  | "1y"
  | "2y"
  | "3y"
  | "5y";

// Full wording for the dropdown the user picks from.
export const TIMEFRAME_OPTION_LABELS: Record<ChangeTimeframe, string> = {
  "24h": "24 Hours",
  "7d": "7 Days",
  "1m": "1 Month",
  "3m": "3 Months",
  "6m": "6 Months",
  ytd: "Year to Date",
  "1y": "1 Year",
  "2y": "2 Years",
  "3y": "3 Years",
  "5y": "5 Years",
};

// Compact form for the table's column header, where space is tight.
export const TIMEFRAME_COLUMN_LABELS: Record<ChangeTimeframe, string> = {
  "24h": "24H",
  "7d": "7D",
  "1m": "1M",
  "3m": "3M",
  "6m": "6M",
  ytd: "YTD",
  "1y": "1Y",
  "2y": "2Y",
  "3y": "3Y",
  "5y": "5Y",
};

const TIMEFRAME_DAYS: Record<ChangeTimeframe, number> = {
  "24h": 1,
  "7d": 7,
  "1m": 30,
  "3m": 90,
  "6m": 182,
  ytd: 213, // ~days elapsed between Jan 1 and Aug 1
  "1y": 365,
  "2y": 730,
  "3y": 1095,
  "5y": 1825,
};

export function changeForTimeframe(
  instrument: Pick<MarketInstrument, "symbol" | "changePct">,
  timeframe: ChangeTimeframe,
): number {
  if (timeframe === "24h") return instrument.changePct;

  const days = TIMEFRAME_DAYS[timeframe];
  const seed = hashString(`${instrument.symbol}:${timeframe}`);
  const drift = instrument.changePct * Math.sqrt(days) * 0.3;
  const wobble = (seededRandom(seed) - 0.5) * 2 * Math.sqrt(days) * 1.2;
  return Number((drift + wobble).toFixed(2));
}

// A quantitative momentum read derived from the same illustrative price
// series as the rest of this page — NOT financial advice, and deliberately
// not phrased as one ("buy"/"sell"). Weights recent (1M) trend more heavily
// than the 1Y trend, the way a simple momentum indicator would.
export type MomentumSignal = "bullish" | "neutral" | "bearish";

export function momentumSignal(
  instrument: Pick<MarketInstrument, "symbol" | "changePct">,
): MomentumSignal {
  const shortTerm = changeForTimeframe(instrument, "1m");
  const longTerm = changeForTimeframe(instrument, "1y");
  const score = shortTerm * 0.7 + longTerm * 0.1;
  if (score > 3) return "bullish";
  if (score < -3) return "bearish";
  return "neutral";
}

export const MOMENTUM_LABELS: Record<MomentumSignal, string> = {
  bullish: "Bullish",
  neutral: "Neutral",
  bearish: "Bearish",
};

const SYNTHETIC_NAME_WORD: Record<"Crypto" | "Stock" | "ETF", string> = {
  Crypto: "Coin",
  Stock: "Company",
  ETF: "Fund",
};

function generateSynthetic(
  category: "Crypto" | "Stock" | "ETF",
  count: number,
  startIndex: number,
  priceRange: [number, number],
  prefix: string,
): MarketInstrument[] {
  const out: MarketInstrument[] = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const r1 = seededRandom(idx * 2 + 1);
    const r2 = seededRandom(idx * 2 + 2);
    const price = priceRange[0] + r1 * (priceRange[1] - priceRange[0]);
    const changePct = (r2 - 0.5) * 8;
    const label = String(idx).padStart(4, "0");
    out.push({
      symbol: `${prefix}${label}`,
      name: `${SYNTHETIC_NAME_WORD[category]} #${label}`,
      category,
      price,
      changePct,
    });
  }
  return out;
}

export const METALS: MarketInstrument[] = REAL_METALS;
export const CRYPTO: MarketInstrument[] = [
  ...REAL_CRYPTO,
  ...generateSynthetic("Crypto", 1000 - REAL_CRYPTO.length, REAL_CRYPTO.length, [0.001, 500], "CRY"),
];
export const STOCKS: MarketInstrument[] = [
  ...REAL_STOCKS,
  ...generateSynthetic("Stock", 1000 - REAL_STOCKS.length, REAL_STOCKS.length, [1, 800], "STK"),
];
export const ETFS: MarketInstrument[] = [
  ...REAL_ETFS,
  ...generateSynthetic("ETF", 1000 - REAL_ETFS.length, REAL_ETFS.length, [5, 550], "ETF"),
];

export const MARKET_SEED: MarketInstrument[] = [...METALS, ...CRYPTO, ...STOCKS, ...ETFS];

export interface LiveInstrument extends MarketInstrument {
  direction: "up" | "down" | null;
}

// Derives jittered prices fresh from each instrument's base price on every
// tick (rather than compounding drift in state), so swapping in a new
// `seed` slice — e.g. changing pages — just works on the next render with
// no manual reset/sync logic needed.
export function useLivePrices(seed: MarketInstrument[], intervalMs = 2500): LiveInstrument[] {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return useMemo(
    () =>
      seed.map((t, i) => {
        if (tick === 0) return { ...t, direction: null };
        const factor = 1 + (seededRandom(tick * 97 + i * 31) - 0.5) * 0.003;
        return { ...t, price: t.price * factor, direction: factor >= 1 ? "up" : "down" };
      }),
    [seed, tick],
  );
}

// All base prices above are in USD. Pass the selected currency (see
// src/lib/currency-context.tsx) to convert and format using that
// currency's real formatting conventions via Intl.
export function formatPrice(value: number, currency: Currency): string {
  const converted = value * currency.rateFromUsd;
  const opts: Intl.NumberFormatOptions = { style: "currency", currency: currency.code };

  if (Math.abs(converted) < 1) {
    opts.minimumFractionDigits = 2;
    opts.maximumFractionDigits = 6;
  } else if (Math.abs(converted) >= 1000) {
    opts.maximumFractionDigits = 0;
  }

  try {
    return converted.toLocaleString(undefined, opts);
  } catch {
    return `${currency.code} ${converted.toFixed(2)}`;
  }
}
