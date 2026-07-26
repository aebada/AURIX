import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The categories of licensed providers AURIX orchestrates: vaults, payments, banking, crypto, brokerage, gift cards, and compliance.",
};

const categories = [
  {
    title: "Vault Providers",
    body: "Gold and silver custody, allocation, and redemption.",
    candidates: ["BullionVault", "OneGold", "MetalPay", "Tradewind Markets"],
  },
  {
    title: "Payment Providers",
    body: "Card payments, wallet top-ups, settlements, and payouts.",
    candidates: ["Stripe", "PayPal", "Adyen", "Tap Payments", "Wise"],
  },
  {
    title: "Banking / Open Banking",
    body: "Bank linking, account verification, and transfers.",
    candidates: ["Plaid", "TrueLayer", "Tink"],
  },
  {
    title: "Crypto",
    body: "Price feed, liquidity, and wallet connections.",
    candidates: ["Binance", "Coinbase", "Kraken", "Fireblocks"],
  },
  {
    title: "Stocks & ETFs",
    body: "Investing, portfolio data, and market prices.",
    candidates: ["Alpaca", "DriveWealth", "Interactive Brokers"],
  },
  {
    title: "Gift Cards & Rewards",
    body: "Digital gift cards, merchant integrations, and rewards.",
    candidates: ["Tremendous", "Reloadly", "Tango Card", "Bitrefill"],
  },
  {
    title: "KYC & Compliance",
    body: "Identity verification, AML, and sanctions screening.",
    candidates: ["SumSub", "Onfido", "Veriff", "Persona"],
  },
  {
    title: "Market Data",
    body: "Live gold, silver, FX, and equity pricing feeds.",
    candidates: ["LBMA pricing feeds", "Refinitiv"],
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="AURIX doesn't custody assets. Licensed partners do."
        description="Every category below represents a class of regulated provider that AURIX orchestrates through secure APIs. Names listed are best-fit candidates the team is evaluating — not yet signed commercial partners."
      />

      <section className="border-b border-[var(--color-line)] bg-white py-20">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <div key={c.title}>
                <h3 className="text-base font-semibold text-navy">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {c.body}
                </p>
                <p className="mt-4 text-xs uppercase tracking-wider text-gold-dark">
                  Candidates
                </p>
                <ul className="mt-2 space-y-1 text-sm text-ink/70">
                  {c.candidates.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-16">
        <Container>
          <Eyebrow>Become a Partner</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-2xl text-navy">
            Vault operators, payment providers, and compliance partners —
            we&apos;d like to hear from you.
          </h2>
        </Container>
      </section>

      <CtaBand
        title="Explore a partnership."
        description="Reach out and our partnerships team will follow up as vendor selection opens up."
        primaryHref="/contact"
        primaryLabel="Contact Us"
      />
    </>
  );
}
