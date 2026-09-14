"use client";

import Link from "next/link";
import { usePractice } from "@/lib/app/practice-store";

const TOUR_DISMISS_KEY = "aurix.app.practice.tour.dismissed.v1";

export function reopenPracticeTour() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOUR_DISMISS_KEY);
  window.dispatchEvent(new CustomEvent("aurix:practice-tour", { detail: { open: true } }));
}

export function PracticeBanner() {
  const { practiceEnabled, setPracticeEnabled, reset } = usePractice();

  return (
    <div
      role="status"
      className="sticky top-0 z-40 border-b border-amber-500/30 bg-navy text-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6 lg:px-8">
        <p className="font-semibold tracking-wide">
          <span className="text-gold-light">Practice — not real assets</span>
          <span className="mx-2 text-white/30" aria-hidden>
            ·
          </span>
          <span className="font-normal text-white/70">
            Mock balances only. No custody, no real money, RESERVE_LIVE=false.
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {!practiceEnabled && (
            <button
              type="button"
              onClick={() => setPracticeEnabled(true)}
              className="rounded-md bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy"
            >
              Enable practice
            </button>
          )}
          <button
            type="button"
            onClick={() => reopenPracticeTour()}
            className="rounded-md border border-white/25 px-2.5 py-1 text-[11px] font-semibold text-white/90 hover:bg-white/10"
          >
            Tips
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all practice wallets, vouchers, and team invites to seed data?",
                )
              ) {
                reset();
              }
            }}
            className="rounded-md border border-white/25 px-2.5 py-1 text-[11px] font-semibold text-white/90 hover:bg-white/10"
          >
            Reset data
          </button>
          <Link
            href="/demo"
            className="rounded-md border border-white/25 px-2.5 py-1 text-[11px] font-semibold text-gold-light hover:bg-white/10"
          >
            Demo hub
          </Link>
        </div>
      </div>
    </div>
  );
}

export { TOUR_DISMISS_KEY };
