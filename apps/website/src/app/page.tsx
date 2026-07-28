"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card, StatCard, CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { PhoneMockup } from "@/components/PhoneMockup";
import { AppStoreBadges } from "@/components/AppStoreBadges";
import { Reveal } from "@/components/Reveal";
import { PointcoinCoin } from "@/components/PointcoinCoin";
import { LivePrices } from "@/components/LivePrices";
import { useLanguage } from "@/lib/i18n/language-context";

export default function Home() {
  const { t } = useLanguage();
  const h = t.home;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <Reveal>
            <Eyebrow>{h.eyebrowHero}</Eyebrow>
            <h1 className="mt-5 font-extrabold tracking-tight text-4xl leading-[1.05] text-heading sm:text-5xl lg:text-7xl">
              {h.h1Line1}
              <br />
              <span className="text-gradient-gold">{h.h1Line2}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              {h.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login?mode=register"
                className="rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl hover:shadow-navy/20 active:translate-y-0"
              >
                {h.ctaPrimary}
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading transition-all duration-200 hover:-translate-y-0.5 hover:border-navy hover:shadow-lg active:translate-y-0"
              >
                {h.ctaSecondary}
              </Link>
            </div>
            <div className="mt-8">
              <AppStoreBadges variant="light" />
            </div>
          </Reveal>
          <Reveal delay={150} className="flex items-center justify-center">
            <div className="relative flex w-full max-w-md items-center justify-center overflow-hidden rounded-[2.5rem] bg-navy-glow p-10 sm:p-14">
              <PhoneMockup />
            </div>
          </Reveal>
        </Container>
      </section>

      <LivePrices />

      {/* Problem */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-24">
        <Container>
          <Reveal>
            <Eyebrow>{h.problem.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
              {h.problem.h2}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 border-t border-[var(--color-line)] pt-10 sm:grid-cols-3">
            {h.problem.items.map((p, i) => (
              <Reveal key={p.number} delay={i * 100}>
                <p className="font-extrabold tracking-tight text-2xl text-gold">{p.number}</p>
                <h3 className="mt-2 text-lg font-semibold text-heading">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
          <p className="mt-14 border-t border-[var(--color-line)] pt-8 font-extrabold tracking-tight text-xl italic text-heading/80">
            &ldquo;{h.problem.quote}&rdquo;
          </p>
        </Container>
      </section>

      {/* Solution */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-24">
        <Container>
          <Reveal>
            <Eyebrow>{h.solution.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
              {h.solution.h2}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {h.solution.items.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <Card>
                  <h3 className="font-extrabold tracking-tight text-lg text-heading">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {s.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 rounded-3xl bg-navy px-8 py-6 text-center">
            <p className="font-extrabold tracking-tight text-lg text-white">
              {h.solution.formula}
            </p>
          </div>
        </Container>
      </section>

      {/* Pointcoin */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-24">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal className="order-2 flex justify-center lg:order-1">
              <PointcoinCoin className="h-64 w-64 drop-shadow-xl sm:h-80 sm:w-80" />
            </Reveal>
            <Reveal delay={100} className="order-1 lg:order-2">
              <Eyebrow>{h.pointcoin.eyebrow}</Eyebrow>
              <h2 className="mt-4 max-w-xl font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
                {h.pointcoin.h2}
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
                {h.pointcoin.body}
              </p>
              <ul className="mt-6 space-y-3">
                {h.pointcoin.checks.map((c) => (
                  <CheckItem key={c}>{c}</CheckItem>
                ))}
              </ul>
              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[var(--color-line)] pt-6">
                {h.pointcoin.facts.map((f) => (
                  <div key={f.value}>
                    <p className="font-extrabold tracking-tight text-xl text-gradient-gold sm:text-2xl">
                      {f.value}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-muted">
                      {f.label}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/whitepaper"
                className="mt-8 inline-block text-sm font-semibold text-gold-dark hover:underline"
              >
                {h.pointcoin.link}
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Platform */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-24">
        <Container>
          <Reveal>
            <Eyebrow>{h.platform.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
              {h.platform.h2}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {h.platform.groups.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <h3 className="font-extrabold tracking-tight text-lg text-heading">
                  {p.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {p.items.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Two-layer architecture */}
      <section className="border-b border-white/10 bg-navy py-24 text-white">
        <Container>
          <Reveal>
            <Eyebrow tone="dark">{h.architecture.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl sm:text-4xl">
              {h.architecture.h2}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="font-extrabold tracking-tight text-sm text-gold-light">
                {h.architecture.layer1Label}
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/70">
                {h.architecture.layer1Items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <p className="font-extrabold tracking-tight text-sm text-gold-light">
                {h.architecture.layer2Label}
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/70">
                {h.architecture.layer2Items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <p className="mt-14 border-t border-white/10 pt-8 text-xs uppercase tracking-wider text-white/40">
            {h.architecture.footer}
          </p>
        </Container>
      </section>

      {/* Market opportunity */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-24">
        <Container>
          <Reveal>
            <Eyebrow>{h.market.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
              {h.market.h2}
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {h.market.stats.map((s) => (
              <StatCard key={s.value} value={s.value} label={s.label} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Revenue */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <Eyebrow>{h.revenue.eyebrow}</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">
                {h.revenue.h2}
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                {h.revenue.body}
              </p>
            </Reveal>
            <Reveal delay={100} className="grid gap-8 sm:grid-cols-2">
              {h.revenue.streams.map((r) => (
                <div key={r.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                    {r.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">
                    {r.body}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Competitive landscape */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-24">
        <Container>
          <Reveal>
            <Eyebrow>{h.competitive.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
              {h.competitive.h2}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                {h.competitive.currentTitle}
              </h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-ink/70">
                {h.competitive.currentItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card className="border-gold/30 !bg-navy text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-light">
                {h.competitive.standardTitle}
              </h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/80">
                {h.competitive.standardItems.map((item) => (
                  <li key={item.strong}>
                    <strong className="text-white">{item.strong}</strong> {item.rest}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* Insights */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-24">
        <Container>
          <Reveal>
            <Eyebrow>{h.insights.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
              {h.insights.h2}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {h.insights.posts.map((post, i) => (
              <Reveal key={post.title} delay={i * 100}>
                <Card className="h-full">
                  <span className="inline-flex rounded-full bg-gold/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                    {post.tag}
                  </span>
                  <h3 className="mt-4 font-extrabold tracking-tight text-lg text-heading">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">
            {h.insights.note}
          </p>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
