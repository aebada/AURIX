"use client";

import { useCurrency } from "@/lib/currency-context";
import { CURRENCIES } from "@/lib/currencies";

export function CurrencySelector({ className = "" }: { className?: string }) {
  const { currency, setCurrencyCode } = useCurrency();

  return (
    <select
      value={currency.code}
      onChange={(e) => setCurrencyCode(e.target.value)}
      aria-label="Select display currency"
      className={`min-h-11 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-[16px] font-semibold text-heading focus:border-gold focus:outline-none md:min-h-0 md:text-xs ${className}`}
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code} title={c.name}>
          {c.code}
        </option>
      ))}
    </select>
  );
}
