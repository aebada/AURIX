"use client";

import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card, CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { AuthNavLink } from "@/components/AuthNavLink";
import { AUTH_REGISTER_HREF } from "@/lib/auth-urls";
import { HeroShowcase } from "@/components/HeroShowcase";

const verticals = [
  {
    title: "Banks",
    body: "Open-banking style linking, settlement visibility, and institutional onboarding pathways — designed for licensed partners, not as a bank itself.",
    href: "/partners#banks",
  },
  {
    title: "Payments",
    body: "Merchant acceptance concepts (QR / NFC), bulk payouts, and company wallets for ops — practice flows today, live rails when certified.",
    href: "/app/payments/",
  },
  {
    title: "Investments",
    body: "Investor relations and product narrative for asset-linked digital money — without implying live custody or redeemable vaulted metal yet.",
    href: "/investors",
  },
  {
    title: "Partners",
    body: "Vault, KYC, market-data, and fintech partners orchestrated through APIs. Candidate vendors listed on Partners — not signed live integrations.",
    href: "/partners",
  },
];

const capabilities = [
  {
    title: "Company multi-wallets",
    body: "Separate treasury, payroll, and ops pockets in practice mode — switch contexts like a modern business neobank.",
  },
  {
    title: "Team seats & roles",
    body: "Invite finance, ops, and approvers. Control who can pay, transfer, or issue vouchers in the practice shell.",
  },
  {
    title: "Payroll & bulk payouts",
    body: "Run practice payroll transfers and staff vouchers with zero real money movement.",
  },
  {
    title: "Merchant payments",
    body: "Conceptual QR / NFC acceptance UI for merchants — labeled practice until payment processors are certified.",
  },
];

export default function BusinessPage() {
  return (
    <>
      <PageHero
        eyebrow="Business & institutions"
        title="Built for operators, banks, and partners."
        description="AURIX business accounts give companies multi-wallet treasury, team controls, merchant payment concepts, and partner pathways — in practice today. Live custody and fiat rails stay gated until certification."
      />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Why businesses choose AURIX</Eyebrow>
            <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">
              One login. Multiple company wallets. Clear control.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Switch between personal and business in seconds. Keep payroll,
              reserves, and day-to-day ops separated — with honest practice
              balances while RESERVE_LIVE remains off.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app/business/"
                className="rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white hover:opacity-90"
              >
                Open business practice app
              </Link>
              <Link
                href="/demo"
                className="rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading hover:border-navy"
              >
                Try demo hub
              </Link>
              <AuthNavLink
                href={AUTH_REGISTER_HREF}
                className="rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading hover:border-navy"
              >
                Create account
              </AuthNavLink>
              <Link
                href="/contact?role=business"
                className="rounded-full px-5 py-3.5 text-sm font-bold text-gold-dark hover:underline"
              >
                Talk to sales
              </Link>
            </div>
          </div>
          <HeroShowcase />
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>Institutional pathways</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading">
            Banks · Payments · Investments · Partners
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Four verticals for B2B growth — messaging and practice surfaces now,
            live integrations only when licensed partners are connected.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {verticals.map((v) => (
              <Link
                key={v.title}
                href={v.href}
                className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-all hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-lg"
              >
                <h3 className="font-extrabold tracking-tight text-lg text-heading">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.body}</p>
                <span className="mt-5 inline-flex text-sm font-bold text-navy dark:text-gold-light">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading">
            Everything operators need in one shell
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {capabilities.map((c) => (
              <Card key={c.title}>
                <h3 className="font-extrabold tracking-tight text-lg text-heading">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.body}</p>
              </Card>
            ))}
          </div>
          <ul className="mt-10 space-y-3">
            <CheckItem>Desktop-first console inspired by serious ops tools</CheckItem>
            <CheckItem>Practice mode to train teams with zero real money</CheckItem>
            <CheckItem>
              Reserve transparency roadmap — not live vault claims while
              RESERVE_LIVE=false
            </CheckItem>
          </ul>
        </Container>
      </section>

      <CtaBand
        title="Ready to explore business treasury?"
        description="Open the practice business app, create an account, or contact sales for a guided walkthrough. Live metal custody is coming soon — not active yet."
        primaryHref="/app/business/"
        primaryLabel="Open business app"
        secondaryHref="/contact?role=business"
        secondaryLabel="Contact sales"
      />
    </>
  );
}
