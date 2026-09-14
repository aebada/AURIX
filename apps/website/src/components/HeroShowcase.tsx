"use client";

import { useEffect, useState } from "react";

type WalletId = "personal" | "business" | "kids";

type WalletView = {
  id: WalletId;
  label: string;
  balance: string;
  change: string;
  pockets: { mark: string; name: string; amount: string }[];
};

const WALLETS: WalletView[] = [
  {
    id: "personal",
    label: "Personal",
    balance: "$12,480.32",
    change: "+2.4% today",
    pockets: [
      { mark: "Au", name: "Gold", amount: "8,214 BPC" },
      { mark: "Ag", name: "Silver", amount: "3,050 BPC" },
      { mark: "€", name: "EUR", amount: "€1,205.10" },
    ],
  },
  {
    id: "business",
    label: "Business",
    balance: "$84,920.00",
    change: "Treasury · 4 team seats",
    pockets: [
      { mark: "Au", name: "Reserve", amount: "42,000 BPC" },
      { mark: "$", name: "USD ops", amount: "$28,400" },
      { mark: "€", name: "EUR payroll", amount: "€12,800" },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    balance: "$240.50",
    change: "Parent limits on",
    pockets: [
      { mark: "Au", name: "Gold save", amount: "120 BPC" },
      { mark: "€", name: "Spend", amount: "€95.00" },
      { mark: "🎁", name: "Vouchers", amount: "2 active" },
    ],
  },
];

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
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  const wallet = WALLETS[active]!;

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div
        className="pointer-events-none absolute -inset-8 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, var(--glow-gold), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-navy shadow-2xl shadow-navy/40">
        <div className="flex gap-1 border-b border-white/10 bg-navy-soft/80 p-2">
          {WALLETS.map((w, i) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActive(i)}
              className={`flex-1 rounded-xl px-2 py-2 text-[11px] font-bold transition-colors ${
                i === active
                  ? "bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-navy"
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

          <div className="mt-5 space-y-2.5">
            {wallet.pockets.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-3.5 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-[11px] font-bold text-navy">
                    {p.mark}
                  </span>
                  <span className="text-sm font-semibold">{p.name}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-white/90">
                  {p.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {["Send", "Pay", "Buy", "Swap"].map((label) => (
              <div
                key={label}
                className="rounded-2xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] py-2.5 text-center text-[11px] font-bold text-navy"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
        {WALLETS.map((w, i) => (
          <span
            key={w.id}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-gold" : "w-1.5 bg-navy/25 dark:bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
