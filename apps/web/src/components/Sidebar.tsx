"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
  { href: "/statements", label: "Statements" },
  { href: "/business", label: "Business" },
  { href: "/partners", label: "Partners & API" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-line)] bg-white px-5 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-2 px-2">
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
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
          Mock data
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          This dashboard is not yet connected to services/backend.
        </p>
      </div>
    </aside>
  );
}
