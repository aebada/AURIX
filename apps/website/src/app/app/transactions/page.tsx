"use client";

import Link from "next/link";
import { AppPage } from "@/components/app/AppShell";
import {
  DataTable,
  Notice,
  Panel,
  PrimaryButton,
} from "@/components/app/chrome";
import { formatEur, formatGrams, usePractice } from "@/lib/app/practice-store";
import { useMetalAccount } from "@/lib/app/metal-account";
import { AUTH_LOGIN_HREF } from "@/lib/auth-urls";
import { AuthNavLink } from "@/components/AuthNavLink";

export default function TransactionsPage() {
  const { orders, loading, signedIn } = useMetalAccount();
  const { txnsForActive, activeWallet } = usePractice();

  return (
    <AppPage
      title="Transactions"
      subtitle="Paid metal orders and practice ledger"
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
          to see Stripe/PayPal metal orders tied to your email.
        </Notice>
      ) : (
        <Panel
          title="Metal orders"
          description={loading ? "Loading…" : `${orders.length} order(s)`}
        >
          <DataTable
            columns={["When", "Metal", "Grams", "BPC", "Paid", "Provider", "Status"]}
            empty="No paid orders yet — Order gold to create one."
            rows={orders.map((o) => [
              <span key="d" className="text-muted">
                {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
              </span>,
              <span key="m" className="capitalize">
                {o.metal}
              </span>,
              formatGrams(o.grams),
              (o.bpc ?? 0).toLocaleString(),
              formatEur(o.fiatEur),
              o.provider ?? "—",
              <span key="s" className="font-semibold uppercase text-gold-dark">
                {o.status}
              </span>,
            ])}
          />
        </Panel>
      )}

      <Panel
        title="Practice activity"
        description={`Local fills for ${activeWallet.name}`}
      >
        <DataTable
          columns={["When", "Type", "Label", "Amount"]}
          empty="No practice transactions yet."
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
