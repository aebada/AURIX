"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth-context";
import { AUTH_LOGIN_HREF } from "@/lib/auth-urls";
import {
  formatEur,
  kindLabel,
  usePractice,
} from "@/lib/app/practice-store";
import type { WalletKind } from "@/lib/app/types";

const NAV: {
  href: string;
  label: string;
  section: "Account" | "Money" | "Org";
}[] = [
  { href: "/app/", label: "Overview", section: "Account" },
  { href: "/app/wallet/", label: "Wallet", section: "Account" },
  { href: "/app/trade/", label: "Buy / Sell", section: "Money" },
  { href: "/app/payments/", label: "Payments", section: "Money" },
  { href: "/app/markets/", label: "Markets", section: "Money" },
  { href: "/app/vouchers/", label: "Vouchers", section: "Money" },
  { href: "/app/business/", label: "Business", section: "Org" },
  { href: "/app/family/", label: "Kids / Family", section: "Org" },
  { href: "/app/profile/", label: "Profile", section: "Org" },
];

function kindAccent(kind: WalletKind) {
  switch (kind) {
    case "personal":
      return "border-l-gold";
    case "business":
      return "border-l-sky-400";
    case "kids":
      return "border-l-emerald-400";
    case "savings":
      return "border-l-amber-400";
  }
}

export function WalletSwitcher() {
  const { state, activeWallet, setActiveWallet, walletTotal } = usePractice();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-left text-sm transition hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="min-w-0">
          <span className="block truncate font-semibold text-white">
            {activeWallet.name}
          </span>
          <span className="block truncate text-[11px] text-white/55">
            {kindLabel(activeWallet.kind)} · {formatEur(walletTotal(activeWallet))}
          </span>
        </span>
        <span className="shrink-0 text-white/50" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close wallet switcher"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-auto rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] shadow-xl"
          >
            {state.wallets.map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={w.id === activeWallet.id}
                  onClick={() => {
                    setActiveWallet(w.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 border-l-4 px-3 py-2.5 text-left text-sm hover:bg-[var(--color-paper)] ${kindAccent(w.kind)} ${
                    w.id === activeWallet.id ? "bg-gold/10" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-heading">
                      {w.name}
                    </span>
                    <span className="block text-[11px] text-muted">
                      {kindLabel(w.kind)}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-heading">
                    {formatEur(walletTotal(w))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function AppSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { practiceEnabled } = usePractice();
  const { user, token, logout } = useAuth();
  const sections = ["Account", "Money", "Org"] as const;

  const nav = (
    <>
      <div className="border-b border-white/10 px-4 py-4">
        <Link href="/app/" className="block" onClick={onClose}>
          <BrandLogo variant="onDark" className="h-8 w-auto" />
        </Link>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">
          Multi-wallet · Desktop
        </p>
      </div>

      <div className="border-b border-white/10 px-3 py-3">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Active wallet
        </p>
        <WalletSwitcher />
        {practiceEnabled && (
          <p className="mt-2 px-1 text-[11px] font-medium text-gold-light">
            Practice · No real money
          </p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section) => (
          <div
            key={section}
            className="mb-3 border-t border-white/10 pt-2 first:border-t-0 first:pt-0"
          >
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
              {section}
            </p>
            {NAV.filter((n) => n.section === section).map((item) => {
              const normalized = pathname.replace(/\/$/, "") || "/";
              const target = item.href.replace(/\/$/, "") || "/";
              const active =
                item.href === "/app/"
                  ? normalized === "/app"
                  : normalized === target || normalized.startsWith(`${target}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`mb-0.5 block border-l-[3px] px-3 py-2 text-sm transition ${
                    active
                      ? "border-gold bg-gold/15 font-semibold text-white"
                      : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="truncate text-xs font-semibold text-white">
          {user?.fullName || user?.email || "Practice guest"}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-white/50">
          {token ? user?.email : "Local practice session"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/"
            className="text-[11px] font-semibold text-gold-light hover:underline"
            onClick={onClose}
          >
            Marketing site
          </Link>
          {token ? (
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-[11px] font-semibold text-white/60 hover:text-white"
            >
              Sign out
            </button>
          ) : (
            <a
              href={AUTH_LOGIN_HREF}
              className="text-[11px] font-semibold text-white/60 hover:text-white"
              onClick={onClose}
            >
              Sign in
            </a>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col bg-[var(--color-navy-deep)] text-white lg:flex">
        {nav}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={onClose}
          />
          <aside className="relative z-10 flex h-full w-72 flex-col bg-[var(--color-navy-deep)] text-white shadow-2xl">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}

export function AppTopbar({
  title,
  subtitle,
  actions,
  onMenu,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onMenu: () => void;
}) {
  const { practiceEnabled, activeWallet } = usePractice();

  return (
    <header className="flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-paper)]/95 px-4 py-3 backdrop-blur lg:px-8">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-line)] text-heading lg:hidden"
        onClick={onMenu}
        aria-label="Open menu"
      >
        ☰
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold tracking-tight text-heading">
          {title}
        </h1>
        <p className="truncate text-xs text-muted">
          {subtitle ??
            `${activeWallet.name} · ${
              practiceEnabled ? "Practice mode" : "Demo preview"
            }`}
        </p>
      </div>
      {practiceEnabled && (
        <span className="hidden rounded-md bg-navy px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-light sm:inline">
          Practice
        </span>
      )}
      {actions}
    </header>
  );
}

export function Panel({
  title,
  description,
  children,
  className = "",
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={`rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-line)] px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-heading">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function DataTable({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows: ReactNode[][];
  empty: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-line)] text-[11px] uppercase tracking-wider text-muted">
            {columns.map((c) => (
              <th key={c} className="pb-2 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-muted"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((cells, i) => (
              <tr
                key={i}
                className="border-b border-[var(--color-line)] last:border-0 hover:bg-[var(--color-paper)]/80"
              >
                {cells.map((cell, j) => (
                  <td key={j} className="py-3 align-middle">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-heading transition hover:border-navy disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-heading">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-heading outline-none focus:border-gold";

export function Notice({
  tone,
  children,
}: {
  tone: "ok" | "err" | "info";
  children: ReactNode;
}) {
  const styles =
    tone === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
      : tone === "err"
        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        : "border-[var(--color-line)] bg-[var(--color-paper)] text-muted";
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
