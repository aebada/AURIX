import type { Asset } from "@/lib/api";

const ASSET_META: Record<Asset, { label: string; unit: string; colorVar: string }> = {
  FIAT: { label: "Cash", unit: "$", colorVar: "--color-line" },
  GOLD: { label: "Gold", unit: "g", colorVar: "--color-gold" },
  SILVER: { label: "Silver", unit: "g", colorVar: "--color-navy-soft" },
};

export function WalletCard({
  asset,
  balance,
  usdValue,
  selected,
  onSelect,
}: {
  asset: Asset;
  balance: number;
  usdValue: number | null;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = ASSET_META[asset];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-56 shrink-0 flex-col items-start rounded-2xl border p-5 text-left transition-all ${
        selected
          ? "border-navy bg-navy text-white shadow-lg"
          : "border-[var(--color-line)] bg-white hover:border-navy/40"
      }`}
    >
      <span
        className="h-8 w-8 rounded-full"
        style={{ backgroundColor: `var(${meta.colorVar})` }}
      />
      <p
        className={`mt-4 text-xs font-semibold uppercase tracking-wider ${
          selected ? "text-white/60" : "text-muted"
        }`}
      >
        {meta.label} wallet
      </p>
      <p className={`mt-1 text-2xl font-extrabold tracking-tight ${selected ? "text-white" : "text-navy"}`}>
        {asset === "FIAT"
          ? `$${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          : `${balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${meta.unit}`}
      </p>
      {usdValue !== null && asset !== "FIAT" && (
        <p className={`mt-1 text-xs ${selected ? "text-white/60" : "text-muted"}`}>
          ≈ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      )}
    </button>
  );
}
