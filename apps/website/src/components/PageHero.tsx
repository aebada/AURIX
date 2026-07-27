import { Eyebrow } from "./Eyebrow";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-extrabold tracking-tight text-4xl leading-[1.05] text-heading sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {description}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
