"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "@/components/app/chrome";
import { usePractice } from "@/lib/app/practice-store";
import { TOUR_DISMISS_KEY } from "@/components/app/PracticeBanner";

const TOUR_STEPS = [
  {
    id: "overview",
    href: "/app/",
    title: "Multi-wallet overview",
    body: "Switch Personal, Business, Kids, and Vault from the sidebar. Balances are seeded mock data.",
  },
  {
    id: "trade",
    href: "/app/trade/",
    title: "Buy & sell metals",
    body: "Paper-trade gold and silver against practice EUR. Fees are simulated at 0.5%.",
  },
  {
    id: "payments",
    href: "/app/payments/",
    title: "Payments & transfers",
    body: "Send, request, move between wallets, or preview QR — no real rails fire.",
  },
  {
    id: "business",
    href: "/app/business/",
    title: "Business ops",
    body: "Try payroll, invoices, merchant QR, and team invites on the company wallet.",
  },
  {
    id: "family",
    href: "/app/family/",
    title: "Kids / Family",
    body: "Set limits, request spend, and approve from the parent wallet.",
  },
  {
    id: "profile",
    href: "/app/profile/",
    title: "Reset anytime",
    body: "KYC shows practice status. Reset seed balances from Profile or the banner.",
  },
] as const;

export function PracticeTour() {
  const { setPracticeEnabled } = usePractice();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const dismiss = useCallback((persist = true) => {
    setOpen(false);
    if (persist && typeof window !== "undefined") {
      window.localStorage.setItem(TOUR_DISMISS_KEY, "1");
    }
    if (searchParams.get("tour") === "1") {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("tour");
      const q = next.toString();
      router.replace(q ? `${pathname}?${q}` : pathname);
    }
  }, [pathname, router, searchParams]);

  useEffect(() => {
    setPracticeEnabled(true);
    const force = searchParams.get("tour") === "1";
    const dismissed =
      typeof window !== "undefined" &&
      window.localStorage.getItem(TOUR_DISMISS_KEY) === "1";
    if (force || !dismissed) setOpen(true);
  }, [searchParams, setPracticeEnabled]);

  useEffect(() => {
    const onOpen = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener("aurix:practice-tour", onOpen);
    return () => window.removeEventListener("aurix:practice-tour", onOpen);
  }, []);

  if (!open) return null;

  const current = TOUR_STEPS[Math.min(step, TOUR_STEPS.length - 1)]!;
  const isLast = step >= TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="practice-tour-title"
        className="w-full max-w-md rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-2xl"
      >
        <p className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">
          Practice tour · {step + 1}/{TOUR_STEPS.length}
        </p>
        <h2
          id="practice-tour-title"
          className="mt-2 text-xl font-extrabold tracking-tight text-heading"
        >
          {current.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{current.body}</p>
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          Practice — not real assets. RESERVE_LIVE stays off; no mint, redeem, or
          vaulted gold claims.
        </p>
          <div className="mt-5 flex flex-wrap gap-2">
          <Link href={current.href} onClick={() => dismiss(true)}>
            <PrimaryButton>Open {current.title.split(" ")[0]}</PrimaryButton>
          </Link>
          {!isLast ? (
            <SecondaryButton
              onClick={() => {
                const next = TOUR_STEPS[step + 1];
                setStep((s) => s + 1);
                if (next) router.push(next.href);
              }}
            >
              Next tip
            </SecondaryButton>
          ) : (
            <PrimaryButton onClick={() => dismiss(true)}>Done</PrimaryButton>
          )}
          <button
            type="button"
            onClick={() => dismiss(true)}
            className="ms-auto text-xs font-semibold text-muted hover:text-heading"
          >
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
