"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import { submitInquiry, type InquiryKind, type PartnerVertical } from "@/lib/inquiry-api";

export function ContactForm() {
  const { t, locale } = useLanguage();
  const f = t.pages.contact.form;
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toLowerCase();
  const verticalParam = searchParams.get("vertical")?.toLowerCase() as PartnerVertical | null;

  const defaultRole = useMemo(() => {
    if (roleParam === "investor") return f.roles[1];
    if (roleParam === "partner") return f.roles[2];
    if (roleParam === "business") return f.roles[5] ?? f.roles[0];
    return f.roles[0];
  }, [roleParam, f.roles, locale]);

  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const role = String(data.get("role") ?? "");
    let kind: InquiryKind = "contact";
    if (roleParam === "investor" || /investor/i.test(role)) kind = "investor";
    else if (roleParam === "partner" || /partner/i.test(role)) kind = "partner";
    else if (roleParam === "business" || /business|unternehmen/i.test(role)) kind = "business";

    await submitInquiry({
      kind,
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      role,
      vertical: verticalParam ?? undefined,
      message: String(data.get("message") ?? "").trim(),
      locale,
    });
    setSubmitted(true);
    setBusy(false);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-gold/30 bg-[var(--color-surface)] p-8 text-center">
        <p className="font-extrabold tracking-tight text-xl text-heading">{f.thanksTitle}</p>
        <p className="mt-2 text-sm text-muted">{f.thanksBody}</p>
      </div>
    );
  }

  return (
    <form
      key={`${locale}-${defaultRole}`}
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-heading">
          {f.name}
          <input
            required
            type="text"
            name="name"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-heading">
          {f.email}
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
      </div>
      <label className="mt-6 block text-sm font-medium text-heading">
        {f.roleLabel}
        <select
          name="role"
          defaultValue={defaultRole}
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        >
          {f.roles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </label>
      <label className="mt-6 block text-sm font-medium text-heading">
        {f.message}
        <textarea
          required
          name="message"
          rows={5}
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="mt-8 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "…" : f.submit}
      </button>
    </form>
  );
}
