// Illustrative daily history, "news" events, forecasts, and similar-period
// matching for a single instrument's detail view — same "simulate a feed
// without an external dependency" approach as the rest of live-market-data.ts,
// extended with a candlestick-chart-and-storytelling UI inspired by
// github.com/owengetinfo-design/PokieTicker. There is no real news feed or
// ML model behind this: every event headline is explicitly labeled
// "Simulated" so it can never be mistaken for a real report about a real
// company, even out of context (e.g. a cropped screenshot).

import type { MarketInstrument, ChangeTimeframe } from "./live-market-data";
import { changeForTimeframe, momentumSignal, type MomentumSignal } from "./live-market-data";

export interface OhlcBar {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
}

export type NewsCategory =
  | "market"
  | "earnings"
  | "product"
  | "policy"
  | "competition"
  | "management";

export type Sentiment = "bullish" | "bearish" | "neutral";

export interface NewsEvent {
  date: string;
  category: NewsCategory;
  sentiment: Sentiment;
  headline: string;
}

export interface Forecast {
  horizon: "T+1" | "T+3" | "T+5";
  direction: MomentumSignal;
  confidencePct: number;
}

export interface SimilarPeriod {
  date: string;
  priorReturnPct: number;
  nextReturnPct: number;
}

const HISTORY_DAYS = 120;

export const NEWS_CATEGORIES: NewsCategory[] = [
  "market",
  "earnings",
  "product",
  "policy",
  "competition",
  "management",
];

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  market: "Market",
  earnings: "Earnings",
  product: "Product",
  policy: "Policy",
  competition: "Competition",
  management: "Management",
};

const HEADLINE_TEMPLATES: Record<NewsCategory, Record<Sentiment, string>> = {
  market: {
    bullish: "Simulated event: broad market tailwind",
    bearish: "Simulated event: broad market headwind",
    neutral: "Simulated event: market-wide chatter",
  },
  earnings: {
    bullish: "Simulated event: earnings-cycle reaction (positive)",
    bearish: "Simulated event: earnings-cycle reaction (negative)",
    neutral: "Simulated event: earnings-cycle chatter",
  },
  product: {
    bullish: "Simulated event: product-cycle news (positive)",
    bearish: "Simulated event: product-cycle news (negative)",
    neutral: "Simulated event: product-cycle chatter",
  },
  policy: {
    bullish: "Simulated event: policy/regulatory news (positive)",
    bearish: "Simulated event: policy/regulatory news (negative)",
    neutral: "Simulated event: policy/regulatory chatter",
  },
  competition: {
    bullish: "Simulated event: competitive-landscape news (positive)",
    bearish: "Simulated event: competitive-landscape news (negative)",
    neutral: "Simulated event: competitive-landscape chatter",
  },
  management: {
    bullish: "Simulated event: leadership/management news (positive)",
    bearish: "Simulated event: leadership/management news (negative)",
    neutral: "Simulated event: leadership/management chatter",
  },
};

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

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Builds a daily OHLC series ending at the instrument's current (live)
// price, walking backward from a deterministic sequence of daily returns
// so the same symbol always produces the same chart within a session.
export function generateHistory(
  instrument: Pick<MarketInstrument, "symbol" | "price">,
  days: number = HISTORY_DAYS,
): OhlcBar[] {
  const seedBase = hashString(instrument.symbol);
  const dailyReturns: number[] = [];
  for (let i = 0; i < days; i++) {
    dailyReturns.push((seededRandom(seedBase + i * 7.13) - 0.5) * 0.04);
  }

  const closes = new Array<number>(days);
  closes[days - 1] = instrument.price;
  for (let i = days - 2; i >= 0; i--) {
    closes[i] = closes[i + 1] / (1 + dailyReturns[i + 1]);
  }

  const today = new Date();
  const bars: OhlcBar[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - 1 - i));
    const close = closes[i];
    const open = i === 0 ? close / (1 + dailyReturns[0]) : closes[i - 1];
    const bodyRange = Math.abs(close - open) || close * 0.002;
    const wickScale = 0.3 + seededRandom(seedBase + i * 13.1) * 0.9;
    const high = Math.max(open, close) + bodyRange * wickScale * seededRandom(seedBase + i * 17.3);
    const low = Math.min(open, close) - bodyRange * wickScale * seededRandom(seedBase + i * 19.7);
    bars.push({ date: isoDate(date), open, high, low: Math.max(low, 0), close });
  }
  return bars;
}

