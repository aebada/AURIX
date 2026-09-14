"use client";

import { useState } from "react";
import { AppPage } from "@/components/app/AppShell";
import {
  Notice,
  Panel,
  PrimaryButton,
  SecondaryButton,
} from "@/components/app/chrome";
import { formatEur, usePractice } from "@/lib/app/practice-store";
import { useAuth } from "@/lib/auth-context";
import { AUTH_LOGIN_HREF } from "@/lib/auth-urls";
import { reopenPracticeTour } from "@/components/app/PracticeBanner";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const {
    practiceEnabled,
    setPracticeEnabled,
    reset,
    walletTotal,
    state,
  } = usePractice();
  const [msg, setMsg] = useState<string | null>(null);

  const name = user?.fullName || "Practice guest";
  const email = user?.email || "local@practice.aurix";
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <AppPage title="Profile" subtitle="KYC status · practice controls · settings">
      {msg && <Notice tone="ok">{msg}</Notice>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Identity" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl font-extrabold text-navy">
              {initial}
            </div>
            <p className="mt-3 text-lg font-bold text-heading">{name}</p>
            <p className="text-sm text-muted">{email}</p>
            <span className="mt-3 rounded-full border border-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-dark">
              KYC {token ? "pending" : "practice"}
            </span>
            {!token && (
              <a
                href={AUTH_LOGIN_HREF}
                className="mt-4 text-sm font-semibold text-gold-dark hover:underline"
              >
                Sign in with AURIX account
              </a>
            )}
          </div>
        </Panel>

        <Panel
          title="Practice mode"
          description="Paper multi-wallet — Personal, Business, Kids, Vault"
          className="lg:col-span-2"
        >
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-[var(--color-line)] px-4 py-3">
            <span>
              <span className="block text-sm font-bold text-heading">
                {practiceEnabled ? "Practice mode on" : "Practice mode off"}
              </span>
              <span className="block text-xs text-muted">
                {practiceEnabled
                  ? "Practice only · No real money"
                  : "Read-only demo — turn on to trade & pay"}
              </span>
            </span>
            <input
              type="checkbox"
              checked={practiceEnabled}
              onChange={(e) => setPracticeEnabled(e.target.checked)}
              className="h-5 w-5 accent-[var(--color-gold)]"
            />
          </label>

          <p className="mt-4 text-sm text-muted">
            Combined practice value:{" "}
            <strong className="text-heading">
              {formatEur(
                state.wallets.reduce((sum, w) => sum + walletTotal(w), 0),
              )}
            </strong>{" "}
            across {state.wallets.length} wallets.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <SecondaryButton
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all practice wallets, vouchers, and team invites?",
                  )
                ) {
                  reset();
                  setMsg("Practice account reset to seed balances");
                }
              }}
            >
              Reset practice account
            </SecondaryButton>
            <SecondaryButton
              onClick={() => {
                reopenPracticeTour();
                setMsg("Practice tips opened");
              }}
            >
              Show practice tips
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                setPracticeEnabled(true);
                setMsg("Practice mode enabled");
              }}
            >
              Enable practice
            </PrimaryButton>
          </div>

          <div className="mt-5 rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4 text-xs leading-relaxed text-muted">
            Practice — not real assets. Saved in this browser only. Reset restores
            seeded Personal / Business / Kids / Vault wallets. Live trading and
            reserves are not enabled yet — no mint, redeem, or vaulted-gold
            claims.
          </div>
        </Panel>
      </div>

      <Panel title="Settings shortcuts">
        <ul className="grid gap-2 sm:grid-cols-2 text-sm">
          {[
            "Identity verification (KYC)",
            "Security & devices",
            "Limits",
            "Support",
          ].map((item) => (
            <li
              key={item}
              className="rounded-lg border border-[var(--color-line)] px-4 py-3 font-semibold text-heading"
            >
              {item}
              <span className="mt-1 block text-xs font-normal text-muted">
                Coming with live account rails
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </AppPage>
  );
}
