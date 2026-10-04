"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import { LOCALES, type Locale } from "@/lib/i18n/translations";

export function LanguageSelector({
  className = "",
  variant = "compact",
}: {
  className?: string;
  variant?: "compact" | "panel";
}) {
  const { locale, setLocale, t } = useLanguage();

  if (variant === "panel") {
    return (
      <div className={`relative z-[1] ${className}`}>
        <label htmlFor="aurix-lang-select" className="mb-2 block px-1 text-sm font-semibold text-heading">
          {t.header.language}
        </label>
        {/* Native <select>: iOS Safari ignores custom menus under overlays. */}
        <select
          id="aurix-lang-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          aria-label={t.header.language}
          className="min-h-11 w-full touch-manipulation appearance-auto rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 font-semibold text-heading focus:border-gold focus:outline-none"
          style={{ fontSize: 16 }}
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label={t.header.language}
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
