import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Whitepaper",
  description:
    "The AURIX whitepaper: vision, architecture, tokenization model, and AI governance.",
};

const sections = [
  {
    title: "1. Product Vision",
    body: "AURIX is a real-asset digital finance platform that lets users buy, hold, transfer, save, and spend value linked to gold and silver, while optionally connecting to fiat, crypto, and investment rails through third-party partners.",
  },
  {
    title: "2. Core Business Model",
    body: "AURIX does not hold customer cash, coins, metals, or stocks on its own balance sheet. It is a unified orchestration platform monetized through fees, spreads, subscriptions, partner commissions, and enterprise API revenue.",
  },
  {
    title: "3. Architecture",
    body: "A regulated orchestration layer, not a custodian — auth, KYC/AML orchestration, wallet ledger, partner routing, market data, payments, notifications, and risk/AI monitoring services, reconciled continuously against provider APIs.",
  },
  {
    title: "4. Gold Tokenization (BPC Standard)",
    body: "Physical deposits are verified, minted at a fixed atomic ratio (0.0001g per unit), registered to a ledger with an audit hash, and continuously checked against a hard rule: issued units never exceed vaulted grams.",
    href: "/how-it-works",
  },
  {
    title: "5. AI Governance",
    body: "AI trust orchestration replaces blockchain consensus — anomaly validation, voting, and consensus scoring generate recommendations, but irreversible governance actions always require human approval.",
    href: "/ai-governance",
  },
];

export default function WhitepaperPage() {
  return (
    <>
      <PageHero
        eyebrow="Whitepaper"
        title="Real value, made digital."
        description="A living summary of the AURIX architecture, tokenization model, and business model. This page will be superseded by a downloadable, versioned whitepaper PDF ahead of launch."
      />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="space-y-8">
            {sections.map((s) => (
              <Card key={s.title}>
                <h2 className="font-extrabold tracking-tight text-xl text-heading">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {s.body}
                </p>
                {s.href && (
                  <Link
                    href={s.href}
                    className="mt-4 inline-block text-sm font-semibold text-gold-dark hover:underline"
                  >
                    Read more &rarr;
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
