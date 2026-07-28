"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { dictionaries, LOCALES, type Locale, type Dictionary } from "./translations";

const STORAGE_KEY = "aurix-lang";
const CHANGE_EVENT = "aurix-lang-change";
const DEFAULT_LOCALE: Locale = "en";

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "de" || value === "ar";
}

function readLocale(): Locale {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function writeLocale(locale: Locale) {
  window.localStorage.setItem(STORAGE_KEY, locale);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, getServerSnapshot);
  const dir = LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";
  const setLocale = useCallback((l: Locale) => writeLocale(l), []);

  // Keep <html lang>/<html dir> in sync for accessibility and RTL layout —
  // the inline bootstrap script in layout.tsx sets these before first
  // paint, this effect keeps them correct when the user switches language
  // client-side.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <LanguageContext.Provider value={{ locale, dir, t: dictionaries[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
