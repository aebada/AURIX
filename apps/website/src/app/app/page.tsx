"use client";

import Link from "next/link";
import { AppPage } from "@/components/app/AppShell";
import {
  DataTable,
  Notice,
  Panel,
  PrimaryButton,
} from "@/components/app/chrome";
import {
  formatEur,
  formatGrams,
  kindLabel,
  usePractice,
} from "@/lib/app/practice-store";

export default function AppOverviewPage() {
  const {
    state,
    activeWallet,
    walletTotal,
    txnsForActive,
    practiceEnabled,
    setActiveWallet,
  } = usePractice();

  const b = activeWallet.balances;

  return (
    <AppPage
      title="Overview"
      subtitle="Revolut-style multi-wallet · switch accounts in the sidebar"
      actions={
        <Link href="/app/trade/">
          <PrimaryButton>Buy / Sell</PrimaryButton>
        </Link>
      }
    >
      {!practiceEnabled && (
        <Notice tone="info">
          Practice mode is off — enable it in Profile to move virtual balances.
          Demo numbers stay read-only until then.
        </Notice>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {state.wallets.map((w) => {
          const active = w.id === activeWallet.id;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => setActiveWallet(w.id)}
              className={`rounded-lg border p-4 text-left transition ${
                active
                  ? "border-gold bg-gold/10 shadow-sm"
                  : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-gold/40"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {kindLabel(w.kind)}
              </p>
              <p className="mt-1 font-bold text-heading">{w.name}</p>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-heading">
                {formatEur(walletTotal(w))}
              </p>
              <p className="mt-1 text-xs text-muted">
                Fiat {formatEur(w.balances.fiatEur)} · Au{" "}
                {formatGrams(w.balances.goldGrams)}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title={`${activeWallet.name} pockets`}
          description="Fiat + metal pockets inside the active wallet"
          className="lg:col-span-1"
        >
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-2">
              <dt className="text-muted">Fiat (EUR)</dt>
              <dd className="font-semibold text-heading">{formatEur(b.fiatEur)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-2">
              <dt className="text-muted">Gold</dt>
              <dd className="font-semibold text-heading">
                {formatGrams(b.goldGrams)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Silver</dt>
              <dd className="font-semibold text-heading">
                {formatGrams(b.silverGrams)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted">
            Total marked ≈ {formatEur(walletTotal(activeWallet))}
          </p>
        </Panel>

        <Panel
          title="Quick links"
          description="Desktop ops shortcuts"
          className="lg:col-span-2"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/app/business/", label: "Business treasury & team" },
              { href: "/app/family/", label: "Kids / Family controls" },
              { href: "/app/vouchers/", label: "Create & redeem vouchers" },
              { href: "/app/payments/", label: "Send / transfer wallets" },
              { href: "/app/markets/", label: "Markets & vault" },
              { href: "/app/profile/", label: "Practice & KYC" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-[var(--color-line)] px-4 py-3 text-sm font-semibold text-heading transition hover:border-gold hover:bg-gold/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Recent activity"
        description={`Transactions for ${activeWallet.name}`}
      >
        <DataTable
          columns={["When", "Type", "Label", "Amount"]}
          empty="No activity yet for this wallet."
          rows={txnsForActive.slice(0, 8).map((t) => [
            <span key="d" className="text-muted">
              {new Date(t.createdAt).toLocaleString()}
            </span>,
            <span key="k" className="font-medium capitalize text-heading">
              {t.kind}
            </span>,
            <span key="l">{t.label}</span>,
            <span key="a" className="font-semibold text-heading">
              {t.amountLabel}
            </span>,
          ])}
        />
      </Panel>
    </AppPage>
  );
}
