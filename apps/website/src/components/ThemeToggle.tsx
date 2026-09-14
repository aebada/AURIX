"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  THEMES,
  applyTheme,
  getThemeMeta,
  resolveTheme,
  type ThemeId,
  THEME_STORAGE_KEY,
} from "@/lib/themes";

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="9" cy="10" r="1.35" fill="currentColor" />
      <circle cx="13.5" cy="8.5" r="1.35" fill="currentColor" />
      <circle cx="15" cy="12.5" r="1.35" fill="currentColor" />
      <circle cx="11" cy="14.5" r="1.35" fill="currentColor" />
    </svg>
  );
}

function ThemeSwatch({ colors }: { colors: [string, string, string] }) {
  return (
    <span className="flex h-4 w-4 shrink-0 overflow-hidden rounded-full border border-[var(--color-line)]" aria-hidden>
      <span className="h-full w-1/3" style={{ background: colors[0] }} />
      <span className="h-full w-1/3" style={{ background: colors[1] }} />
      <span className="h-full w-1/3" style={{ background: colors[2] }} />
    </span>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeId | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const fromAttr = document.documentElement.getAttribute("data-theme");
    setTheme(resolveTheme(fromAttr || stored));
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!theme) {
    return <span className={`inline-block h-9 w-9 ${className}`} aria-hidden />;
  }

  const current = getThemeMeta(theme);

  function select(next: ThemeId) {
    applyTheme(next);
    setTheme(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Theme: ${current.label}. Change theme`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-navy bg-white text-navy shadow-sm transition-colors hover:bg-[var(--color-paper)] dark:border-gold-light dark:bg-navy dark:text-gold-light dark:hover:bg-navy-soft"
        title={current.label}
      >
        <PaletteIcon />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="Color theme"
          className="absolute end-0 top-[calc(100%+0.4rem)] z-[70] w-52 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] py-1.5 shadow-[0_16px_40px_-20px_var(--hover-lift-shadow)]"
        >
          {THEMES.map((t) => {
            const selected = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => select(t.id)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                  selected
                    ? "bg-[var(--color-paper)] text-heading"
                    : "text-muted hover:bg-[var(--color-paper)] hover:text-heading"
                }`}
              >
                <ThemeSwatch colors={t.swatch} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold">{t.label}</span>
                  <span className="block truncate text-[10px] opacity-70">{t.description}</span>
                </span>
                {selected && (
                  <svg viewBox="0 0 16 16" width="14" height="14" className="shrink-0 text-gold" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M6.5 11.5L3 8l1.2-1.2 2.3 2.3 5.3-5.3L13 5l-6.5 6.5z"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
