"use client";

import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

const VERTICALS = [
  {
    id: "banks",
    title: "Banks",
    body: "Open banking, account linking, and settlement visibility with licensed banking partners. AURIX is an orchestration layer — not a bank.",
    candidates: ["Plaid", "TrueLayer", "Tink", "Regional bank APIs"],
    cta: { href: "/contact?role=partner&vertical=banks", label: "Bank partnership inquiry" },
  },
  {
    id: "payments",
    title: "Payments",
    body: "Card acquiring, wallet top-ups, merchant QR/NFC acceptance concepts, and payout rails through payment processors — practice UI now, live when certified.",
    candidates: ["Stripe", "Adyen", "PayPal", "Tap Payments", "Wise"],
    cta: { href: "/app/business/", label: "Try merchant practice flows" },
  },
  {
    id: "investments",
    title: "Investments",
    body: "Brokerage and RWA-adjacent rails for future investment products. Investor relations and diligence live on /investors — no live custody claims.",
    candidates: ["Alpaca", "DriveWealth", "Interactive Brokers"],
    cta: { href: "/investors#inquiry", label: "Investor inquiry" },
  },
  {
    id: "partners",
    title: "Partners",
    body: "Vault/custody candidates, KYC/AML, market data, gift cards, and crypto liquidity — evaluated categories, not signed live integrations yet.",
    candidates: [
      "BullionVault / Malca-Amit (custody candidates)",
      "SumSub / Onfido / Veriff",
      "LBMA pricing feeds",
      "Fireblocks / exchanges",
    ],
    cta: { href: "/contact?role=partner", label: "Become a partner" },
  },
];

export default function PartnersPage() {
  const { t } = useLanguage();
  const p = t.pages.partners;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>Four partnership verticals</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading">
            Banks · Payments · Investments · Partners
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Names below are evaluation candidates — not commercial partners yet.
            Live custody and money movement stay off until certified vault and
            processor partners go live.
          </p>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {VERTICALS.map((v) => (
              <div
                key={v.id}
                id={v.id}
                className="scroll-mt-28 rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-8"
              >
                <h3 className="font-extrabold tracking-tight text-xl text-heading">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.body}</p>
                <p className="mt-6 text-xs font-bold uppercase tracking-wider text-gold-dark">
                  {p.candidates}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-ink/70">
                  {v.candidates.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
                <Link
                  href={v.cta.href}
                  className="mt-6 inline-flex text-sm font-bold text-navy hover:underline dark:text-gold-light"
                >
                  {v.cta.label} →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-16">
        <Container>
          <Eyebrow>{p.becomeEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-2xl text-heading">
            {p.becomeH2}
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Also explore the{" "}
            <Link href="/business" className="font-semibold text-gold-dark hover:underline">
              business
            </Link>{" "}
            and{" "}
            <Link href="/investors" className="font-semibold text-gold-dark hover:underline">
              investors
            </Link>{" "}
            pathways for institutional conversations.
          </p>
        </Container>
      </section>

      <CtaBand
        title={p.ctaTitle}
        description={p.ctaDescription}
        primaryHref="/contact?role=partner"
        primaryLabel={p.ctaPrimary}
        secondaryHref="/business"
        secondaryLabel="Business overview"
      />
    </>
  );
}
