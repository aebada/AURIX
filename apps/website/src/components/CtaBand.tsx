import Link from "next/link";
import { Container } from "./Container";

export function CtaBand({
  title = "Be first when AURIX opens its doors.",
  description = "Join the waitlist to get early access, founding-member pricing, and updates as we move from architecture to MVP.",
  primaryHref = "/waitlist",
  primaryLabel = "Join the Waitlist",
  secondaryHref = "/whitepaper",
  secondaryLabel = "Read the Whitepaper",
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-navy-glow px-8 py-16 text-white sm:px-14">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-extrabold tracking-tight text-3xl sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-white/70">{description}</p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] px-6 py-3 text-center text-sm font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl hover:shadow-black/20 active:translate-y-0"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="rounded-full border border-white/25 px-6 py-3 text-center text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
