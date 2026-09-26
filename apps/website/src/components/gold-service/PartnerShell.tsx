"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useGoldService } from "@/lib/gold-service/store";

const NAV = [
  { href: "/partner/", label: "Home" },
  { href: "/partner/redeem/", label: "Redeem" },
  { href: "/partner/inventory/", label: "Inventory" },
  { href: "/partner/earnings/", label: "Earnings" },
];

export function PartnerShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const gs = useGoldService();

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-ink">
      <header className="border-b border-[var(--color-line)] bg-[var(--color-paper)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="AURIX home">
              <BrandLogo />
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Partner Panel
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => gs.setPartnerSession(!gs.state.partnerSession)}
              className="rounded-full border border-[var(--color-line)] px-3 py-1.5 font-semibold"
            >
              {gs.state.partnerSession ? "Partner session on" : "Enter partner mode"}
            </button>
            <Link href="/" className="text-muted underline">
              Site
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-muted hover:bg-[var(--color-surface)] hover:text-heading"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-heading">
          {title}
        </h1>
        {!gs.state.partnerSession ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            Turn on partner mode to use redeem and inventory. Practice only — not a live
            agent login.
          </div>
        ) : null}
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}
