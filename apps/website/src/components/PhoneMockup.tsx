export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] rounded-[2.5rem] border-[6px] border-navy bg-navy p-2 shadow-2xl shadow-navy/30 sm:w-[290px]">
      <div className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-navy" />
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#171c38] to-[#0b0e1f] px-5 pb-6 pt-8 text-white">
        <p className="text-[11px] uppercase tracking-wider text-white/50">
          Total balance
        </p>
        <p className="mt-1 font-extrabold tracking-tight text-3xl">
          $12,480.32
        </p>
        <p className="mt-1 text-xs font-semibold text-emerald-400">
          +2.4% today
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-xs font-bold text-navy">
                Au
              </span>
              <span className="text-sm font-semibold">Gold</span>
            </div>
            <span className="text-sm font-semibold">8,214 BPC</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                Ag
              </span>
              <span className="text-sm font-semibold">Silver</span>
            </div>
            <span className="text-sm font-semibold">3,050 BPC</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                $
              </span>
              <span className="text-sm font-semibold">Fiat</span>
            </div>
            <span className="text-sm font-semibold">$1,205.10</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {["Send", "Pay", "Buy"].map((label) => (
            <div
              key={label}
              className="rounded-2xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] py-2.5 text-center text-xs font-bold text-navy"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
