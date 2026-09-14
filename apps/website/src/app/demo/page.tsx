"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { CtaBand } from "@/components/CtaBand";
import { DemoPlayer } from "@/components/DemoPlayer";
import { AuthNavLink } from "@/components/AuthNavLink";
import { AUTH_REGISTER_HREF } from "@/lib/auth-urls";
import { useLanguage } from "@/lib/i18n/language-context";

const PRACTICE_FLOWS = [
  {
    href: "/app/?tour=1",
    titleKey: "flowTour" as const,
    bodyKey: "flowTourBody" as const,
  },
  {
    href: "/app/wallet/",
    titleKey: "flowWallet" as const,
    bodyKey: "flowWalletBody" as const,
  },
  {
    href: "/app/trade/",
    titleKey: "flowTrade" as const,
    bodyKey: "flowTradeBody" as const,
  },
  {
    href: "/app/payments/",
    titleKey: "flowPay" as const,
    bodyKey: "flowPayBody" as const,
  },
  {
    href: "/app/business/",
    titleKey: "flowBiz" as const,
    bodyKey: "flowBizBody" as const,
  },
  {
    href: "/app/family/",
    titleKey: "flowFamily" as const,
    bodyKey: "flowFamilyBody" as const,
  },
  {
    href: "/app/vouchers/",
    titleKey: "flowVouchers" as const,
    bodyKey: "flowVouchersBody" as const,
  },
  {
    href: "/app/markets/",
    titleKey: "flowMarkets" as const,
    bodyKey: "flowMarketsBody" as const,
  },
];

export default function DemoPage() {
  const { t } = useLanguage();
  const p = t.pages.demo;

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          aria-hidden
          style={{
            background:
              "radial-gradient(55% 50% at 90% 0%, rgba(227,172,76,0.12), transparent 55%), radial-gradient(40% 40% at 0% 100%, rgba(18,22,44,0.06), transparent 50%)",
          }}
        />
        <Container className="relative py-14 sm:py-20">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-extrabold tracking-tight text-4xl leading-[1.05] text-heading sm:text-5xl lg:text-6xl">
            {p.titleLine1}
            <br />
            <span className="text-gradient-gold">{p.titleLine2}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{p.sub}</p>
          <p className="mt-4 max-w-2xl rounded-xl border border-amber-500/25 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
            {p.guardrail}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app/?tour=1"
              className="rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl"
            >
              {p.ctaPractice}
            </Link>
            <Link
              href="/app/business/"
              className="rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading transition-all duration-200 hover:-translate-y-0.5 hover:border-navy hover:shadow-lg"
            >
              {p.ctaBusiness}
            </Link>
            <AuthNavLink
              href={AUTH_REGISTER_HREF}
              className="rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading transition-all duration-200 hover:-translate-y-0.5 hover:border-navy hover:shadow-lg"
            >
              {p.ctaAccount}
            </AuthNavLink>
            <Link
              href="/download"
              className="rounded-full px-5 py-3.5 text-sm font-bold text-gold-dark underline-offset-4 hover:underline"
            >
              {p.ctaDownload}
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-14 sm:py-16">
        <Container>
          <Eyebrow>{p.flowsEyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-extrabold tracking-tight text-2xl text-heading sm:text-3xl">
            {p.flowsTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {p.flowsSub}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRACTICE_FLOWS.map((flow) => (
              <Link
                key={flow.href}
                href={flow.href}
                className="flex h-full flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-lg"
              >
                <h3 className="font-extrabold tracking-tight text-heading">
                  {p[flow.titleKey]}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {p[flow.bodyKey]}
                </p>
                <span className="mt-4 text-sm font-bold text-navy dark:text-gold-light">
                  {p.flowsOpen} →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-14 sm:py-20">
        <Container>
          <Eyebrow>{p.walkthroughEyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-extrabold tracking-tight text-2xl text-heading sm:text-3xl">
            {p.walkthroughTitle}
          </h2>
          <p className="mt-3 mb-10 max-w-2xl text-sm leading-relaxed text-muted">
            {p.walkthroughSub}
          </p>
          <DemoPlayer />
        </Container>
      </section>

      <CtaBand
        title={p.bandTitle}
        description={p.bandDescription}
        primaryHref="/app/?tour=1"
        primaryLabel={p.ctaPractice}
        secondaryHref="/download"
        secondaryLabel={p.bandSecondary}
      />
    </>
  );
}
