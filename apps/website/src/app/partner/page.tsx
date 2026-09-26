"use client";

import Link from "next/link";
import { PartnerShell } from "@/components/gold-service/PartnerShell";
import { useGoldService } from "@/lib/gold-service/store";

export default function PartnerHomePage() {
  const gs = useGoldService();
  const open = gs.state.transfers.filter(
    (t) => !["completed", "cancelled", "refunded"].includes(t.status),
  ).length;
  const done = gs.state.transfers.filter((t) => t.status === "completed").length;
  const apps = gs.state.applications.length;

  return (
    <PartnerShell title="Partner home">
      <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
        Practice partner panel — not a live agent login or settlement system.
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <p className="text-xs font-bold uppercase text-muted">Open transfers</p>
          <p className="mt-2 text-3xl font-extrabold text-heading">{open}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <p className="text-xs font-bold uppercase text-muted">Completed</p>
          <p className="mt-2 text-3xl font-extrabold text-heading">{done}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <p className="text-xs font-bold uppercase text-muted">Applications</p>
          <p className="mt-2 text-3xl font-extrabold text-heading">{apps}</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/partner/redeem/"
          className="rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-bold text-white"
        >
          Redeem a package
        </Link>
        <Link
          href="/partner/inventory/"
          className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-semibold"
        >
          Inventory
        </Link>
        <Link
          href="/partner/earnings/"
          className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-semibold"
        >
          Earnings
        </Link>
      </div>
    </PartnerShell>
  );
}
