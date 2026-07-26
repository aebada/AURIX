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
      className={`rounded-2xl border border-[var(--color-line)] bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  verified: "bg-emerald-50 text-emerald-700",
  Operational: "bg-emerald-50 text-emerald-700",
  Approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  Degraded: "bg-amber-50 text-amber-700",
  "Awaiting review": "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
  Rejected: "bg-red-50 text-red-700",
  Down: "bg-red-50 text-red-700",
  unverified: "bg-zinc-100 text-zinc-600",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        statusStyles[status] ?? "bg-zinc-100 text-zinc-600"
      }`}
    >
      {status}
    </span>
  );
}

export function RiskBadge({ score }: { score: number }) {
  const level = score < 0.3 ? "low" : score < 0.7 ? "medium" : "high";
  const styles: Record<string, string> = {
    low: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[level]}`}>
      {score.toFixed(2)} · {level}
    </span>
  );
}
