import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card, CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Security & Trust",
  description:
    "How AURIX protects users and reserves: proof-of-reserve, AI-driven anomaly detection, KYC/AML, and strict data-handling principles.",
};

const dataPrinciples = [
  "Never store card PANs directly",
  "Never custody user money, metals, or securities directly",
  "Never act as an unlicensed broker or custodian",
  "Always store partner transaction references",
  "Keep the internal ledger as a platform-state and entitlement view only",
  "Reconcile all balances and statuses against provider APIs",
];

const compliancePartners = ["SumSub", "Onfido", "Veriff", "Persona"];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security & Trust"
        title="Trust is measured, not promised."
        description="AURIX pairs regulated custody partners with continuous, AI-driven verification so that digital balances always match what's actually vaulted."
      />

      <section className="border-b border-[var(--color-line)] bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-navy">
                Continuous Proof-of-Reserve
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Vault partners send periodic reserve snapshots. AURIX hashes
                them cryptographically and verifies that issued balances
                never exceed vaulted reserves.
              </p>
            </Card>
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-navy">
                AI Anomaly Detection
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                AI monitors transaction patterns, reserve consistency, and
                partner reconciliation in real time to flag fraud and
                irregularities before they become losses.
              </p>
            </Card>
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-navy">
                Zero-Knowledge Verification
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Asset allocation is verified using zero-knowledge proof
                techniques, confirming reserves without exposing sensitive
                vault or customer data.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow>Identity &amp; Compliance</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-navy">
                KYC, AML, and account security
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Every account is verified through licensed identity partners
                before it can transact, with ongoing sanctions screening and
                risk scoring layered on top.
              </p>
              <ul className="mt-6 space-y-3">
                <CheckItem>Email and password authentication with WebAuthn and 2FA</CheckItem>
                <CheckItem>Document verification and facial match via KYC partners</CheckItem>
                <CheckItem>Ongoing AML and sanctions screening</CheckItem>
                <CheckItem>User risk scoring and tiered access by jurisdiction</CheckItem>
                <CheckItem>Biometric login and device trust on mobile</CheckItem>
                <CheckItem>Audit logs for all user-sensitive events</CheckItem>
              </ul>
              <p className="mt-6 text-xs uppercase tracking-wider text-muted">
                Candidate identity partners: {compliancePartners.join(", ")}
              </p>
            </div>
            <div>
              <Eyebrow>Data Principles</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-navy">
                What AURIX will never do
              </h2>
              <ul className="mt-6 space-y-4">
                {dataPrinciples.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        title="See the reserve model in detail."
        description="Read how gold and silver reserves are verified, allocated, and reconciled against every digital unit in circulation."
        primaryHref="/reserve-transparency"
        primaryLabel="Reserve Transparency"
      />
    </>
  );
}
