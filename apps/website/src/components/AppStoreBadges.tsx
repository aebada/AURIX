import Link from "next/link";

// The mobile app hasn't shipped yet (see apps/mobile/README.md) — these
// badges are honest "coming soon" placeholders that route to account
// creation, not live store links.
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.415 2.06-1.246 2.86-.9.86-1.98 1.35-2.99 1.27-.11-1.1.42-2.15 1.24-2.9.85-.79 2.06-1.31 2.99-1.23zM20.7 17.28c-.35.81-.77 1.57-1.27 2.28-.68.97-1.24 1.64-1.68 2.01-.68.62-1.4.94-2.18.96-.56.01-1.23-.16-2.02-.5-.79-.34-1.51-.5-2.18-.5-.7 0-1.44.16-2.24.5-.8.34-1.44.52-1.94.54-.75.03-1.5-.3-2.24-.98-.47-.4-1.06-1.1-1.77-2.1-.76-1.07-1.39-2.31-1.88-3.74-.53-1.55-.79-3.05-.79-4.5 0-1.66.36-3.09 1.08-4.29.56-.96 1.31-1.72 2.24-2.28.93-.56 1.94-.85 3.02-.87.6 0 1.39.19 2.36.55.97.37 1.59.55 1.87.55.21 0 .9-.21 2.06-.63 1.1-.39 2.03-.55 2.79-.49 2.06.17 3.61.98 4.64 2.44-1.85 1.12-2.76 2.69-2.75 4.71.02 1.57.58 2.88 1.68 3.92.5.48 1.06.85 1.68 1.11-.14.39-.28.76-.44 1.11z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M4.3 2.2c-.4.2-.7.6-.7 1.1v17.4c0 .5.3.9.7 1.1l10.4-9.8L4.3 2.2z" />
      <path d="M16.6 12l3-2.8-11.7-6.9 8.7 9.7z" />
      <path d="M16.6 12l-8.7 9.7 11.7-6.9-3-2.8z" />
    </svg>
  );
}

export function AppStoreBadges({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const base =
    variant === "dark"
      ? "border-white/15 bg-white text-navy hover:bg-white/90"
      : "border-navy/15 bg-navy text-white hover:opacity-90";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/login?mode=register"
        className={`flex items-center gap-3 rounded-3xl border px-4 py-2.5 transition-colors ${base}`}
      >
        <AppleIcon />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wider opacity-70">
            Coming soon on the
          </span>
          <span className="block text-sm font-semibold">App Store</span>
        </span>
      </Link>
      <Link
        href="/login?mode=register"
        className={`flex items-center gap-3 rounded-3xl border px-4 py-2.5 transition-colors ${base}`}
      >
        <PlayIcon />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wider opacity-70">
            Coming soon on
          </span>
          <span className="block text-sm font-semibold">Google Play</span>
        </span>
      </Link>
    </div>
  );
}
