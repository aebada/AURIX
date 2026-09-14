"use client";

import { AppPage } from "@/components/app/AppShell";
import { DataTable, Panel } from "@/components/app/chrome";
import {
  formatEur,
  formatGrams,
  usePractice,
} from "@/lib/app/practice-store";

export default function WalletPage() {
  const { activeWallet, walletTotal, txnsForActive } = usePractice();
  const b = activeWallet.balances;

  return (
    <AppPage title="Wallet" subtitle={`${activeWallet.name} balances & ledger`}>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: formatEur(walletTotal(activeWallet)) },
          { label: "Fiat", value: formatEur(b.fiatEur) },
          {
            label: "Metals",
            value: `${formatGrams(b.goldGrams)} Au · ${formatGrams(b.silverGrams)} Ag`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {card.label}
            </p>
            <p className="mt-2 text-xl font-extrabold tracking-tight text-heading">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <Panel title="Transaction ledger" description="Filter by switching wallets in the sidebar">
        <DataTable
          columns={["Date", "Type", "Description", "Amount"]}
          empty="No transactions yet."
          rows={txnsForActive.map((t) => [
            <span key="d" className="text-muted">
              {new Date(t.createdAt).toLocaleString()}
            </span>,
            <span key="k" className="capitalize">
              {t.kind}
            </span>,
            t.label,
            <span key="a" className="font-semibold">
              {t.amountLabel}
            </span>,
          ])}
        />
      </Panel>
    </AppPage>
  );
}
