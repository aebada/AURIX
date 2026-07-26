import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "AI & Governance",
  description:
    "AURIX replaces blockchain consensus with AI trust orchestration — anomaly validation, voting, and consensus scoring, always under human oversight.",
};

const userAi = [
  "Savings recommendations",
  "Spending and transfer anomaly alerts",
  "Price movement summaries",
  "Portfolio risk insights",
  "Asset allocation suggestions",
  "Repayment risk warnings for collateral loans",
  "Nudges for goal completion",
];

const opsAi = [
  "Suspicious transaction detection",
  "Onboarding fraud scoring",
  "Partner failure detection",
  "Reserve mismatch alerts",
  "Duplicate request detection",
  "Customer support classification",
  "Chargeback and dispute prioritization",
  "Risk segmentation by behavior",
];

export default function AiGovernancePage() {
  return (
    <>
      <PageHero
        eyebrow="AI & Governance"
        title="AI-governed, not blockchain-governed."
        description="Instead of mining, staking, or gas-fee consensus, AURIX uses AI trust orchestration to evaluate transaction legitimacy, reserve consistency, and liquidity stability in real time."
      />

      <section className="border-b border-[var(--color-line)] bg-white py-20">
        <Container>
          <Eyebrow>The AI Voting Engine</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-navy">
            Decentralized intelligence, without blockchain inefficiency
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            The AI governance layer continuously evaluates transaction
            legitimacy, fraud probability, reserve consistency, liquidity
            stability, and payment reconciliation. From this, AI agents
            generate trust scores, governance recommendations, dynamic
            limits, and reserve-balancing actions.
          </p>
          <div className="mt-10 rounded-3xl border border-gold/30 bg-[var(--color-paper)] p-8">
            <p className="text-sm font-semibold text-navy">
              A hard rule, not a suggestion
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              AI can support governance, but final authority over funds,
              allocations, reserve logic, and compliance always remains
              auditable and human-controlled. AI never autonomously executes
              irreversible governance actions without human approval.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Card>
              <Eyebrow>For Users</Eyebrow>
              <h3 className="mt-3 font-extrabold tracking-tight text-lg text-navy">
                AI features in the app
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink/75">
                {userAi.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card className="!bg-navy text-white">
              <Eyebrow tone="dark">For Operations</Eyebrow>
              <h3 className="mt-3 font-extrabold tracking-tight text-lg text-white">
                AI features behind the scenes
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/75">
                {opsAi.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
