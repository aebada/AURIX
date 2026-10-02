"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import {
  submitPayrollEmployerApplication,
  type PayrollEmployerCountry,
} from "@/lib/payroll-employer-api";
import { useLanguage } from "@/lib/i18n/language-context";

export default function PayrollEmployerApplyPage() {
  const { t, locale } = useLanguage();
  const a = t.pages.payroll.apply;
  const p = t.pages.payroll;

  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [appId, setAppId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    companyLegalName: "",
    registrationNumber: "",
    country: "DE" as PayrollEmployerCountry,
    address: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    employeeCount: "",
    industry: "",
    additionalityAttested: false,
    privacyConsent: false,
    website: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.additionalityAttested || !form.privacyConsent) {
      setError(a.errorGeneric);
      return;
    }
    setBusy(true);
    const result = await submitPayrollEmployerApplication({
      ...form,
      locale,
    });
    setBusy(false);
    if (!result.ok || !result.persistedRemote) {
      setError(
        result.error === "network" ? a.errorNetwork : a.errorGeneric,
      );
      return;
    }
    setAppId(result.id);
    setDone(true);
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-navy-deep text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 0%, var(--glow-gold), transparent 55%), linear-gradient(160deg, #070a16, #12162c)",
          }}
          aria-hidden
        />
        <Container className="relative py-16 sm:py-20">
          <Reveal>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-gold-light">
              {a.eyebrow}
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              {a.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
              {a.description}
            </p>
          </Reveal>
        </Container>
      </section>

      <div className="sticky top-0 z-20 border-b border-amber-500/25 bg-amber-500/15 px-4 py-2.5 text-center text-xs leading-relaxed text-amber-950 backdrop-blur-md dark:text-amber-100">
        {p.taxDisclaimer}
      </div>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-14 sm:py-20">
        <Container className="max-w-2xl">
          <Reveal>
            {done ? (
              <div className="rounded-2xl border border-gold/30 bg-[var(--color-paper)] p-8 text-center sm:p-10">
                <p className="font-display text-2xl tracking-tight text-heading">
                  {a.successTitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {a.successBody}
                </p>
                {appId && appId !== "honeypot" ? (
                  <p className="mt-4 text-xs font-semibold text-muted">
                    {a.successId}:{" "}
                    <span className="font-mono text-heading">{appId}</span>
                  </p>
                ) : null}
                <Link
                  href="/for-business/payroll/"
                  className="mt-8 inline-flex rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
                >
                  {a.backToPayroll}
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                {(
                  [
                    ["companyLegalName", a.companyLegalName, "text", true],
                    ["registrationNumber", a.registrationNumber, "text", true],
                    ["address", a.address, "text", true],
                    ["contactName", a.contactName, "text", true],
                    ["contactEmail", a.contactEmail, "email", true],
                    ["contactPhone", a.contactPhone, "tel", true],
                    ["employeeCount", a.employeeCount, "text", true],
                    ["industry", a.industry, "text", false],
                  ] as const
                ).map(([key, label, type, required]) => (
                  <label key={key} className="block text-sm font-medium text-heading">
                    {label}
                    {key === "registrationNumber" ? (
                      <span className="mt-0.5 block text-xs font-normal text-muted">
                        {a.registrationHint}
                      </span>
                    ) : null}
                    <input
                      required={required}
                      type={type}
                      className="mt-2 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2.5 text-sm"
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                    />
                  </label>
                ))}

                <label className="block text-sm font-medium text-heading">
                  {a.country}
                  <select
                    required
                    className="mt-2 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2.5 text-sm"
                    value={form.country}
                    onChange={(e) =>
                      set("country", e.target.value as PayrollEmployerCountry)
                    }
                  >
                    <option value="DE">{a.countryDE}</option>
                    <option value="AT">{a.countryAT}</option>
                  </select>
                </label>

                <fieldset className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
                  <legend className="px-1 text-sm font-bold text-heading">
                    {a.additionalityLabel}
                  </legend>
                  <label className="mt-3 flex gap-3 text-sm leading-relaxed text-muted">
                    <input
                      required
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-gold)]"
                      checked={form.additionalityAttested}
                      onChange={(e) => set("additionalityAttested", e.target.checked)}
                    />
                    <span>{a.additionalityText}</span>
                  </label>
                </fieldset>

                <label className="flex gap-3 text-sm leading-relaxed text-muted">
                  <input
                    required
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-gold)]"
                    checked={form.privacyConsent}
                    onChange={(e) => set("privacyConsent", e.target.checked)}
                  />
                  <span>{a.privacyLabel}</span>
                </label>

                {error ? (
                  <p className="text-sm font-medium text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-navy py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-10"
                >
                  {busy ? a.submitting : a.submit}
                </button>
              </form>
            )}
          </Reveal>
        </Container>
      </section>
    </>
  );
}
