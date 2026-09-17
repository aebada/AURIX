"use client";

import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { StoreLocator } from "@/components/gold-service/StoreLocator";
import { CtaBand } from "@/components/CtaBand";

export default function PartnersLocatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Gold as a Service"
        title="Find a pickup or delivery point"
        description="Browse jewelry, bullion, and exchange locations across Saudi Arabia, Egypt, Kuwait, UAE, and Qatar. Listings are partnership prospects — not signed AURIX agents until approved. Cross-border settlement stays in certification."
      />
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-12">
        <Container>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Looking to join the network?{" "}
              <Link href="/partner-with-us" className="font-semibold text-gold-dark underline">
                Partner with us
              </Link>
            </p>
            <Link
              href="/send/"
              className="rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-bold text-white"
            >
              Send gold
            </Link>
          </div>
          <StoreLocator />
        </Container>
      </section>
      <CtaBand
        title="Own a store? Partner with AURIX."
        description="Apply to offer pickup and redemption for cross-border gold transfers. Zero assumption of a live commercial agreement until you are approved."
        primary={{ href: "/partner-with-us", label: "Apply to partner" }}
        secondary={{ href: "/business", label: "Business overview" }}
      />
    </>
  );
}
