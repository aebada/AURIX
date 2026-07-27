import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`hover-lift rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-[var(--color-line)] pt-6 first:border-t-0 first:pt-0 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0 sm:first:border-l-0 sm:first:pl-0">
      <p className="font-extrabold tracking-tight text-4xl text-gradient-gold sm:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-muted">{label}</p>
    </div>
  );
}

export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold-dark">
        &#10003;
      </span>
      <span className="text-sm leading-relaxed text-ink/80">{children}</span>
    </li>
  );
}
