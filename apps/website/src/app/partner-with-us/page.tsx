"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { useGoldService } from "@/lib/gold-service/store";
import { submitInquiry } from "@/lib/inquiry-api";
import type { CountryCode, PartnerType } from "@/lib/gold-service/types";

const COUNTRIES: CountryCode[] = ["SA", "EG", "KW", "AE", "QA"];
const TYPES: PartnerType[] = ["jewelry", "bullion", "exchange", "chain", "agent"];

export default function PartnerWithUsPage() {
  const gs = useGoldService();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    registrationNumber: "",
    country: "SA" as CountryCode,
    city: "",
    businessType: "jewelry" as PartnerType,
    yearsOperating: "",
    hasVault: false,
    hasInsurance: false,
    monthlyVolume: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    message: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName || !form.contactEmail || !form.contactName) return;
    setBusy(true);
    gs.submitApplication({ ...form });
    await submitInquiry({
      kind: "partner",
      name: form.contactName,
      email: form.contactEmail,
      organization: form.businessName,
      role: form.businessType,
      vertical: "partners",
      message: [
        `Partner application`,
        `Country: ${form.country} / ${form.city}`,
        `Reg: ${form.registrationNumber}`,
        `Years: ${form.yearsOperating}`,
        `Vault: ${form.hasVault} Insurance: ${form.hasInsurance}`,
        `Volume: ${form.monthlyVolume}`,
        `Phone: ${form.contactPhone}`,
        form.message,
      ].join("\n"),
    });
    setBusy(false);
    setDone(true);
  }

  return (
    <>
      <PageHero
        eyebrow="Partner with AURIX"
        title="Offer gold pickup & redemption at your store"
        description="Join the Gold as a Service network across Saudi Arabia, Egypt, Kuwait, UAE, and Qatar. Zero setup fee framing for prospects — commission is configurable per corridor. Listing you as a prospect is not a signed commercial agreement."
      />

      <section className="border-b border-[var(--color-line)] py-12">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-muted">
            <h2 className="text-xl font-extrabold text-heading">What you get</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Appear in the public store locator once approved</li>
              <li>Partner Panel for counter redemption, inventory, and earnings</li>
              <li>Commission on completed redemptions (flat + share of fee)</li>
              <li>Corridor-by-corridor activation after licensing — not overnight “all countries”</li>
            </ul>
            <p>
              Requirements: valid business registration, on-site security/insurance for physical
              metal, and willingness to verify recipient government ID.
            </p>
            <Link href="/partners/" className="font-semibold text-gold-dark underline">
              See current prospect locations →
            </Link>
          </div>

          <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
            {done ? (
              <div className="space-y-3 text-sm">
                <h3 className="text-lg font-extrabold text-heading">Application received</h3>
                <p className="text-muted">
                  We will review and email you at every status change. You can also open the
                  Partner Panel demo meanwhile.
                </p>
                <Link
                  href="/partner/"
                  className="inline-block rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-bold text-white"
                >
                  Open Partner Panel
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <h3 className="text-lg font-extrabold text-heading">Apply</h3>
                {(
                  [
                    ["businessName", "Business name", "text"],
                    ["registrationNumber", "Registration number", "text"],
                    ["city", "City", "text"],
                    ["yearsOperating", "Years operating", "text"],
                    ["monthlyVolume", "Est. monthly gold volume", "text"],
                    ["contactName", "Contact person", "text"],
                    ["contactEmail", "Contact email", "email"],
                    ["contactPhone", "Phone", "tel"],
                  ] as const
                ).map(([key, label, type]) => (
                  <label key={key} className="block text-xs font-semibold text-muted">
                    {label}
                    <input
                      required={["businessName", "contactName", "contactEmail"].includes(key)}
                      type={type}
                      className="mt-1 w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm text-ink"
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </label>
                ))}
                <label className="block text-xs font-semibold text-muted">
                  Country
                  <select
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value as CountryCode })
                    }
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-muted">
                  Business type
                  <select
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                    value={form.businessType}
                    onChange={(e) =>
                      setForm({ ...form, businessType: e.target.value as PartnerType })
                    }
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.hasVault}
                    onChange={(e) => setForm({ ...form, hasVault: e.target.checked })}
                  />
                  On-site safe / vault
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.hasInsurance}
                    onChange={(e) => setForm({ ...form, hasInsurance: e.target.checked })}
                  />
                  Insurance certificate
                </label>
                <textarea
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-[var(--color-navy)] py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {busy ? "Submitting…" : "Submit application"}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Already applied?"
        description="Use the Partner Panel to practice redemptions while certification is in progress."
        primaryHref="/partner/"
        primaryLabel="Partner Panel"
        secondaryHref="/partners/"
        secondaryLabel="Store locator"
      />
    </>
  );
}
