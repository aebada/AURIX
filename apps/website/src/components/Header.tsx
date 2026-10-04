"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mobileNavExtras, navLinks } from "./nav-links";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencySelector } from "./CurrencySelector";
import { LanguageSelector } from "./LanguageSelector";
import { useAuth } from "@/lib/auth-context";
import { AUTH_LOGIN_HREF, AUTH_REGISTER_HREF } from "@/lib/auth-urls";
import { AuthNavLink } from "@/components/AuthNavLink";
import { BrandLogo } from "@/components/BrandLogo";
import { useLanguage } from "@/lib/i18n/language-context";

const WEB_APP_HREF = "/app/";

function navLinkClass(active: boolean) {
  return [
    "whitespace-nowrap rounded-full px-1.5 py-1.5 text-xs font-semibold transition-colors lg:px-2.5 lg:text-sm xl:px-3",
    active
      ? "bg-navy text-white dark:bg-[var(--color-heading)] dark:text-[var(--color-paper)]"
      : "text-muted hover:bg-[var(--color-surface)] hover:text-heading",
  ].join(" ");
}

/** Match paths with or without trailing slash (static export uses trailingSlash). */
function isActivePath(pathname: string, href: string) {
  const current = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  return current === target;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const { token, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (!open) {
      delete root.dataset.aurixMobileNav;
      window.dispatchEvent(new CustomEvent("aurix:mobile-nav", { detail: { open: false } }));
      return;
    }

    const scrollY = window.scrollY;
    root.dataset.aurixMobileNav = "open";
    const prev = {
      htmlOverflow: root.style.overflow,
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      touchAction: body.style.touchAction,
    };
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.touchAction = "none";
    window.dispatchEvent(new CustomEvent("aurix:mobile-nav", { detail: { open: true } }));

    return () => {
      delete root.dataset.aurixMobileNav;
      root.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.touchAction = prev.touchAction;
      window.scrollTo(0, scrollY);
      window.dispatchEvent(new CustomEvent("aurix:mobile-nav", { detail: { open: false } }));
    };
  }, [open]);

  const mobileNav =
    open && portalReady
      ? createPortal(
          <nav
            id="aurix-mobile-nav"
            className="fixed inset-x-0 z-[200] overflow-y-auto overscroll-contain bg-[var(--color-paper)] px-4 pt-4 sm:px-6 md:hidden"
            style={{
              top: "4rem",
              bottom: 0,
              height: "calc(100dvh - 4rem)",
              maxHeight: "calc(100dvh - 4rem)",
              paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))",
              WebkitOverflowScrolling: "touch",
              isolation: "isolate",
              pointerEvents: "auto",
              transform: "translateZ(0)",
            }}
            aria-label="Mobile"
          >
            <ul className="flex min-h-full flex-col gap-1 pb-8">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block min-h-11 touch-manipulation rounded-lg px-3 py-2.5 text-base font-semibold ${
                        active ? "bg-navy text-white" : "text-ink hover:bg-[var(--color-surface)]"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {t.nav[link.key]}
                    </Link>
                  </li>
                );
              })}
              <li className="my-1 border-t border-[var(--color-line)]" aria-hidden />
              {mobileNavExtras.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block min-h-11 touch-manipulation rounded-lg px-3 py-2.5 text-base font-semibold ${
                        active ? "bg-navy text-white" : "text-ink hover:bg-[var(--color-surface)]"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {t.nav[link.key]}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 border-t border-[var(--color-line)] pt-4">
                <LanguageSelector variant="panel" />
              </li>
              <li className="my-2 border-t border-[var(--color-line)]" aria-hidden />
              {token ? (
                <>
                  <li>
                    <Link
                      href={WEB_APP_HREF}
                      className="block min-h-11 touch-manipulation rounded-lg px-3 py-2.5 text-base font-semibold text-ink hover:bg-[var(--color-surface)]"
                    >
                      {t.header.dashboard}
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="mt-1 inline-block min-h-11 touch-manipulation rounded-full bg-navy px-5 py-2.5 text-base font-bold text-white"
                    >
                      {t.header.signout}
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <AuthNavLink
                      href={AUTH_LOGIN_HREF}
                      className="block min-h-11 touch-manipulation rounded-lg px-3 py-2.5 text-base font-semibold text-ink hover:bg-[var(--color-surface)]"
                      onClick={() => setOpen(false)}
                    >
                      {t.header.login}
                    </AuthNavLink>
                  </li>
                  <li>
                    <AuthNavLink
                      href={AUTH_REGISTER_HREF}
                      className="mt-1 inline-block min-h-11 touch-manipulation rounded-full bg-navy px-5 py-2.5 text-base font-bold text-white"
                      onClick={() => setOpen(false)}
                    >
                      {t.header.signup}
                    </AuthNavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>,
          // Portal onto <html>, not <body>: iOS Safari drops taps on
          // position:fixed children of a position:fixed body.
          document.documentElement,
        )
      : null;

  return (
    <>
      <header
        className={`sticky top-0 border-b bg-[var(--color-paper)]/90 backdrop-blur-lg transition-shadow duration-300 ${
          open ? "z-[210]" : "z-[90]"
        } ${
          scrolled
            ? "border-[var(--color-line)] shadow-[0_8px_24px_-16px_rgba(18,22,44,0.35)]"
            : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center py-1 transition-opacity hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            <BrandLogo priority />
          </Link>

          {/* Desktop / tablet: Revolut-style centered primary nav */}
          <nav
            className="hidden min-w-0 flex-1 items-center justify-center md:flex"
            aria-label="Primary"
          >
            <div className="flex min-w-0 flex-nowrap items-center justify-center gap-0.5 lg:gap-1">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={navLinkClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    {t.nav[link.key]}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Desktop / tablet actions: tools + auth */}
          <div className="ms-auto hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1.5">
              <CurrencySelector className="w-[4.5rem] lg:w-[4.75rem]" />
              <LanguageSelector className="hidden max-w-[6.75rem] lg:block" />
              <ThemeToggle />
            </div>
            <span className="mx-0.5 hidden h-5 w-px bg-[var(--color-line)] sm:block" aria-hidden />
            {token ? (
              <div className="flex items-center gap-2">
                <Link
                  href={WEB_APP_HREF}
                  className="whitespace-nowrap text-sm font-semibold text-muted transition-colors hover:text-heading"
                >
                  {t.header.dashboard}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="whitespace-nowrap rounded-full bg-navy px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg active:translate-y-0"
                >
                  {t.header.signout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AuthNavLink
                  href={AUTH_LOGIN_HREF}
                  className="whitespace-nowrap text-sm font-semibold text-muted transition-colors hover:text-heading"
                >
                  {t.header.login}
                </AuthNavLink>
                <AuthNavLink
                  href={AUTH_REGISTER_HREF}
                  className="whitespace-nowrap rounded-full bg-gradient-gold px-4 py-2 text-sm font-bold text-navy shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-gold/25 active:translate-y-0"
                >
                  {t.header.signup}
                </AuthNavLink>
              </div>
            )}
          </div>

          {/* Mobile: currency + theme + hamburger */}
          <div className="ms-auto flex items-center gap-1.5 md:hidden">
            <CurrencySelector className="w-[4.5rem]" />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative z-[91] flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border-2 border-navy bg-white text-navy shadow-sm transition-colors hover:bg-[var(--color-paper)] dark:border-gold-light dark:bg-navy dark:text-gold-light dark:hover:bg-navy-soft"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="aurix-mobile-nav"
            >
              <span className="sr-only">Toggle menu</span>
              {open ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 7h14M5 12h14M5 17h14"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      {mobileNav}
    </>
  );
}
