"use client";

import Link from "next/link";
import { useGoldService } from "@/lib/gold-service/store";

export default function PartnerHomePage() {
  const gs = useGoldService();
  const pending = gs.state.transfers.filter((t) =>
    ["paid", "notified", "ready"].includes(t.status),
  );
  const apps = gs.state.applications.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-heading">Partner home</h1>
        <p className="mt-2 text-sm text-muted">
          Today&apos;s queue, earnings snapshot, and alerts — designed for counter speed.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Pending pickups
          </div>
          <div className="mt-2 text-3xl font-extrabold text-heading">{pending.length}</div>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Applications
          </div>
          <div className="mt-2 text-3xl font-extrabold text-heading">
            {gs.state.applications.length}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Prospect locations
          </div>
          <div className="mt-2 text-3xl font-extrabold text-heading">
            {gs.locations.length}
          </div>
        </div>
      </div>

      <Link
        href="/partner/redeem/"
        className="flex items-center justify-between rounded-3xl bg-[var(--color-navy)] px-6 py-5 text-white"
      >
        <div>
          <div className="text-lg font-extrabold">Redeem</div>
          <div className="text-sm text-white/70">Enter or scan recipient code</div>
        </div>
        <span className="text-2xl">→</span>
      </Link>

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
        <h2 className="font-extrabold text-heading">Open transfers</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {pending.length === 0 && (
            <li className="text-muted">No open practice transfers. Create one via Send gold.</li>
          )}
          {pending.map((t) => (
            <li key={t.id} className="flex justify-between gap-3 border-b border-[var(--color-line)] py-2">
              <span>
                {t.recipientName} · {t.grams}g {t.metal} · {t.practiceCode}
              </span>
              <span className="text-muted">{t.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {apps.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <h2 className="font-extrabold text-heading">Recent applications</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {apps.map((a) => (
              <li key={a.id}>
                {a.businessName} · {a.country} · {a.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
