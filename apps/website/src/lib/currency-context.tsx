"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";
import { CURRENCIES, type Currency } from "./currencies";

const STORAGE_KEY = "aurix-currency";
const CHANGE_EVENT = "aurix-currency-change";
const DEFAULT_CODE = "USD";

function readCode(): string {
  return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_CODE;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function writeCode(code: string) {
  window.localStorage.setItem(STORAGE_KEY, code);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function getServerSnapshot(): string {
  return DEFAULT_CODE;
}

interface CurrencyContextValue {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const code = useSyncExternalStore(subscribe, readCode, getServerSnapshot);
  const currency = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
  const setCurrencyCode = useCallback((c: string) => writeCode(c), []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
