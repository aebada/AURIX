import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padding = "p-6",
}: {
  children: ReactNode;
  className?: string;
  // A padding utility passed in `className` can't reliably override the
  // default `p-6` — both end up on the element and Tailwind's generated
  // stylesheet order (not className string order) decides which wins. Use
  // this prop instead when a caller needs different padding (e.g. "p-0").
  padding?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-line)] bg-white ${padding} ${className}`}
    >
      {children}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Settled: "bg-emerald-50 text-emerald-700",
  Connected: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
  "Not connected": "bg-zinc-100 text-zinc-600",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] ?? "bg-zinc-100 text-zinc-600"
      }`}
    >
      {status}
    </span>
  );
}
