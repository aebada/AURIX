"use client";

import Link from "next/link";
import { AppPage } from "@/components/app/AppShell";
import {
  DataTable,
  Notice,
  Panel,
  PrimaryButton,
  SecondaryButton,
} from "@/components/app/chrome";
import {
  formatEur,
  formatGrams,
  kindLabel,
  usePractice,
} from "@/lib/app/practice-store";
import { useMetalAccount } from "@/lib/app/metal-account";
import { useAuth } from "@/lib/auth-context";
import { AUTH_LOGIN_HREF, AUTH_REGISTER_HREF } from "@/lib/auth-urls";
import { AuthNavLink } from "@/components/AuthNavLink";

export default function AppOverviewPage() {
  const { user } = useAuth();
  const { wallet, orders, loading, signedIn } = useMetalAccount();
  const {
    state,
    activeWallet,
    walletTotal,
    txnsForActive,
    practiceEnabled,
    setActiveWallet,
  } = usePractice();

  const b = activeWallet.balances;
  const recentOrders = orders.slice(0, 6);

  return (
    <AppPage
      title={signedIn ? "Dashboard" : "Overview"}
      subtitle={
        signedIn
          ? `Welcome back${user?.fullName ? `, ${user.fullName}` : ""} · accounts & activity`
          : "Sign in to see your metal account, or explore practice wallets"
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href="/app/trade/">
            <PrimaryButton>Order gold</PrimaryButton>
          </Link>
          {signedIn ? (
            <Link href="/app/transactions/">
              <SecondaryButton>Transactions</SecondaryButton>
            </Link>
          ) : null}
        </div>
      }
    >
      {!signedIn ? (
        <Notice tone="info">
          <span className="font-semibold text-heading">Sign in</span> to open your
          AURIX account, paid gold orders, and BPC balances.{" "}
          <AuthNavLink href={AUTH_LOGIN_HREF} className="font-bold underline">
            Log in
          </AuthNavLink>{" "}
          or{" "}
          <AuthNavLink href={AUTH_REGISTER_HREF} className="font-bold underline">
            create an account
          </AuthNavLink>
          .
        </Notice>
      ) : null}

      {signedIn ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-gold/40 bg-gold/10 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Gold account
            </p>
            <p className="mt-2 text-2xl font-extrabold text-heading">
              {loading ? "…" : formatGrams(wallet?.goldGrams ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {(wallet?.goldBpc ?? 0).toLocaleString()} BPC · internal reserve
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Silver account
            </p>
            <p className="mt-2 text-2xl font-extrabold text-heading">
              {loading ? "…" : formatGrams(wallet?.silverGrams ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {(wallet?.silverBpc ?? 0).toLocaleString()} BPC
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Orders
            </p>
            <p className="mt-2 text-2xl font-extrabold text-heading">
              {loading ? "…" : orders.length}
            </p>
            <p className="mt-1 text-xs text-muted">
              <Link href="/app/transactions/" className="font-semibold text-navy underline">
                View all transactions
              </Link>
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Custody
            </p>
            <p className="mt-2 text-lg font-extrabold text-heading">Internal reserve</p>
            <p className="mt-1 text-xs text-muted">
              London vault attestation not live yet
            </p>
          </div>
        </div>
      ) : null}

      {signedIn && recentOrders.length > 0 ? (
        <Panel title="Recent orders" description="Paid / minted metal from your account">
          <DataTable
            columns={["When", "Metal", "Grams", "Paid", "Status"]}
            empty="No orders yet."
            rows={recentOrders.map((o) => [
              <span key="d" className="text-muted">
                {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
              </span>,
              <span key="m" className="capitalize">
                {o.metal}
              </span>,
              formatGrams(o.grams),
              formatEur(o.fiatEur),
              <span key="s" className="font-semibold uppercase text-gold-dark">
                {o.status}
              </span>,
            ])}
          />
        </Panel>
      ) : null}

      {!practiceEnabled && (
        <Notice tone="info">
          Practice mode is off — enable it in Profile to move virtual balances.
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
                {kindLabel(w.kind)} · practice
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
          description="Practice fiat + metal"
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
        </Panel>

        <Panel title="Quick links" description="Your app" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/app/accounts/", label: "Accounts" },
              { href: "/app/transactions/", label: "Transactions" },
              { href: "/app/wallet/", label: "Practice wallet" },
              { href: "/app/trade/", label: "Order gold" },
              { href: "/app/payments/", label: "Payments" },
              { href: "/app/profile/", label: "Profile" },
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
        title="Practice activity"
        description={`Local practice ledger · ${activeWallet.name}`}
      >
        <DataTable
          columns={["When", "Type", "Label", "Amount"]}
          empty="No practice activity yet."
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
