"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "./nav-links";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[var(--color-paper)]/80 backdrop-blur-lg transition-shadow duration-300 ${
        scrolled
          ? "border-[var(--color-line)] shadow-[0_8px_24px_-16px_rgba(18,22,44,0.35)]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" onClick={() => setOpen(false)}>
          <Image
            src="/brand/aurix-mark.png"
            alt=""
            width={32}
            height={30}
            className="h-8 w-auto"
            priority
          />
          <span className="font-extrabold tracking-tight text-xl text-heading">
            AURIX
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/70 p-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors hover:bg-navy hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="text-sm font-semibold text-muted transition-colors hover:text-heading"
          >
            Contact
          </Link>
          <ThemeToggle />
          <Link
            href="/waitlist"
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg active:translate-y-0"
          >
            Join the Waitlist
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="sr-only">Toggle menu</span>
            <div className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-navy" />
              <span className="block h-0.5 w-4 bg-navy" />
              <span className="block h-0.5 w-4 bg-navy" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--color-line)] px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-3">
            {[...navLinks, { href: "/contact", label: "Contact" }].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-1 text-sm font-semibold text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/waitlist"
                className="mt-2 inline-block rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white"
                onClick={() => setOpen(false)}
              >
                Join the Waitlist
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
