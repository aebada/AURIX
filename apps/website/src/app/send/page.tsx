"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { StoreLocator } from "@/components/gold-service/StoreLocator";
import { estimateFees, useGoldService } from "@/lib/gold-service/store";
import { useLanguage } from "@/lib/i18n/language-context";
import type {
  CountryCode,
  Fulfillment,
  MetalType,
  PartnerLocation,
} from "@/lib/gold-service/types";

const ORIGINS: CountryCode[] = ["SA", "AE", "KW", "QA", "EG"];
const DESTS: CountryCode[] = ["EG", "SA", "AE", "KW", "QA"];

function SendWizard() {
  const { t } = useLanguage();
  const p = t.pages.send;
  const router = useRouter();
  const params = useSearchParams();
  const gs = useGoldService();
  const preLoc = params.get("locationId") || "";
  const preCountry = (params.get("country") as CountryCode) || "EG";

  const [step, setStep] = useState(1);
  const [metal, setMetal] = useState<MetalType>("gold");
  const [grams, setGrams] = useState(5);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [origin, setOrigin] = useState<CountryCode>("SA");
  const [dest, setDest] = useState<CountryCode>(preCountry);
  const [location, setLocation] = useState<PartnerLocation | null>(
    () => (preLoc ? gs.getLocation(preLoc) || null : null),
  );
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [idType, setIdType] = useState("National ID / passport");
  const [relationship, setRelationship] = useState("Family");

  const fees = useMemo(
    () => estimateFees(metal, grams, dest, gs.state.commissionRules),
    [metal, grams, dest, gs.state.commissionRules],
  );
  const corridor = `${origin}-${dest}`;
  const corridorLive = Boolean(gs.state.crossBorderLive[corridor]);

  function confirm() {
    if (!location || !recipientName.trim() || !recipientPhone.trim()) return;
    const xfer = gs.createTransfer({
      metal,
      grams,
      fulfillment,
      originCountry: origin,
      destinationCountry: dest,
      locationId: location.id,
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      recipientEmail: recipientEmail.trim(),
      recipientIdType: idType,
      relationship,
    });
    setTimeout(() => gs.advanceTransfer(xfer.id, "notified"), 400);
    router.push(`/track/?id=${encodeURIComponent(xfer.id)}`);
  }

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />
      <section className="border-b border-[var(--color-line)] py-10">
        <Container className="max-w-3xl">
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
            {p.banner}
            {!corridorLive
              ? ` · ${corridor} ${p.bannerPending}`
              : ` · ${p.bannerLive}`}
            . {p.bannerId}
          </div>

          <div className="mb-8 flex gap-2 text-xs font-bold uppercase tracking-wider text-muted">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`rounded-full px-3 py-1 ${
                  step === n
                    ? "bg-[var(--color-navy)] text-white"
                    : "bg-[var(--color-surface)]"
                }`}
              >
                {n}
              </span>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-heading">{p.amountTitle}</h2>
              <div className="flex gap-2">
                {(["gold", "silver"] as MetalType[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMetal(m)}
                    className={`rounded-xl px-5 py-3 text-sm font-bold capitalize ${
                      metal === m
                        ? "bg-gold-dark text-white"
                        : "border border-[var(--color-line)]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 5, 10].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrams(g)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      grams === g
                        ? "bg-[var(--color-navy)] text-white"
                        : "border border-[var(--color-line)]"
                    }`}
                  >
                    {g} g
                  </button>
                ))}
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={grams}
                  onChange={(e) => setGrams(Number(e.target.value) || 0)}
                  className="w-28 rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
                />
              </div>
              <p className="text-sm text-muted">
                {p.practicePrice.replace("{total}", fees.total.toFixed(2))}
              </p>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full bg-[var(--color-navy)] px-6 py-3 text-sm font-bold text-white"
              >
                {p.continue}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-heading">{p.fulfillmentTitle}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["pickup", p.pickup],
                    ["delivery", p.delivery],
                  ] as const
                ).map(([id, label]) => {
                  const deliverySupported = Boolean(
                    location?.services.includes("delivery") || !location,
                  );
                  const disabled = id === "delivery" && location && !deliverySupported;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={Boolean(disabled)}
                      onClick={() => setFulfillment(id)}
                      className={`rounded-2xl border p-5 text-left ${
                        fulfillment === id
                          ? "border-gold-dark bg-gold-dark/10"
                          : "border-[var(--color-line)]"
                      } ${disabled ? "opacity-40" : ""}`}
                    >
                      <div className="font-extrabold text-heading">{label}</div>
                      {disabled ? (
                        <div className="mt-2 text-xs text-muted">{p.deliveryUnavailable}</div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="rounded-full border px-5 py-2 text-sm">
                  {p.back}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-full bg-[var(--color-navy)] px-6 py-2 text-sm font-bold text-white"
                >
                  {p.continue}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-heading">{p.destTitle}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  {p.from}
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value as CountryCode)}
                    className="mt-1 w-full rounded-xl border border-[var(--color-line)] px-3 py-2"
                  >
                    {ORIGINS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  {p.to}
                  <select
                    value={dest}
                    onChange={(e) => {
                      setDest(e.target.value as CountryCode);
                      setLocation(null);
                    }}
                    className="mt-1 w-full rounded-xl border border-[var(--color-line)] px-3 py-2"
                  >
                    {DESTS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {location ? (
                <div className="rounded-2xl border border-gold-dark/40 bg-gold-dark/5 p-4 text-sm">
                  {p.selected}: <strong>{location.name}</strong> · {location.city}
                  <button
                    type="button"
                    className="ml-3 underline"
                    onClick={() => setLocation(null)}
                  >
                    {p.change}
                  </button>
                </div>
              ) : (
                <StoreLocator
                  embed
                  fixedCountry={dest}
                  onSelect={(l) => setLocation(l)}
                />
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(2)} className="rounded-full border px-5 py-2 text-sm">
                  {p.back}
                </button>
                <button
                  type="button"
                  disabled={!location}
                  onClick={() => setStep(4)}
                  className="rounded-full bg-[var(--color-navy)] px-6 py-2 text-sm font-bold text-white disabled:opacity-40"
                >
                  {p.continue}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-heading">{p.recipientTitle}</h2>
              <p className="rounded-xl bg-[var(--color-surface)] p-3 text-sm text-muted">
                {p.recipientHint}
              </p>
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder={p.fullName}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder={p.phone}
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
              />
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder={p.email}
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder={p.idType}
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
              />
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder={p.relationship}
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(3)} className="rounded-full border px-5 py-2 text-sm">
                  {p.back}
                </button>
                <button
                  type="button"
                  disabled={!recipientName || !recipientPhone}
                  onClick={() => setStep(5)}
                  className="rounded-full bg-[var(--color-navy)] px-6 py-2 text-sm font-bold text-white disabled:opacity-40"
                >
                  {p.continue}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-heading">{p.reviewTitle}</h2>
              <ul className="space-y-2 rounded-2xl border border-[var(--color-line)] p-4 text-sm">
                <li className="flex justify-between">
                  <span>
                    {p.metalLine
                      .replace("{grams}", String(grams))
                      .replace("{metal}", metal)}
                  </span>
                  <span>€{fees.metalCost.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>{p.serviceFee}</span>
                  <span>€{fees.serviceFee.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>{p.partnerFee}</span>
                  <span>€{fees.partnerFee.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>{p.fxSpread}</span>
                  <span>€{fees.fxSpread.toFixed(2)}</span>
                </li>
                <li className="flex justify-between border-t border-[var(--color-line)] pt-2 font-extrabold">
                  <span>{p.total}</span>
                  <span>€{fees.total.toFixed(2)}</span>
                </li>
              </ul>
              <p className="text-xs text-muted">
                {location?.name} · {recipientName} · {fulfillment} · {origin}→{dest}
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(4)} className="rounded-full border px-5 py-2 text-sm">
                  {p.back}
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  className="rounded-full bg-[var(--color-navy)] px-6 py-2 text-sm font-bold text-white"
                >
                  {p.confirm}
                </button>
              </div>
            </div>
          )}

          <p className="mt-10 text-center text-xs text-muted">
            <Link href="/partners/" className="underline">
              {p.browse}
            </Link>{" "}
            ·{" "}
            <Link href="/partner-with-us/" className="underline">
              {p.becomePartner}
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}

export default function SendPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="p-10 text-sm text-muted">{t.pages.send.loading}</div>}>
      <SendWizard />
    </Suspense>
  );
}
