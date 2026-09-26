"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { StoreLocator } from "@/components/gold-service/StoreLocator";
import { Money2020PartnerPipeline } from "@/components/Money2020PartnerPipeline";
import { CtaBand } from "@/components/CtaBand";

type View = "stores" | "institutional";

export default function PartnersLocatorPage() {
  const [view, setView] = useState<View>("stores");

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title={
          view === "stores"
            ? "Find a pickup or delivery point"
            : "Institutional partner pipeline"
        }
        description={
          view === "stores"
            ? "Browse jewelry, bullion, and exchange locations across Saudi Arabia, Egypt, Kuwait, UAE, and Qatar. Listings are partnership prospects — not signed AURIX agents until approved. Cross-border settlement stays in certification."
            : "Money20/20 Middle East contacts with verified public emails — banks, payments, capital, compliance, and sponsors. Outreach is profile-fitted; nothing here is a signed commercial agreement."
        }
      />
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-12">
        <Container>
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setView("stores")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold ${
                view === "stores"
                  ? "bg-[var(--color-navy)] text-white"
                  : "border border-[var(--color-line)] text-heading"
              }`}
            >
              Gold store network
            </button>
            <button
              type="button"
              onClick={() => setView("institutional")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold ${
                view === "institutional"
                  ? "bg-[var(--color-navy)] text-white"
                  : "border border-[var(--color-line)] text-heading"
              }`}
            >
              Money20/20 institutional
            </button>
          </div>

          {view === "stores" ? (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  Looking to join the network?{" "}
                  <Link
                    href="/partner-with-us"
                    className="font-semibold text-gold-dark underline"
                  >
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
            </>
          ) : (
            <Money2020PartnerPipeline />
          )}
        </Container>
      </section>
      <CtaBand
        title="Own a store or run a fintech? Partner with AURIX."
        description="Apply to offer pickup, redemption, rails, or capital collaboration. Zero assumption of a live commercial agreement until you are approved."
        primaryHref="/partner-with-us"
        primaryLabel="Apply to partner"
        secondaryHref="/business"
        secondaryLabel="Business overview"
      />
    </>
  );
}
