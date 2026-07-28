"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import { LOCALES, type Locale } from "@/lib/i18n/translations";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Select language"
      className={`rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold text-heading focus:border-gold focus:outline-none ${className}`}
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
