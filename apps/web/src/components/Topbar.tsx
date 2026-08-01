"use client";

import { useMobileNav } from "@/lib/mobile-nav-context";

export function Topbar({ title }: { title: string }) {
  const { setOpen } = useMobileNav();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] bg-white px-4 py-4 sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] lg:hidden"
        >
          <div className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 bg-navy" />
            <span className="block h-0.5 w-4 bg-navy" />
            <span className="block h-0.5 w-4 bg-navy" />
          </div>
        </button>
        <h1 className="truncate text-base font-extrabold tracking-tight text-navy sm:text-lg">
          {title}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span className="hidden rounded-full border border-[var(--color-line)] px-3 py-1 text-xs font-semibold text-muted sm:inline-block">
          Mock session
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
