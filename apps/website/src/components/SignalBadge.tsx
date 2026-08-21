import type { MomentumSignal } from "@/lib/live-market-data";
import { MOMENTUM_LABELS } from "@/lib/live-market-data";

const SIGNAL_STYLES: Record<MomentumSignal, string> = {
  bullish: "bg-emerald-50 text-emerald-700",
  neutral: "bg-zinc-100 text-zinc-600",
  bearish: "bg-red-50 text-red-600",
};

export function SignalBadge({ signal }: { signal: MomentumSignal }) {
  return (
    <span
      title="Illustrative momentum read from recent price trend — not financial advice."
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${SIGNAL_STYLES[signal]}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          signal === "bullish" ? "bg-emerald-500" : signal === "bearish" ? "bg-red-500" : "bg-zinc-400"
        }`}
      />
      {MOMENTUM_LABELS[signal]}
    </span>
  );
}
