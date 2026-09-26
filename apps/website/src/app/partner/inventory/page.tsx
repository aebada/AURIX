"use client";

import { useGoldService } from "@/lib/gold-service/store";

export default function PartnerInventoryPage() {
  const gs = useGoldService();
  const byCountry = gs.locations.reduce<Record<string, number>>((acc, l) => {
    acc[l.country] = (acc[l.country] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-heading">Inventory</h1>
      <p className="text-sm text-muted">
        Practice stock view. Live metal inventory activates with certified partners only.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <div className="text-xs font-bold uppercase text-muted">Gold on hand (practice)</div>
          <div className="mt-2 text-3xl font-extrabold">125.0 g</div>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <div className="text-xs font-bold uppercase text-muted">Silver on hand (practice)</div>
          <div className="mt-2 text-3xl font-extrabold">2,400 g</div>
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 text-sm">
        <h2 className="font-extrabold">Network coverage (prospects)</h2>
        <ul className="mt-3 space-y-1">
          {Object.entries(byCountry).map(([c, n]) => (
            <li key={c}>
              {c}: {n} locations
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-4 rounded-full border px-4 py-2 text-xs font-semibold"
          onClick={() => alert("Replenishment request logged (practice).")}
        >
          Request replenishment
        </button>
      </div>
    </div>
  );
}
