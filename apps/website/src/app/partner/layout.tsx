"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useGoldService } from "@/lib/gold-service/store";

const NAV = [
  { href: "/partner/", label: "Home" },
  { href: "/partner/redeem/", label: "Redeem" },
  { href: "/partner/inventory/", label: "Inventory" },
  { href: "/partner/earnings/", label: "Earnings" },
];

export default function PartnerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => gs.setPartnerSession(!gs.state.partnerSession)}
              className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold"
            >
              {gs.state.partnerSession ? "Partner session on" : "Enter partner mode"}
            </button>
            <Link href="/partner-with-us/" className="text-xs font-semibold text-gold-dark">
              Apply
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3">
          {NAV.map((n) => {
            const active =
              pathname === n.href ||
              (n.href !== "/partner/" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  active
                    ? "bg-[var(--color-navy)] text-white"
                    : "text-muted hover:bg-[var(--color-paper)]"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-xs">
        Practice Partner Panel — not live settlement. Locations on the public locator are
        prospects until approved.
      </div>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
