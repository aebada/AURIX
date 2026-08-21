"use client";

import { useMemo, useState } from "react";
import {
  formatPrice,
  momentumSignal,
  useLivePrices,
  type MarketInstrument,
} from "@/lib/live-market-data";
import {
  generateHistory,
  generateNewsEvents,
  generateForecast,
  findSimilarPeriods,
  NEWS_CATEGORIES,
  NEWS_CATEGORY_LABELS,
  type NewsCategory,
  type Sentiment,
} from "@/lib/instrument-history";
import { useCurrency } from "@/lib/currency-context";
import { SignalBadge } from "./SignalBadge";
import { CandlestickChart } from "./CandlestickChart";

const SENTIMENT_TEXT: Record<Sentiment, string> = {
  bullish: "text-emerald-600",
  bearish: "text-red-500",
  neutral: "text-muted",
};

export function InstrumentDetailModal({
  instrument,
  onClose,
}: {
  instrument: MarketInstrument;
  onClose: () => void;
}) {
  const { currency } = useCurrency();
  const [live] = useLivePrices([instrument]);
  const [categoryFilter, setCategoryFilter] = useState<NewsCategory | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const bars = useMemo(() => generateHistory(instrument), [instrument]);
  const events = useMemo(() => generateNewsEvents(instrument, bars), [instrument, bars]);
  const forecasts = useMemo(() => generateForecast(instrument), [instrument]);
  const similarPeriods = useMemo(() => findSimilarPeriods(bars), [bars]);
  const signal = momentumSignal(instrument);

  const filteredEvents = categoryFilter ? events.filter((e) => e.category === categoryFilter) : events;
  const selectedEvents = selectedDate ? events.filter((e) => e.date === selectedDate) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10">
      <button type="button" aria-hidden tabIndex={-1} onClick={onClose} className="fixed inset-0 -z-10" />
      <div className="w-full max-w-4xl rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              {instrument.category} · {instrument.symbol}
            </p>
            <h2 className="mt-1 font-extrabold tracking-tight text-2xl text-heading">{instrument.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="font-mono text-lg font-semibold text-heading">
                {formatPrice(live?.price ?? instrument.price, currency)}
              </span>
              <SignalBadge signal={signal} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-muted hover:text-heading"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
          <CandlestickChart bars={bars} events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <p className="mt-2 text-xs text-muted">
          Illustrative 120-day price history — simulated client-side, not a real feed. Dots mark
          simulated news events; click one to see it below.
        </p>

        {selectedEvents.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{selectedDate}</p>
            {selectedEvents.map((e, i) => (
              <p key={i} className={`mt-1 text-sm font-medium ${SENTIMENT_TEXT[e.sentiment]}`}>
                {NEWS_CATEGORY_LABELS[e.category]}: {e.headline}
              </p>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-heading">Simulated news events</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCategoryFilter(null)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  categoryFilter === null ? "bg-navy text-white" : "bg-[var(--color-paper)] text-muted"
                }`}
              >
                All
              </button>
              {NEWS_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoryFilter(c)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    categoryFilter === c ? "bg-navy text-white" : "bg-[var(--color-paper)] text-muted"
                  }`}
                >
                  {NEWS_CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
              {filteredEvents.length === 0 ? (
                <p className="py-4 text-sm text-muted">No events in this category.</p>
              ) : (
                [...filteredEvents].reverse().map((e, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedDate(e.date)}
                    className={`block w-full rounded-xl border px-3 py-2 text-left text-xs transition-colors ${
                      selectedDate === e.date
                        ? "border-navy bg-[var(--color-paper)]"
                        : "border-[var(--color-line)] hover:bg-[var(--color-paper)]"
                    }`}
                  >
                    <span className="font-semibold text-muted">{e.date}</span>{" "}
                    <span className={SENTIMENT_TEXT[e.sentiment]}>{e.headline}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-heading">Illustrative forecast</p>
              <p className="mt-1 text-xs text-muted">
                Derived from this instrument&apos;s own simulated price trend — not a trained model,
                not financial advice.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {forecasts.map((f) => (
                  <div key={f.horizon} className="rounded-xl border border-[var(--color-line)] p-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">{f.horizon}</p>
                    <div className="mt-2 flex justify-center">
                      <SignalBadge signal={f.direction} />
                    </div>
                    <p className="mt-2 text-xs text-muted">{f.confidencePct}% confidence</p>
                  </div>
                ))}
              </div>
            </div>

            {similarPeriods.length > 0 && (
              <div>
                <p className="text-sm font-bold text-heading">Similar historical periods</p>
                <p className="mt-1 text-xs text-muted">
                  Windows from this same simulated series with a comparable recent trend, and what
                  followed over the next 5 days.
                </p>
                <div className="mt-3 space-y-2">
                  {similarPeriods.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-[var(--color-line)] px-3 py-2 text-xs"
                    >
                      <span className="text-muted">{p.date}</span>
                      <span className="text-muted">
                        5d prior: <span className={p.priorReturnPct >= 0 ? "text-emerald-600" : "text-red-500"}>{p.priorReturnPct >= 0 ? "+" : ""}{p.priorReturnPct}%</span>
                      </span>
                      <span className="font-semibold">
                        next 5d: <span className={p.nextReturnPct >= 0 ? "text-emerald-600" : "text-red-500"}>{p.nextReturnPct >= 0 ? "+" : ""}{p.nextReturnPct}%</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
