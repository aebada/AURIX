import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "AURIX is building an AI-governed, real-asset finance platform. Meet the disciplines we're building with.",
};

const departments = [
  {
    title: "Backend",
    body: "Node.js services, Python AI services, PostgreSQL, Redis — the orchestration layer connecting every partner API.",
  },
  {
    title: "Frontend",
    body: "React for web and admin, React Native / Flutter for the primary mobile product.",
  },
  {
    title: "AI",
    body: "Fraud detection, governance scoring, risk models — the intelligence layer behind every AURIX decision.",
  },
  {
    title: "DevOps",
    body: "AWS/GCP infrastructure, CI/CD, and security across every environment.",
  },
  {
    title: "Compliance",
    body: "AML/KYC policy and legal integrations across jurisdictions.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Help build the operating system for real-value digital finance."
        description="AURIX is early — architecture is complete and the MVP is in development. We're assembling the founding team across five disciplines."
      />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <Card key={d.title}>
                <h3 className="font-extrabold tracking-tight text-lg text-heading">
                  {d.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {d.body}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-16">
        <Container>
          <Eyebrow>Open Roles</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-2xl text-heading">
            No roles are posted yet — reach out directly and we&apos;ll keep
            you in mind as the team forms.
          </h2>
        </Container>
      </section>

      <CtaBand
        title="Introduce yourself."
        description="Tell us what you'd bring to AURIX and we'll follow up as roles open."
        primaryHref="/contact"
        primaryLabel="Get in Touch"
      />
    </>
  );
}
