import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Waitlist",
  description: "Join the AURIX waitlist for early access and founding-member pricing.",
};

export default function WaitlistPage() {
  return (
    <>
      <PageHero
        eyebrow="Waitlist"
        title="Be first in line."
        description="Get early access, founding-member pricing, and updates as AURIX moves from architecture to MVP."
      />
      <section className="bg-white py-20">
        <Container className="max-w-xl">
          <WaitlistForm />
        </Container>
      </section>
    </>
  );
}
