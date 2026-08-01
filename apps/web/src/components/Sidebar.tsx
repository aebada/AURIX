"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useMobileNav } from "@/lib/mobile-nav-context";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/invest", label: "Invest" },
  { href: "/transactions", label: "Transactions" },
  { href: "/statements", label: "Statements" },
  { href: "/business", label: "Business" },
  { href: "/partners", label: "Partners & API" },
  { href: "/assistant", label: "AI Assistant" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <Link href="/" className="flex items-center gap-2 px-2" onClick={onNavigate}>
        <Image src="/brand/aurix-mark.png" alt="" width={26} height={24} className="h-6 w-auto" />
        <span className="text-lg font-extrabold tracking-tight text-navy">AURIX</span>
      </Link>

      <nav className="mt-10 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-navy text-white"
                  : "text-muted hover:bg-[var(--color-paper)] hover:text-navy"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
        <p className="truncate text-xs font-semibold text-navy">{user?.email}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Overview, Invest &amp; Transactions are live via services/backend.
          Statements, Business, and Partners are still mock — no backend
          endpoints yet.
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
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-line)] bg-white px-5 py-6 lg:flex">
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
