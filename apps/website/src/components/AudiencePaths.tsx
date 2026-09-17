"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { AuthNavLink } from "@/components/AuthNavLink";

type PathId = "b2c" | "b2b" | "b2b2c" | "investors";

function PreviewShell({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 80% 10%, var(--glow-gold-soft), transparent 55%), linear-gradient(160deg, var(--color-paper) 0%, var(--color-surface) 100%)",
        }}
        aria-hidden
      />
      <div className="relative flex items-center justify-between border-b border-[var(--color-line)] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#d4c4a8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#c9b896]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#b8a57e]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
      </div>
      <div className="relative min-h-[280px] p-5 sm:min-h-[320px] sm:p-6">{children}</div>
    </div>
  );
}

function B2CPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Multi-wallet
          </p>
          <p className="mt-1 font-extrabold tracking-tight text-3xl text-heading">
            €12,480
          </p>
        </div>
        <span className="rounded-full bg-navy px-3 py-1 text-[10px] font-bold text-white">
          Practice
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { t: "Gold", v: "4.2 g", c: "from-amber-200/80 to-amber-100/40" },
          { t: "Silver", v: "86 g", c: "from-slate-200/80 to-slate-100/40" },
          { t: "Cash", v: "€820", c: "from-sky-100/80 to-emerald-50/40" },
        ].map((w) => (
          <div
            key={w.t}
            className={`audience-float rounded-2xl border border-[var(--color-line)] bg-gradient-to-br ${w.c} p-3`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {w.t}
            </p>
            <p className="mt-2 text-sm font-extrabold text-heading">{w.v}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {["Pay", "Send", "Trade"].map((a, i) => (
          <div
            key={a}
            className="flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] py-2.5 text-center text-xs font-bold text-heading"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}

function B2BPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
            B2B · Treasury
          </p>
          <p className="mt-1 font-extrabold text-heading">Ops account</p>
        </div>
        <p className="font-extrabold text-xl text-heading">€248k</p>
      </div>
      <div className="space-y-2">
        {[
          { label: "Payroll pocket", pct: 62 },
          { label: "Merchant float", pct: 38 },
          { label: "Reserve buffer", pct: 74 },
        ].map((row, i) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>{row.label}</span>
              <span className="font-semibold text-heading">{row.pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-paper)]">
              <div
                className="audience-bar h-full rounded-full bg-navy"
                style={{
                  width: `${row.pct}%`,
                  animationDelay: `${i * 140}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
          <p className="text-[10px] font-bold uppercase text-muted">Payouts</p>
          <p className="mt-1 text-sm font-extrabold text-heading">42 pending</p>
        </div>
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
          <p className="text-[10px] font-bold uppercase text-muted">Team seats</p>
          <p className="mt-1 text-sm font-extrabold text-heading">12 active</p>
        </div>
      </div>
    </div>
  );
}

function B2B2CPreview() {
  const pins = [
    { x: "18%", y: "42%", delay: "0ms" },
    { x: "42%", y: "28%", delay: "180ms" },
    { x: "68%", y: "48%", delay: "320ms" },
    { x: "55%", y: "68%", delay: "460ms" },
    { x: "32%", y: "62%", delay: "600ms" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
            B2B2C · Partner network
          </p>
          <p className="mt-1 font-extrabold text-heading">Send → Store pickup</p>
        </div>
        <span className="rounded-full border border-gold-dark/40 bg-gold-dark/10 px-2.5 py-1 text-[10px] font-bold text-gold-dark">
          SA · EG · KW · AE · QA
        </span>
      </div>
      <div className="relative h-40 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[linear-gradient(135deg,#e8eef5_0%,#f7f4ec_55%,#eef2f7_100%)]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        {pins.map((p) => (
          <span
            key={`${p.x}-${p.y}`}
            className="audience-pin absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy ring-4 ring-navy/20"
            style={{ left: p.x, top: p.y, animationDelay: p.delay }}
          />
        ))}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2">
          <div className="flex-1 rounded-lg bg-[var(--color-paper)]/95 px-3 py-2 text-[10px] font-semibold text-heading shadow-sm">
            Sender pays in AURIX
          </div>
          <div className="flex-1 rounded-lg bg-navy px-3 py-2 text-[10px] font-semibold text-white shadow-sm">
            Partner fulfills gold
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted">
        You own the customer relationship. Partners earn on pickup & delivery —
        AURIX coordinates the corridor.
      </p>
    </div>
  );
}

function InvestorsPreview() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
          Capital · IR
        </p>
        <p className="mt-1 font-extrabold text-heading">Early-stage thesis</p>
      </div>
      <ol className="space-y-2">
        {[
          { s: "01", t: "Practice product live", d: "Wallets, pay, trade demo" },
          { s: "02", t: "Partner corridors", d: "Gold-as-a-Service network" },
          { s: "03", t: "Licensed rails", d: "Custody gated until certified" },
        ].map((m, i) => (
          <li
            key={m.s}
            className="audience-float flex items-start gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-3"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span className="font-extrabold text-gold-dark">{m.s}</span>
            <div>
              <p className="text-sm font-bold text-heading">{m.t}</p>
              <p className="text-xs text-muted">{m.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const PREVIEWS: Record<PathId, () => React.ReactNode> = {
  b2c: B2CPreview,
  b2b: B2BPreview,
  b2b2c: B2B2CPreview,
  investors: InvestorsPreview,
};

export function AudiencePaths() {
  const { t } = useLanguage();
  const h = t.home;
  const paths = h.paths;
  const [active, setActive] = useState<PathId>((paths[0]?.id as PathId) || "b2c");

  useEffect(() => {
    if (!paths.some((p) => p.id === active) && paths[0]) {
      setActive(paths[0].id as PathId);
    }
  }, [paths, active]);

  const current = paths.find((p) => p.id === active) || paths[0];
  if (!current) return null;

  const Preview = PREVIEWS[current.id as PathId] || B2CPreview;
  const Cta = current.href.startsWith("/auth/") ? AuthNavLink : Link;

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label={h.pathsEyebrow}
        className="flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-4"
      >
        {paths.map((path) => {
          const on = path.id === active;
          return (
            <button
              key={path.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(path.id as PathId)}
              className={`group relative rounded-full px-4 py-2.5 text-left transition-all duration-300 ${
                on
                  ? "bg-navy text-white shadow-lg shadow-navy/20"
                  : "border border-[var(--color-line)] bg-[var(--color-surface)] text-heading hover:-translate-y-0.5"
              }`}
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] opacity-70">
                {path.model}
              </span>
              <span className="mt-0.5 block text-sm font-extrabold">{path.title}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div key={current.id} className="audience-panel-in space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-dark/30 bg-gold-dark/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-dark">
            {current.model}
          </div>
          <h3 className="max-w-md font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
            {current.title}
          </h3>
          <p className="max-w-md text-base leading-relaxed text-muted">{current.body}</p>
          <ul className="space-y-2.5">
            {current.highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-heading">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-dark"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Cta
            href={current.href}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
          >
            {current.cta}
            <span aria-hidden>→</span>
          </Cta>
        </div>

        <div key={`preview-${current.id}`} className="audience-panel-in">
          <PreviewShell label={current.visualLabel}>
            <Preview />
          </PreviewShell>
        </div>
      </div>
    </div>
  );
}
