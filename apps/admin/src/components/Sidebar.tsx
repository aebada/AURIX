"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useMobileNav } from "@/lib/mobile-nav-context";
import type { Role } from "@/lib/api";

const groups: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Ops",
    items: [
      { href: "/", label: "Overview" },
      { href: "/users", label: "Users" },
      { href: "/team", label: "Team & roles" },
      { href: "/waitlist", label: "Waitlist" },
      { href: "/investors", label: "Investors" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { href: "/kyc", label: "KYC queue" },
      { href: "/aml", label: "AML" },
      { href: "/monitoring", label: "Monitoring" },
      { href: "/audit", label: "Audit log" },
    ],
  },
  {
    title: "Money & metal",
    items: [
      { href: "/transactions", label: "Transactions" },
      { href: "/metal-orders", label: "Metal orders" },
      { href: "/reserves", label: "Reserves" },
      { href: "/transfers", label: "Cross-border" },
      { href: "/disputes", label: "Disputes" },
    ],
  },
  {
    title: "Network",
    items: [
      { href: "/partners", label: "Partners" },
      { href: "/partners/commission-rules", label: "Commission rules" },
    ],
  },
  {
    title: "Payroll",
    items: [
      { href: "/payroll-employers", label: "Employers" },
      { href: "/payroll-thresholds", label: "Thresholds" },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/content", label: "Content" },
      { href: "/settings", label: "Settings" },
      { href: "/governance", label: "AI Governance" },
    ],
  },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "SUPER_ADMIN",
  operations_manager: "Operations Manager",
  sales_partnerships: "Sales & Partnerships",
  finance: "Finance",
  marketing: "Marketing",
  compliance_officer: "Compliance Officer",
  support: "Support",
  admin: "Operations Manager",
  user: "User",
  partner: "Partner",
  investor: "Investor",
  employer: "Employer",
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <Link href="/" className="flex items-center gap-2 px-2" onClick={onNavigate}>
        <Image src="/brand/aurix-mark.png" alt="" width={26} height={24} className="h-6 w-auto" />
        <div>
          <span className="block text-lg font-extrabold tracking-tight text-navy">AURIX</span>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
            Admin
          </span>
        </div>
      </Link>

      <nav className="mt-8 flex flex-col gap-5">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted">
              {g.title}
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
              {g.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-navy text-white"
                        : "text-muted hover:bg-[var(--color-paper)] hover:text-navy"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
        <p className="truncate text-xs font-semibold text-navy">{user?.email}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold-dark">
          {user ? ROLE_LABELS[user.role] : "—"}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Feature flags and KYC decisions are server-gated. Payments keys stay in
          server env, never in this UI.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 text-xs font-semibold text-gold-dark hover:underline"
        >
          Sign out
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const { open, setOpen } = useMobileNav();

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-[var(--color-line)] bg-white px-5 py-6 lg:flex">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-[var(--color-line)] bg-white px-5 py-6 shadow-xl">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
