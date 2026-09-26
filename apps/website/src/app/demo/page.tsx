"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { CtaBand } from "@/components/CtaBand";
import { DemoPlayer } from "@/components/DemoPlayer";
import { AuthNavLink } from "@/components/AuthNavLink";
import { AUTH_REGISTER_HREF } from "@/lib/auth-urls";
import { useLanguage } from "@/lib/i18n/language-context";

type DemoMode = "auto" | "full";

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
    href: "/app/business/?tab=payroll",
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

const FULL_TEST_ENVS = [
  {
    href: "/app/?tour=1",
    tag: "B2C",
    title: "Personal practice app",
    body: "Full multi-wallet shell — balances, trade, pay, vouchers, family. Mock balances only.",
  },
  {
    href: "/app/business/?tab=payroll",
    tag: "B2B",
    title: "Business + metal salary",
    body: "Employers set salary splits (fiat / gold / silver) and run practice payroll for employees.",
  },
  {
    href: "/send/",
    tag: "B2B2C",
    title: "Send gold corridor",
    body: "Cross-border practice send → track → partner redeem. Settlement stays gated.",
  },
  {
    href: "/partner/",
    tag: "Partner",
    title: "Partner panel",
    body: "Inventory, redeem codes, and earnings — practice partner operations.",
  },
];

export default function DemoPage() {
  const { t } = useLanguage();
  const p = t.pages.demo;
  const [mode, setMode] = useState<DemoMode>("auto");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("env") === "full" || params.get("mode") === "full") {
      setMode("full");
    }
  }, []);

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

          <div
            role="tablist"
            aria-label="Demo mode"
            className="mt-8 inline-flex flex-wrap gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] p-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "auto"}
              onClick={() => setMode("auto")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                mode === "auto"
                  ? "bg-navy text-white shadow-md"
                  : "text-muted hover:text-heading"
              }`}
            >
              Auto-running demo
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "full"}
              onClick={() => setMode("full")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                mode === "full"
                  ? "bg-navy text-white shadow-md"
                  : "text-muted hover:text-heading"
              }`}
            >
              Full test environment
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {mode === "auto" ? (
              <a
                href="#walkthrough"
                className="rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl"
              >
                Watch it run
              </a>
            ) : (
              <Link
                href="/app/?tour=1"
                className="rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl"
              >
                Enter full test app
              </Link>
            )}
            <Link
              href="/app/business/?tab=payroll"
              className="rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading transition-all duration-200 hover:-translate-y-0.5 hover:border-navy hover:shadow-lg"
            >
              Metal salary payroll
            </Link>
            <AuthNavLink
              href={AUTH_REGISTER_HREF}
              className="rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading transition-all duration-200 hover:-translate-y-0.5 hover:border-navy hover:shadow-lg"
            >
              {p.ctaAccount}
            </AuthNavLink>
          </div>
        </Container>
      </section>

      {mode === "auto" && (
        <section
          id="walkthrough"
          className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-14 sm:py-20"
        >
          <Container>
            <Eyebrow>{p.walkthroughEyebrow}</Eyebrow>
            <h2 className="mt-3 max-w-2xl font-extrabold tracking-tight text-2xl text-heading sm:text-3xl">
              Self-running product walkthrough
            </h2>
            <p className="mt-3 mb-10 max-w-2xl text-sm leading-relaxed text-muted">
              Plays by itself — tap any step or phone control to take over, then
              auto-play resumes. Prefer clicking every screen yourself? Switch to
              Full test environment.
            </p>
            <DemoPlayer />
          </Container>
        </section>
      )}

      {mode === "full" && (
        <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-14 sm:py-16">
          <Container>
            <Eyebrow>Full test environment</Eyebrow>
            <h2 className="mt-3 max-w-2xl font-extrabold tracking-tight text-2xl text-heading sm:text-3xl">
              Click through the complete practice stack
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Local browser test environments with mock balances — no real money,
              no live custody. Includes metal salary payroll for employers.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {FULL_TEST_ENVS.map((env) => (
                <Link
                  key={env.href}
                  href={env.href}
                  className="group flex h-full flex-col rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-all hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-lg"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                    {env.tag}
                  </span>
                  <h3 className="mt-2 font-extrabold tracking-tight text-lg text-heading">
                    {env.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {env.body}
                  </p>
                  <span className="mt-5 text-sm font-bold text-navy dark:text-gold-light">
                    Open test env →
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-12">
              <Eyebrow>{p.flowsEyebrow}</Eyebrow>
              <h3 className="mt-3 max-w-2xl font-extrabold tracking-tight text-xl text-heading">
                {p.flowsTitle}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {p.flowsSub}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {PRACTICE_FLOWS.map((flow) => (
                  <Link
                    key={flow.href}
                    href={flow.href}
                    className="flex h-full flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-lg"
                  >
                    <h4 className="font-extrabold tracking-tight text-heading">
                      {p[flow.titleKey]}
                    </h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {p[flow.bodyKey]}
                    </p>
                    <span className="mt-4 text-sm font-bold text-navy dark:text-gold-light">
                      {p.flowsOpen} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

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
