"use client";

import { useEffect, useState } from "react";

type WalletId = "personal" | "business" | "kids";

type WalletView = {
  id: WalletId;
  label: string;
  balance: string;
  change: string;
  tag: string;
  pockets: { mark: string; name: string; amount: string; delta: string }[];
  chart: number[];
};

const WALLETS: WalletView[] = [
  {
    id: "personal",
    label: "Personal",
    balance: "$12,480.32",
    change: "+2.4% today",
    tag: "B2C",
    pockets: [
      { mark: "Au", name: "Gold", amount: "8,214 BPC", delta: "+1.2%" },
      { mark: "Ag", name: "Silver", amount: "3,050 BPC", delta: "+0.4%" },
      { mark: "€", name: "EUR", amount: "€1,205.10", delta: "0.0%" },
    ],
    chart: [42, 48, 45, 52, 58, 55, 62, 68, 64, 72, 78, 74],
  },
  {
    id: "business",
    label: "Business",
    balance: "$84,920.00",
    change: "Treasury · 4 seats",
    tag: "B2B",
    pockets: [
      { mark: "Au", name: "Reserve", amount: "42,000 BPC", delta: "+0.8%" },
      { mark: "$", name: "USD ops", amount: "$28,400", delta: "—" },
      { mark: "€", name: "Payroll", amount: "€12,800", delta: "—" },
    ],
    chart: [55, 52, 58, 60, 57, 64, 70, 68, 74, 80, 76, 84],
  },
  {
    id: "kids",
    label: "Kids",
    balance: "$240.50",
    change: "Parent limits on",
    tag: "Family",
    pockets: [
      { mark: "Au", name: "Gold save", amount: "120 BPC", delta: "+0.3%" },
      { mark: "€", name: "Spend", amount: "€95.00", delta: "—" },
      { mark: "★", name: "Vouchers", amount: "2 active", delta: "—" },
    ],
    chart: [20, 22, 21, 28, 30, 34, 32, 38, 40, 44, 42, 48],
  },
];

const ACTIONS = [
  { label: "Send", icon: "↑" },
  { label: "Pay", icon: "⇢" },
  { label: "Buy", icon: "+" },
  { label: "Swap", icon: "⇄" },
];

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 220;
  const h = 56;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="hero-spark h-14 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="aurixSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-light)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-gold-light)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#aurixSparkFill)" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-gold-light)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroShowcase() {
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setPulse(true);
      setActive((i) => (i + 1) % WALLETS.length);
      window.setTimeout(() => setPulse(false), 400);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  const wallet = WALLETS[active]!;

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div
        className="pointer-events-none absolute -inset-10 rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, var(--glow-gold), transparent 55%)",
        }}
        aria-hidden
      />

      {/* Floating metal card — Revolut-style depth */}
      <div
        className="hero-float-card absolute -left-3 top-16 z-20 hidden w-[148px] rounded-2xl border border-white/15 bg-navy-soft/95 p-3 shadow-xl backdrop-blur sm:block"
        aria-hidden
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-[11px] font-bold text-navy">
            Au
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              Gold
            </p>
            <p className="text-sm font-extrabold text-white">+1.2%</p>
          </div>
        </div>
        <div className="mt-2 h-8 overflow-hidden">
          <Sparkline values={[30, 34, 32, 40, 44, 42, 50, 56, 52, 60]} />
        </div>
      </div>

      <div
        className="hero-float-card-delayed absolute -right-2 bottom-28 z-20 hidden w-[138px] rounded-2xl border border-white/15 bg-[var(--color-paper)] p-3 shadow-xl sm:block"
        aria-hidden
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          Send gold
        </p>
        <p className="mt-1 text-sm font-extrabold text-heading">5 g → EG</p>
        <p className="mt-1 text-[11px] font-semibold text-emerald-600">
          Ready for pickup
        </p>
      </div>

      <div className="relative z-10 overflow-hidden rounded-[2rem] border border-white/10 bg-navy shadow-2xl shadow-navy/40">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
              Practice mode
            </span>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-gold-light">
            {wallet.tag}
          </span>
        </div>

        <div className="flex gap-1 bg-navy-soft/80 p-2">
          {WALLETS.map((w, i) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActive(i)}
              className={`flex-1 rounded-xl px-2 py-2 text-[11px] font-bold transition-all duration-300 ${
                i === active
                  ? "bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-navy shadow-md"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        <div
          className={`px-5 pb-6 pt-5 text-white transition-opacity duration-300 ${
            pulse ? "opacity-70" : "opacity-100"
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
            Multi-wallet · {wallet.label}
          </p>
          <p className="mt-2 font-extrabold tracking-tight text-3xl sm:text-4xl">
            {wallet.balance}
          </p>
          <p className="mt-1 text-xs font-semibold text-emerald-400">
            {wallet.change}
          </p>

          <div className="mt-4 rounded-2xl bg-white/[0.04] px-2 pt-2">
            <Sparkline values={wallet.chart} />
          </div>

          <div className="mt-4 space-y-2">
            {wallet.pockets.map((p, i) => (
              <div
                key={p.name}
                className="hero-pocket flex items-center justify-between rounded-2xl bg-white/[0.06] px-3.5 py-3"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-[11px] font-bold text-navy">
                    {p.mark}
                  </span>
                  <div>
                    <span className="block text-sm font-semibold">{p.name}</span>
                    <span className="text-[10px] font-semibold text-emerald-400/90">
                      {p.delta}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold tabular-nums text-white/90">
                  {p.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.label}
                type="button"
                className="group rounded-2xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] py-2.5 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="block text-sm font-bold text-navy">{a.icon}</span>
                <span className="mt-0.5 block text-[10px] font-bold text-navy/80">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
        {WALLETS.map((w, i) => (
          <span
            key={w.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-5 bg-gold" : "w-1.5 bg-navy/25 dark:bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
