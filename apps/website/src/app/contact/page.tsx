"use client";

import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { ContactForm } from "@/components/ContactForm";
import { useLanguage } from "@/lib/i18n/language-context";

export default function ContactPage() {
  const { t } = useLanguage();
  const p = t.pages.contact;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-12">
        <Container className="max-w-2xl">
          <p className="text-sm text-muted">
            {p.emailLabel}:{" "}
            <a
              href={`mailto:${p.email}`}
              className="font-semibold text-gold-dark hover:underline"
            >
              {p.email}
            </a>
          </p>
          <div className="mt-8">
            <Eyebrow>{p.investorEyebrow}</Eyebrow>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {p.investorBefore}{" "}
            <Link href="/investors" className="font-semibold text-gold-dark hover:underline">
              {p.investorsLink}
            </Link>{" "}
            {p.investorMid}{" "}
            <Link
              href="/contact?role=investor"
              className="font-semibold text-gold-dark hover:underline"
            >
              {p.investorJump}
            </Link>
            {p.investorAfter}
          </p>
        </Container>
      </section>
      <section className="bg-[var(--color-surface)] py-20">
        <Container className="max-w-2xl">
          <Suspense>
            <ContactForm />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
