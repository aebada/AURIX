"use client";

import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { AuthNavLink } from "@/components/AuthNavLink";
import { AUTH_REGISTER_HREF } from "@/lib/auth-urls";
import { useLanguage } from "@/lib/i18n/language-context";

export default function DownloadPage() {
  const { t } = useLanguage();
  const p = t.pages.download;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Card className="mb-10 p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
              Desktop web app
            </p>
            <h2 className="mt-3 font-extrabold tracking-tight text-2xl text-heading">
              Multi-wallet on the web
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {p.practiceBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app/?tour=1"
                className="inline-flex rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                {p.practiceCta}
              </Link>
              <Link
                href="/demo"
                className="inline-flex rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading transition-all hover:border-navy"
              >
                {t.nav.demo}
              </Link>
            </div>
          </Card>

          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                {p.androidLabel}
              </p>
              <h2 className="mt-3 font-extrabold tracking-tight text-2xl text-heading">
                {p.androidTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.androidBody}</p>
              <a
                href="/downloads/aurix-mobile.apk"
                className="mt-8 inline-flex rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
                download
              >
                {p.androidCta}
              </a>
              <p className="mt-4 text-xs text-muted">{p.androidMeta}</p>
            </Card>

            <Card className="p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                {p.iosLabel}
              </p>
              <h2 className="mt-3 font-extrabold tracking-tight text-2xl text-heading">
                {p.iosTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.iosBody}</p>
              <AuthNavLink
                href={AUTH_REGISTER_HREF}
                className="mt-8 inline-flex rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-heading transition-all hover:border-navy"
              >
                {p.iosCta}
              </AuthNavLink>
              <p className="mt-4 text-xs text-muted">{p.iosMeta}</p>
            </Card>
          </div>

          <div className="mt-16">
            <h3 className="font-extrabold tracking-tight text-xl text-heading">{p.whatsIn}</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm leading-relaxed text-muted">
                  <span className="text-gold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-12 text-sm text-muted">
            {p.crossLinks}{" "}
            <Link href="/features" className="font-semibold text-heading hover:text-gold-dark">
              {p.linkFeatures}
            </Link>
            {" · "}
            <Link href="/how-it-works" className="font-semibold text-heading hover:text-gold-dark">
              {p.linkHow}
            </Link>
            {" · "}
            <Link href="/security" className="font-semibold text-heading hover:text-gold-dark">
              {p.linkSecurity}
            </Link>
            {" · "}
            <Link href="/about" className="font-semibold text-heading hover:text-gold-dark">
              {p.linkAbout}
            </Link>
          </p>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
