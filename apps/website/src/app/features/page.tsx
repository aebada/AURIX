import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything in the AURIX mobile app and web platform — wallets, payments, investing, savings, lending, and AI insights.",
};

const mobileGroups = [
  {
    title: "Wallets & Balances",
    items: [
      "Multi-wallet: gold, silver, fiat, and connected crypto",
      "Real-time balances and total portfolio view",
      "Pending / available / locked balance states",
    ],
  },
  {
    title: "Buy / Sell Assets",
    items: [
      "Buy and sell gold and silver via API partners",
      "Sell gold and convert directly to fiat",
      "Live prices, fees, and final value shown before confirmation",
    ],
  },
  {
    title: "Daily Payments",
    items: [
      "NFC tap-to-pay",
      "QR payments and payment request links",
      "P2P transfers by username, email, phone, or QR",
    ],
  },
  {
    title: "Save & Invest",
    items: [
      "Goal-based saving in gold and silver",
      "Auto-save and recurring purchase rules",
      "Investment tracking across gold, crypto, and stocks",
    ],
  },
  {
    title: "Save Now Buy Later",
    items: [
      "Select a product and save gradually toward it",
      "Merchant-linked saving goals",
      "Auto-purchase when the target is reached",
    ],
  },
  {
    title: "Gold-Backed Lending",
    items: [
      "Borrow against gold holdings with a visible collateral lock",
      "Islamic-finance-compatible, service-fee-based model",
      "Repayment schedule, margin alerts, and repay/close flow",
    ],
  },
  {
    title: "Market Data & AI",
    items: [
      "Live prices for gold, silver, FX, crypto, and stock watchlists",
      "Price alerts and basic charts",
      "AI spending insights, investment suggestions, and fraud alerts",
    ],
  },
  {
    title: "Security & Profile",
    items: [
      "2FA, device authentication, and biometric login",
      "KYC document upload and verification status",
      "Transaction history with filters and statement export",
    ],
  },
];

const webGroups = [
  {
    title: "Portfolio & Analytics",
    items: [
      "Full portfolio dashboard with asset allocation and performance charts",
      "Advanced trading views for larger, bulk, or multi-asset orders",
    ],
  },
  {
    title: "Business & B2B",
    items: [
      "Company wallets with multi-user access",
      "Payments, invoicing, and business reporting",
      "API key management for B2B integrations",
    ],
  },
  {
    title: "Reports & Statements",
    items: [
      "Full transaction history and downloadable statements",
      "Tax export and accounting integration",
    ],
  },
  {
    title: "Admin Portal (web only)",
    items: [
      "User management and KYC approval queue",
      "Fraud and transaction monitoring",
      "Partner/API health dashboard and revenue tracking",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Execution on mobile. Control on the web."
        description="The mobile app is where users pay, save, and invest every day. The web platform is where analytics, business tools, and administration live."
      />

      <section className="border-b border-[var(--color-line)] bg-white py-20">
        <Container>
          <Eyebrow>Mobile App — Primary Product</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-navy">
            Daily payments, wallet usage, and investing
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {mobileGroups.map((g) => (
              <div key={g.title}>
                <h3 className="text-base font-semibold text-navy">
                  {g.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {g.items.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>Web Platform — Control &amp; Intelligence</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-navy">
            Analytics, business tools, and operations
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {webGroups.map((g) => (
              <div key={g.title}>
                <h3 className="text-base font-semibold text-navy">
                  {g.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {g.items.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
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