// Places a handful of category-tagged "news" markers across the history,
// with sentiment derived from that day's actual simulated move so the
// story stays internally consistent (an up day gets a bullish-leaning
// category, not a random one).
export function generateNewsEvents(
  instrument: Pick<MarketInstrument, "symbol">,
  bars: OhlcBar[],
  count: number = 16,
): NewsEvent[] {
  if (bars.length < 5) return [];
  const seedBase = hashString(`${instrument.symbol}:news`);
  const events: NewsEvent[] = [];
  const usedDates = new Set<string>();

  for (let i = 0; i < count; i++) {
    const jitter = (seededRandom(seedBase + i * 3.7) - 0.5) * (bars.length / count) * 0.8;
    const idx = Math.max(1, Math.min(bars.length - 1, Math.round(((i + 0.5) / count) * bars.length + jitter)));
    const bar = bars[idx];
    if (usedDates.has(bar.date)) continue;
    usedDates.add(bar.date);

    const dayReturn = (bar.close - bar.open) / bar.open;
    const sentiment: Sentiment = dayReturn > 0.006 ? "bullish" : dayReturn < -0.006 ? "bearish" : "neutral";
    const category =
      NEWS_CATEGORIES[Math.floor(seededRandom(seedBase + i * 5.3) * NEWS_CATEGORIES.length)];

    events.push({
      date: bar.date,
      category,
      sentiment,
      headline: HEADLINE_TEMPLATES[category][sentiment],
    });
  }

  return events.sort((a, b) => (a.date < b.date ? -1 : 1));
}

// Illustrative T+1/T+3/T+5 directional read, in the same spirit as
// momentumSignal — derived from the instrument's own price data, not a
// trained model, and not financial advice.
export function generateForecast(instrument: Pick<MarketInstrument, "symbol" | "changePct">): Forecast[] {
  const seedBase = hashString(`${instrument.symbol}:forecast`);
  const monthTrend = changeForTimeframe(instrument, "1m" as ChangeTimeframe);
  const baseline = momentumSignal(instrument);

  return (["T+1", "T+3", "T+5"] as const).map((horizon, i) => {
    const wobble = seededRandom(seedBase + i * 11.3);
    const score = monthTrend * 0.5 + (wobble - 0.5) * 6 + (baseline === "bullish" ? 1 : baseline === "bearish" ? -1 : 0);
    const direction: MomentumSignal = score > 2 ? "bullish" : score < -2 ? "bearish" : "neutral";
    const confidencePct = Math.round(Math.min(95, Math.max(50, 55 + Math.abs(score) * 3 + wobble * 8)));
    return { horizon, direction, confidencePct };
  });
}

// Finds a few historical windows in the same series whose trailing 5-day
// return most resembles the most recent 5-day return, then reports what
// happened over the following 5 days after each — a simple cosine/nearest-
// neighbor stand-in, computed entirely from the same simulated series.
export function findSimilarPeriods(bars: OhlcBar[], count: number = 3): SimilarPeriod[] {
  if (bars.length < 20) return [];

  const closes = bars.map((b) => b.close);
  const windowReturn = (endIdx: number) => (closes[endIdx] - closes[endIdx - 5]) / closes[endIdx - 5];
  const lastReturn = windowReturn(closes.length - 1);

  const candidates: { idx: number; score: number }[] = [];
  for (let i = 5; i < closes.length - 6; i++) {
    candidates.push({ idx: i, score: Math.abs(windowReturn(i) - lastReturn) });
  }
  candidates.sort((a, b) => a.score - b.score);

  return candidates.slice(0, count).map(({ idx }) => {
    const nextIdx = Math.min(closes.length - 1, idx + 5);
    return {
      date: bars[idx].date,
      priorReturnPct: Number((windowReturn(idx) * 100).toFixed(2)),
      nextReturnPct: Number((((closes[nextIdx] - closes[idx]) / closes[idx]) * 100).toFixed(2)),
    };
  });
}
