"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";

type OpsId = "wallet" | "send" | "payroll" | "partners";

function OpsPreview({ id }: { id: OpsId }) {
  if (id === "wallet") {
    return (
      <div className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light/80">
              Multi-wallet
            </p>
            <p className="mt-2 font-display text-4xl tracking-tight text-white">€12,480</p>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
            Practice
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { t: "Gold", v: "4.2 g" },
            { t: "Silver", v: "86 g" },
            { t: "Cash", v: "€820" },
          ].map((w) => (
            <div
              key={w.t}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{w.t}</p>
              <p className="mt-2 text-sm font-extrabold text-white">{w.v}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {["Pay", "Send", "Trade"].map((a) => (
            <div
              key={a}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-center text-xs font-bold text-white/90"
            >
              {a}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === "send") {
    return (
      <div className="space-y-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light/80">
          Cross-border gold
        </p>
        <p className="font-display text-2xl tracking-tight text-white">
          Send → partner pickup
        </p>
        <div className="relative h-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
          {[
            { x: "22%", y: "40%" },
            { x: "48%", y: "28%" },
            { x: "72%", y: "52%" },
          ].map((p) => (
            <span
              key={`${p.x}-${p.y}`}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-gold ring-4 ring-gold/30"
              style={{ left: p.x, top: p.y }}
            />
          ))}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <div className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-[10px] font-semibold text-white">
              Pay in AURIX
            </div>
            <div className="flex-1 rounded-lg bg-gradient-gold px-3 py-2 text-[10px] font-bold text-navy">
              Partner fulfills
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "payroll") {
    return (
      <div className="space-y-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light/80">
          Employer benefit
        </p>
        <p className="font-display text-2xl tracking-tight text-white">
          Gold Sachbezug · DE / AT
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Monthly</p>
            <p className="mt-2 font-display text-3xl text-gradient-gold">€50</p>
            <p className="mt-2 text-xs text-white/60">per employee / mo</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Annual</p>
            <p className="mt-2 font-display text-3xl text-gradient-gold">€10k</p>
            <p className="mt-2 text-xs text-white/60">lump-sum regime</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-white/55">
          Additional to salary — never a swap. Live grants gated until certification.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light/80">
        Gold as a Service
      </p>
      <p className="font-display text-2xl tracking-tight text-white">
        Store locator · Redeem panel
      </p>
      <ul className="space-y-3">
        {[
          "Jewelry & bullion partners",
          "SA · EG · KW · AE · QA corridors",
          "Commission on fulfilled pickup",
        ].map((line) => (
          <li key={line} className="flex items-start gap-3 text-sm text-white/75">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-light" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductOpsTabs() {
  const { t } = useLanguage();
  const ops = t.home.ops;
  const [active, setActive] = useState<OpsId>((ops.items[0]?.id as OpsId) || "wallet");
  const current = ops.items.find((i) => i.id === active) || ops.items[0];
  if (!current) return null;

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label={ops.eyebrow}
        className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
      >
        {ops.items.map((item) => {
          const on = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={on}
              onMouseEnter={() => setActive(item.id as OpsId)}
              onFocus={() => setActive(item.id as OpsId)}
              onClick={() => setActive(item.id as OpsId)}
              className={`rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                on
                  ? "bg-gradient-gold text-navy shadow-lg shadow-gold/20"
                  : "border border-white/15 bg-white/5 text-white/80 hover:border-gold-light/40 hover:bg-white/10"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div key={`copy-${current.id}`} className="audience-panel-in space-y-5">
          <h3 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            {current.title}
          </h3>
          <p className="max-w-md text-base leading-relaxed text-white/65">{current.body}</p>
          <ul className="space-y-2.5">
            {current.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-white/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-light" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <Link
            href={current.href}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
            {current.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div
          key={`prev-${current.id}`}
          className="audience-panel-in rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8"
        >
          <OpsPreview id={current.id as OpsId} />
        </div>
      </div>
    </div>
  );
}
