"use client";

import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "./nav-links";
import { AppStoreBadges } from "./AppStoreBadges";
import { useLanguage } from "@/lib/i18n/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-navy text-white/70">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/brand/aurix-mark.png"
                alt=""
                width={28}
                height={26}
                className="h-7 w-auto"
              />
              <span className="font-extrabold tracking-tight text-lg text-white">
                AURIX
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t.footer.tagline}
            </p>
            <p className="mt-6 text-xs uppercase tracking-wider text-white/40">
              {t.footer.disclaimer}
            </p>
            <div className="mt-6">
              <AppStoreBadges variant="dark" />
            </div>
          </div>

          {(Object.entries(footerLinks) as [keyof typeof footerLinks, (typeof footerLinks)[keyof typeof footerLinks]][]).map(
            ([section, links]) => (
              <div key={section}>
                <h3 className="text-sm font-semibold text-white">{t.footer.sections[section]}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-gold-light"
                      >
                        {t.nav[link.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
          <p>{t.footer.tagline2}</p>
        </div>
      </div>
    </footer>
  );
}
