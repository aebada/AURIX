"use client";

import Link from "next/link";
import { AppPage } from "@/components/app/AppShell";
import { Notice, Panel, PrimaryButton, SecondaryButton } from "@/components/app/chrome";
import { formatEur, formatGrams, kindLabel, usePractice } from "@/lib/app/practice-store";
import { useMetalAccount } from "@/lib/app/metal-account";
import { useAuth } from "@/lib/auth-context";
import { AUTH_LOGIN_HREF } from "@/lib/auth-urls";
import { AuthNavLink } from "@/components/AuthNavLink";

export default function AccountsPage() {
  const { user } = useAuth();
  const { wallet, loading, signedIn } = useMetalAccount();
  const { state, walletTotal, setActiveWallet, activeWallet } = usePractice();

  return (
    <AppPage
      title="Accounts"
      subtitle={
        signedIn
          ? `Metal + practice wallets for ${user?.email ?? "you"}`
          : "Sign in to see your metal accounts"
      }
      actions={
        <Link href="/app/trade/">
          <PrimaryButton>Order gold</PrimaryButton>
        </Link>
      }
    >
      {!signedIn ? (
        <Notice tone="info">
          <AuthNavLink href={AUTH_LOGIN_HREF} className="font-bold underline">
            Log in
          </AuthNavLink>{" "}
          to view gold/silver balances and BPC minted from paid orders.
        </Notice>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Panel title="Gold" description="Internal reserve · BPC mint">
            <p className="text-3xl font-extrabold text-heading">
              {loading ? "…" : formatGrams(wallet?.goldGrams ?? 0)}
            </p>
            <p className="mt-2 text-sm text-muted">
              {(wallet?.goldBpc ?? 0).toLocaleString()} BPC (1 BPC = 0.0001 g)
            </p>
            <p className="mt-4 text-xs text-muted">
              {wallet?.note ??
                "Not an independently attested London vault."}
            </p>
          </Panel>
          <Panel title="Silver" description="Internal reserve · BPC mint">
            <p className="text-3xl font-extrabold text-heading">
              {loading ? "…" : formatGrams(wallet?.silverGrams ?? 0)}
            </p>
            <p className="mt-2 text-sm text-muted">
              {(wallet?.silverBpc ?? 0).toLocaleString()} BPC
            </p>
          </Panel>
        </div>
      )}

      <Panel title="Practice wallets" description="Local demo pockets — not live custody">
        <ul className="space-y-2">
          {state.wallets.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => setActiveWallet(w.id)}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition ${
                  w.id === activeWallet.id
                    ? "border-gold bg-gold/10"
                    : "border-[var(--color-line)] hover:border-gold/40"
                }`}
              >
                <span>
                  <span className="block font-semibold text-heading">{w.name}</span>
                  <span className="text-xs text-muted">{kindLabel(w.kind)}</span>
                </span>
                <span className="font-bold text-heading">{formatEur(walletTotal(w))}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Link href="/app/wallet/">
            <SecondaryButton>Open wallet ledger</SecondaryButton>
          </Link>
        </div>
      </Panel>
    </AppPage>
  );
}
