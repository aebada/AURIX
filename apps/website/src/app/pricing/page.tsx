import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card, CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "How AURIX earns — transaction fees, buy/sell spread, and tiered subscriptions. AURIX is asset-light: it never charges for custody it doesn't provide.",
};

const tiers = [
  {
    name: "Personal",
    tagline: "Everyday saving and spending",
    features: [
      "Multi-wallet (gold, silver, fiat)",
      "Standard buy/sell spread",
      "P2P transfers, QR and NFC payments",
      "Live market data",
      "Basic AI insights",
    ],
  },
  {
    name: "Premium",
    tagline: "For active savers and investors",
    features: [
      "Everything in Personal",
      "Lower fees and better execution bands",
      "Advanced AI insights and alerts",
      "Priority support",
      "Higher transaction limits",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    tagline: "For merchants and companies",
    features: [
      "Company wallets with multi-user access",
      "Merchant payment acceptance",
      "Invoicing and business reporting",
      "API key management",
      "Dedicated onboarding support",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="We only make money when you do."
        description="AURIX is asset-light — no custody fees, no hidden storage costs. Revenue comes from transaction fees, a modest buy/sell spread, and optional subscriptions."
      />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-dark">
                Transaction Fees
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Small fees on P2P payments, transfers, and conversions.
              </p>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-dark">
                Gold &amp; Silver Spread
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                A competitive spread (indicatively around 0.5%) on the
                buy/sell price of physical metal.
              </p>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-dark">
                Lending Fees
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Service-fee-based gold-backed loans — no interest, Islamic
                finance compatible.
              </p>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-dark">
                B2B Licensing
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                API and infrastructure licensing for banks and fintechs.
              </p>
            </Card>
          </div>
          <p className="mt-8 text-xs text-muted">
            Exact rates are still being finalized alongside vendor and
            regulatory selection, and will be published here before launch.
          </p>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>Account Tiers</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">
            Plans for every kind of user
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 ${
                  tier.highlighted
                    ? "border-2 border-gold bg-[var(--color-surface)] shadow-lg shadow-gold/10"
                    : "border border-[var(--color-line)] bg-[var(--color-surface)]"
                }`}
              >
                <h3 className="font-extrabold tracking-tight text-xl text-heading">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{tier.tagline}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                  Pricing to be announced
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <CheckItem key={f}>{f}</CheckItem>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
