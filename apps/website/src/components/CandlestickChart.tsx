"use client";

import { useMemo, useState } from "react";
import type { OhlcBar, NewsEvent, Sentiment } from "@/lib/instrument-history";

const SENTIMENT_DOT: Record<Sentiment, string> = {
  bullish: "#10b981",
  bearish: "#ef4444",
  neutral: "#9ca3af",
};

export function CandlestickChart({
  bars,
  events,
  selectedDate,
  onSelectDate,
}: {
  bars: OhlcBar[];
  events: NewsEvent[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const width = 900;
  const height = 340;
  const padding = { top: 16, right: 12, bottom: 24, left: 56 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const { min, max } = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const b of bars) {
      lo = Math.min(lo, b.low);
      hi = Math.max(hi, b.high);
    }
    const pad = (hi - lo) * 0.08 || hi * 0.02 || 1;
    return { min: lo - pad, max: hi + pad };
  }, [bars]);

  const xFor = (i: number) => padding.left + (i + 0.5) * (plotWidth / bars.length);
  const yFor = (v: number) => padding.top + (1 - (v - min) / (max - min)) * plotHeight;
  const candleWidth = Math.max(1.5, Math.min(8, plotWidth / bars.length - 2));

  const eventsByDate = useMemo(() => {
    const map = new Map<string, NewsEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const yTicks = 4;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Illustrative price candlestick chart"
    >
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = min + (i / yTicks) * (max - min);
        const y = yFor(v);
        return (
          <g key={i}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="var(--color-line)" strokeWidth={1} />
            <text x={padding.left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-muted" fontSize={10}>
              {v >= 1000 ? v.toFixed(0) : v.toFixed(2)}
            </text>
          </g>
        );
      })}

      {bars.map((bar, i) => {
        const up = bar.close >= bar.open;
        const x = xFor(i);
        const dayEvents = eventsByDate.get(bar.date);
        const isSelected = selectedDate === bar.date;
        return (
          <g
            key={bar.date}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx((v) => (v === i ? null : v))}
            onClick={() => dayEvents && onSelectDate(bar.date)}
            style={{ cursor: dayEvents ? "pointer" : "default" }}
          >
            <line x1={x} x2={x} y1={yFor(bar.high)} y2={yFor(bar.low)} stroke={up ? "#10b981" : "#ef4444"} strokeWidth={1} />
            <rect
              x={x - candleWidth / 2}
              y={yFor(Math.max(bar.open, bar.close))}
              width={candleWidth}
              height={Math.max(1, Math.abs(yFor(bar.open) - yFor(bar.close)))}
              fill={up ? "#10b981" : "#ef4444"}
              opacity={hoverIdx === i ? 1 : 0.9}
            />
            {dayEvents && (
              <circle
                cx={x}
                cy={height - padding.bottom + 12}
                r={isSelected ? 5 : 3.5}
                fill={SENTIMENT_DOT[dayEvents[0].sentiment]}
                stroke={isSelected ? "var(--color-heading)" : "none"}
                strokeWidth={1.5}
              />
            )}
          </g>
        );
      })}

      {hoverIdx !== null && (
        <text x={padding.left} y={12} className="fill-heading" fontSize={11} fontWeight={600}>
          {bars[hoverIdx].date} · O {bars[hoverIdx].open.toFixed(2)} H {bars[hoverIdx].high.toFixed(2)} L{" "}
          {bars[hoverIdx].low.toFixed(2)} C {bars[hoverIdx].close.toFixed(2)}
        </text>
      )}
    </svg>
  );
}
