"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { Eyebrow } from "@/components/Eyebrow";
import { PageHero } from "@/components/PageHero";
import { submitInquiry } from "@/lib/inquiry-api";
import { useGoldService } from "@/lib/gold-service/store";
import type { CountryCode, PartnerType } from "@/lib/gold-service/types";

const COUNTRIES: CountryCode[] = ["SA", "EG", "KW", "AE", "QA"];
const TYPES: PartnerType[] = ["jewelry", "bullion", "exchange", "souk", "chain", "agent"];

export default function PartnerWithUsPage() {
  const gs = useGoldService();
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [country, setCountry] = useState<CountryCode>("SA");
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState<PartnerType>("jewelry");
  const [yearsOperating, setYearsOperating] = useState("");
  const [hasVault, setHasVault] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [monthlyVolume, setMonthlyVolume] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!businessName.trim() || !contactName.trim() || !contactEmail.trim()) {
      setError("Business name, contact name, and email are required.");
      return;
    }
    setBusy(true);
    try {
      gs.submitApplication({
        businessName: businessName.trim(),
        registrationNumber: registrationNumber.trim(),
        country,
        city: city.trim(),
        businessType,
        yearsOperating: yearsOperating.trim(),
        hasVault,
        hasInsurance,
        monthlyVolume: monthlyVolume.trim(),
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        message: message.trim(),
      });
      await submitInquiry({
        kind: "partner",
        name: contactName.trim(),
        email: contactEmail.trim(),
        organization: businessName.trim(),
        role: businessType,
        vertical: "partners",
        message: [
          `Partner application (Gold as a Service)`,
          `Country: ${country}, City: ${city}`,
          `Reg: ${registrationNumber}`,
          `Years: ${yearsOperating}, Volume: ${monthlyVolume}`,
          `Vault: ${hasVault}, Insurance: ${hasInsurance}`,
          `Phone: ${contactPhone}`,
          message.trim(),
        ]
          .filter(Boolean)
          .join("\n"),
      });
      setSubmitted(true);
    } catch {
      setError("Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Partner with AURIX"
        title="Turn your store into a gold delivery point"
        description="Jewelry, bullion, and exchange businesses across Saudi Arabia, Egypt, Kuwait, UAE, and Qatar can apply to become pickup and delivery partners. Applications are reviewed offline — listing as a prospect is not a signed partnership."
      />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-16">
        <Container className="max-w-3xl">
          <Eyebrow>Why partner</Eyebrow>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-heading">
            Commission on every practice handoff — live rails when certified
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            <li>Serve remittance-style gold pickup and delivery for AURIX customers.</li>
            <li>Transparent fee share rules; partner panel for redeem and inventory.</li>
            <li>No claim of live settlement until corridor flags and licensing are ready.</li>
          </ul>
          <p className="mt-6 text-sm text-muted">
            Browse the{" "}
            <Link href="/partners/" className="font-semibold text-gold-dark hover:underline">
              store locator
            </Link>{" "}
            to see how prospects appear publicly.
          </p>
        </Container>
      </section>

      <section className="bg-[var(--color-paper)] py-16" id="apply">
        <Container className="max-w-2xl">
          <Eyebrow>Application</Eyebrow>
          <h2 className="mt-4 text-2xl font-extrabold text-heading">Apply to partner</h2>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-sm">
              <p className="font-bold text-heading">Application received</p>
              <p className="mt-2 text-muted">
                We saved your application locally and mirrored it as a partner inquiry. Our team will
                follow up at the email you provided. This is not yet an approved partnership.
              </p>
              <Link href="/partner/" className="mt-4 inline-block font-bold text-navy underline dark:text-gold-light">
                Preview partner panel →
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              {error ? (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              ) : null}
              <label className="block text-sm">
                <span className="font-semibold">Business name</span>
                <input
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold">Registration number</span>
                <input
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-semibold">Country</span>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as CountryCode)}
                    className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">City</span>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-semibold">Business type</span>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as PartnerType)}
                    className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">Years operating</span>
                  <input
                    value={yearsOperating}
                    onChange={(e) => setYearsOperating(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-semibold">Estimated monthly gold volume</span>
                <input
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(e.target.value)}
                  placeholder="e.g. 2–5 kg"
                  className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                />
              </label>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={hasVault} onChange={(e) => setHasVault(e.target.checked)} />
                  Secure storage / vault
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                  />
                  Insurance
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-semibold">Contact name</span>
                <input
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-semibold">Email</span>
                  <input
                    required
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">Phone</span>
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-semibold">Message</span>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-[var(--color-navy)] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {busy ? "Submitting…" : "Submit application"}
              </button>
            </form>
          )}
        </Container>
      </section>

      <CtaBand
        title="Already exploring the locator?"
        description="See public prospect locations, or try a practice send."
        primaryHref="/partners/"
        primaryLabel="Store locator"
        secondaryHref="/send/"
        secondaryLabel="Send gold"
      />
    </>
  );
}
