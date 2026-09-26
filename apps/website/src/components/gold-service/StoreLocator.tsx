"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useGoldService } from "@/lib/gold-service/store";
import type { CountryCode, PartnerLocation } from "@/lib/gold-service/types";
import { PartnerMap } from "./PartnerMap";

const COUNTRIES: { code: CountryCode | ""; label: string }[] = [
  { code: "", label: "All countries" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "EG", label: "Egypt" },
  { code: "KW", label: "Kuwait" },
  { code: "AE", label: "UAE" },
  { code: "QA", label: "Qatar" },
];

function statusBadge(loc: PartnerLocation) {
  if (loc.verified || loc.status === "approved")
    return "Verified partner";
  if (loc.status === "invited") return "Invite sent";
  return "Prospect";
}

export function StoreLocator({
  embed = false,
  fixedCountry,
  onSelect,
}: {
  embed?: boolean;
  fixedCountry?: CountryCode;
  onSelect?: (loc: PartnerLocation) => void;
}) {
  const { filterLocations } = useGoldService();
  const [country, setCountry] = useState<CountryCode | "">(fixedCountry || "");
  const [q, setQ] = useState("");
  const [pickup, setPickup] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [gold, setGold] = useState(false);
  const [selected, setSelected] = useState<PartnerLocation | null>(null);

  const results = useMemo(
    () =>
      filterLocations({
        country: fixedCountry || country,
        q,
        pickup: pickup || undefined,
        delivery: delivery || undefined,
        gold: gold || undefined,
      }),
    [filterLocations, country, fixedCountry, q, pickup, delivery, gold],
  );

  const mapped = results.filter((l) => l.lat != null && l.lng != null);

  return (
    <div className={embed ? "space-y-4" : "space-y-6"}>
      <div className="flex flex-wrap gap-2">
        {!fixedCountry &&
          COUNTRIES.map((c) => (
            <button
              key={c.code || "all"}
              type="button"
              onClick={() => setCountry(c.code)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                country === c.code
                  ? "bg-[var(--color-navy)] text-white"
                  : "border border-[var(--color-line)] text-muted"
              }`}
            >
              {c.label}
            </button>
          ))}
        {(
          [
            ["Pickup", pickup, setPickup],
            ["Delivery", delivery, setDelivery],
            ["Gold", gold, setGold],
          ] as const
        ).map(([label, on, set]) => (
          <button
            key={label}
            type="button"
            onClick={() => set(!on)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              on
                ? "bg-gold-dark/15 text-gold-dark"
                : "border border-[var(--color-line)] text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search city, name, or address"
        className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-sm"
      />

      <div className={`grid gap-4 ${embed ? "" : "lg:grid-cols-[1.1fr_1fr]"}`}>
        {!embed && (
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)]">
            <p className="absolute left-3 top-3 z-[500] rounded-full bg-[var(--color-paper)]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted shadow-sm">
              Map · {mapped.length} pinned
            </p>
            <PartnerMap
              locations={results}
              selectedId={selected?.id}
              onSelect={setSelected}
              className="absolute inset-0 min-h-[320px]"
            />
            {results.length === 0 && (
              <div className="absolute inset-0 z-[400] flex items-center justify-center bg-[var(--color-surface)]/90 p-8 text-sm text-muted">
                <p>
                  Not available in this filter yet.{" "}
                  <Link href="/partner-with-us" className="text-gold-dark underline">
                    Partner with us
                  </Link>{" "}
                  or{" "}
                  <Link href="/waitlist/" className="text-gold-dark underline">
                    join the waitlist
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        )}

        <div className="max-h-[520px] space-y-3 overflow-y-auto">
          {results.map((l) => (
            <div
              key={l.id}
              className={`rounded-2xl border p-4 ${
                selected?.id === l.id
                  ? "border-gold-dark bg-gold-dark/5"
                  : "border-[var(--color-line)] bg-[var(--color-paper)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold text-heading">{l.name}</div>
                  <div className="mt-1 text-xs text-muted">
                    {l.city}, {l.country} · {l.type}
                  </div>
                  <div className="mt-2 text-sm text-ink/80">{l.address}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-muted">
                      {statusBadge(l)}
                    </span>
                    {l.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right text-xs text-muted">
                  {l.rating.toFixed(1)}★
                  <div>{l.yearsActive}+ yrs</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(l)}
                    className="rounded-full bg-[var(--color-navy)] px-4 py-2 text-xs font-bold text-white"
                  >
                    Set as delivery point
                  </button>
                ) : (
                  <Link
                    href={`/send/?locationId=${encodeURIComponent(l.id)}&country=${l.country}`}
                    className="rounded-full bg-[var(--color-navy)] px-4 py-2 text-xs font-bold text-white"
                  >
                    Set as delivery point
                  </Link>
                )}
                {l.website ? (
                  <a
                    href={l.website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-semibold text-muted"
                  >
                    Website
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
