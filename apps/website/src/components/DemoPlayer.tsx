"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthNavLink } from "@/components/AuthNavLink";
import { AUTH_REGISTER_HREF } from "@/lib/auth-urls";
import { useLanguage } from "@/lib/i18n/language-context";

export type DemoStepId =
  | "onboard"
  | "wallet"
  | "trade"
  | "pay"
  | "reserve"
  | "markets"
  | "chat";

type DemoStep = {
  id: DemoStepId;
  label: string;
  title: string;
  caption: string;
  durationMs: number;
};

const STEP_DURATIONS: Record<DemoStepId, number> = {
  onboard: 4500,
  wallet: 5000,
  trade: 5500,
  pay: 5000,
  reserve: 4500,
  markets: 4000,
  chat: 4000,
};

function openSiteChat() {
  window.dispatchEvent(new CustomEvent("aurix:open-chat"));
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function DemoPlayer() {
  const { t } = useLanguage();
  const dp = t.pages.demoPlayer;

  const STEPS: DemoStep[] = useMemo(
    () =>
      dp.steps.map((s) => ({
        id: s.id as DemoStepId,
        label: s.label,
        title: s.title,
        caption: s.caption,
        durationMs: STEP_DURATIONS[s.id as DemoStepId] ?? 4000,
      })),
    [dp.steps],
  );

  const TOTAL_MS = useMemo(
    () => STEPS.reduce((sum, s) => sum + s.durationMs, 0),
    [STEPS],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loop, setLoop] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startedAt = useRef(0);
  const pausedAt = useRef(0);
  const raf = useRef<number | null>(null);

  const step = STEPS[Math.min(stepIndex, STEPS.length - 1)]!;

  const goTo = useCallback(
    (index: number, resume = true) => {
      const next = ((index % STEPS.length) + STEPS.length) % STEPS.length;
      setStepIndex(next);
      setProgress(0);
      startedAt.current = performance.now();
      pausedAt.current = 0;
      if (resume) setPlaying(true);
    },
    [STEPS.length],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;

    const origin = performance.now();
    const base = pausedAt.current;
    startedAt.current = origin;

    const tick = (now: number) => {
      const elapsed = base * step.durationMs + (now - origin);
      const p = Math.min(1, elapsed / step.durationMs);
      setProgress(p);
      if (p >= 1) {
        pausedAt.current = 0;
        const next = (stepIndex + 1) % STEPS.length;
        if (next === 0) setLoop((n) => n + 1);
        setStepIndex(next);
        setProgress(0);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [playing, stepIndex, step.durationMs, reducedMotion, loop]);

  const togglePlay = () => {
    if (playing) {
      pausedAt.current = progress;
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };

  const overallProgress =
    (STEPS.slice(0, stepIndex).reduce((s, x) => s + x.durationMs, 0) +
      progress * step.durationMs) /
    TOTAL_MS;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
          Short product demo · ~{Math.round(TOTAL_MS / 1000)}s loop
        </p>
        <h2 className="mt-3 font-extrabold tracking-tight text-3xl text-heading sm:text-4xl">
          {step.title}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {step.caption}
        </p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[var(--color-line)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold-light)] to-[var(--color-gold-dark)] transition-[width] duration-100 ease-linear"
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>

        <ol className="mt-6 grid gap-2 sm:grid-cols-2">
          {STEPS.map((s, i) => {
            const active = i === stepIndex;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                    active
                      ? "border-gold/50 bg-gold/10 shadow-sm"
                      : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-navy/30"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      active
                        ? "bg-navy text-gold-light"
                        : "bg-[var(--color-paper)] text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-heading">
                      {s.label}
                    </span>
                    {active && (
                      <span className="mt-0.5 block h-1 overflow-hidden rounded-full bg-[var(--color-line)]">
                        <span
                          className="block h-full rounded-full bg-gold"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {playing ? dp.pause : dp.play}
          </button>
          <button
            type="button"
            onClick={() => goTo(stepIndex + 1)}
            className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-bold text-heading transition-colors hover:border-navy"
          >
            Next step
          </button>
          <button
            type="button"
            onClick={() => {
              goTo(0);
              setLoop((n) => n + 1);
            }}
            className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-bold text-heading transition-colors hover:border-gold"
          >
            Replay
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/app/?tour=1"
            className="rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] px-6 py-3 text-sm font-bold text-navy transition-all hover:-translate-y-0.5 hover:opacity-90"
          >
            Start practice mode
          </Link>
          <AuthNavLink
            href={AUTH_REGISTER_HREF}
            className="rounded-full border border-[var(--color-line)] px-6 py-3 text-sm font-bold text-heading transition-all hover:-translate-y-0.5 hover:border-navy"
          >
            Create account
          </AuthNavLink>
          <Link
            href="/download"
            className="rounded-full border border-[var(--color-line)] px-6 py-3 text-sm font-bold text-heading transition-all hover:-translate-y-0.5 hover:border-navy"
          >
            Download app
          </Link>
          <button
            type="button"
            onClick={openSiteChat}
            className="rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-sm font-bold text-heading transition-all hover:-translate-y-0.5 hover:bg-gold/20"
          >
            Try chat
          </button>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[320px]">
        <div
          className="pointer-events-none absolute -inset-6 rounded-[3rem] opacity-70 blur-2xl"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(227,172,76,0.28), transparent 65%)",
          }}
          aria-hidden
        />
        <DemoPhone
          stepId={step.id}
          stepIndex={stepIndex}
          progress={progress}
          playing={playing && !reducedMotion}
          loop={loop}
          onSelectStep={goTo}
          steps={STEPS}
          goToLabel={dp.goTo}
        />
        <p className="mt-4 text-center text-xs text-muted">
          Interactive mock — tap steps or phone dots; auto-play continues.
        </p>
      </div>
    </div>
  );
}

function DemoPhone({
  stepId,
  stepIndex,
  progress,
  playing,
  loop,
  onSelectStep,
  steps,
  goToLabel,
}: {
  stepId: DemoStepId;
  stepIndex: number;
  progress: number;
  playing: boolean;
  loop: number;
  onSelectStep: (index: number) => void;
  steps: DemoStep[];
  goToLabel: string;
}) {
  return (
    <div className="relative mx-auto w-full rounded-[2.5rem] border-[6px] border-navy bg-navy p-2 shadow-2xl shadow-navy/35">
      <div className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-navy" />
      <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#171c38] to-[#0b0e1f] text-white">
        <div
          key={`${stepId}-${loop}`}
          className={`demo-screen-enter px-4 pb-5 pt-9 ${
            playing ? "demo-screen-live" : ""
          }`}
        >
          {stepId === "onboard" && <ScreenOnboard progress={progress} />}
          {stepId === "wallet" && <ScreenWallet progress={progress} />}
          {stepId === "trade" && <ScreenTrade progress={progress} />}
          {stepId === "pay" && <ScreenPay progress={progress} />}
          {stepId === "reserve" && <ScreenReserve progress={progress} />}
          {stepId === "markets" && <ScreenMarkets progress={progress} />}
          {stepId === "chat" && <ScreenChat progress={progress} />}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pb-3">
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={goToLabel.replace("{label}", s.label)}
              aria-current={i === stepIndex ? "step" : undefined}
              onClick={() => onSelectStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex ? "w-5 bg-gold" : "w-2 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenOnboard({ progress }: { progress: number }) {
  const { t } = useLanguage();
  const welcomeBack = t.pages.demoPlayer.welcomeBack;
  const filled = progress > 0.35;
  const done = progress > 0.7;
  return (
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-white/45">
        AURIX · Measured Trust
      </p>
      <h3 className="font-extrabold tracking-tight text-2xl">{welcomeBack}</h3>
      <p className="text-xs text-white/60">Enter practice mode — mock balances only</p>
      <div className="space-y-2 pt-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs text-white/50">
          you@example.com
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs text-white/50">
          ••••••••••
        </div>
      </div>
      <div
        className={`mt-2 rounded-xl py-3 text-center text-sm font-bold transition-all duration-500 ${
          filled
            ? "bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-navy scale-[1.02]"
            : "bg-white/10 text-white/70"
        }`}
      >
        {done ? "Signed in ✓" : "Sign in"}
      </div>
      {done && (
        <p className="demo-fade-up text-center text-xs text-emerald-400">
          Opening wallet…
        </p>
      )}
    </div>
  );
}

function ScreenWallet({ progress }: { progress: number }) {
  const total = 11840 + progress * 640;
  const gold = 7800 + Math.round(progress * 414);
  const silver = 2900 + Math.round(progress * 150);
  const fiat = 1140 + progress * 65;
  return (
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-white/45">
        Total balance
      </p>
      <p className="font-extrabold tracking-tight text-3xl tabular-nums">
        {formatMoney(total)}
      </p>
      <p className="text-xs font-semibold text-emerald-400">
        +{(1.2 + progress * 1.2).toFixed(1)}% today
      </p>
      <div className="space-y-2.5 pt-2">
        {[
          { tag: "Au", name: "Gold", value: `${gold.toLocaleString()} BPC`, hot: progress > 0.2 },
          { tag: "Ag", name: "Silver", value: `${silver.toLocaleString()} BPC`, hot: progress > 0.45 },
          { tag: "$", name: "Fiat", value: formatMoney(fiat), hot: progress > 0.7 },
        ].map((row) => (
          <div
            key={row.name}
            className={`flex items-center justify-between rounded-2xl px-3.5 py-3 transition-all duration-500 ${
              row.hot
                ? "bg-gold/15 ring-1 ring-gold/40"
                : "bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                  row.tag === "Au"
                    ? "bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-navy"
                    : "bg-white/15"
                }`}
              >
                {row.tag}
              </span>
              <span className="text-sm font-semibold">{row.name}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenTrade({ progress }: { progress: number }) {
  const confirming = progress > 0.35;
  const done = progress > 0.72;
  return (
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-white/45">
        Buy gold
      </p>
      <h3 className="font-extrabold tracking-tight text-xl">0.50 g Au</h3>
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
        <div className="flex justify-between text-xs text-white/50">
          <span>Spot</span>
          <span className="tabular-nums text-white">$2,412.80 / oz</span>
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/50">
          <span>You pay</span>
          <span className="tabular-nums text-gold-light">$38.76</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold-light)] to-[var(--color-gold-dark)] transition-[width] duration-150"
            style={{ width: `${Math.min(1, progress / 0.72) * 100}%` }}
          />
        </div>
      </div>
      <div
        className={`rounded-xl py-3 text-center text-sm font-bold transition-all duration-400 ${
          done
            ? "bg-emerald-500/90 text-white"
            : confirming
              ? "bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-navy scale-[1.02] demo-pulse"
              : "bg-white/10 text-white/70"
        }`}
      >
        {done ? "Order filled ✓" : confirming ? "Confirming…" : "Buy gold"}
      </div>
      {done && (
        <p className="demo-fade-up text-center text-xs text-white/60">
          Practice metal credited — not vaulted gold
        </p>
      )}
    </div>
  );
}

function ScreenPay({ progress }: { progress: number }) {
  const mode = progress < 0.33 ? "qr" : progress < 0.66 ? "send" : "request";
  return (
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-white/45">
        Payments
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {(["QR", "Send", "Request"] as const).map((label) => {
          const active =
            (label === "QR" && mode === "qr") ||
            (label === "Send" && mode === "send") ||
            (label === "Request" && mode === "request");
          return (
            <div
              key={label}
              className={`rounded-xl py-2 text-center text-[11px] font-bold transition-all duration-300 ${
                active
                  ? "bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] text-navy"
                  : "bg-white/10 text-white/55"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>

      {mode === "qr" && (
        <div className="demo-fade-up flex flex-col items-center gap-3 pt-2">
          <div className="grid grid-cols-5 gap-1 rounded-2xl bg-white p-3">
            {Array.from({ length: 25 }).map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-[2px] ${
                  [0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 21, 22, 24].includes(
                    i,
                  )
                    ? "bg-navy"
                    : "bg-navy/15"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-white/60">Scan to pay with AURIX</p>
        </div>
      )}
      {mode === "send" && (
        <div className="demo-fade-up space-y-3 pt-1">
          <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs">
            To · @maya
          </div>
          <p className="font-extrabold tracking-tight text-2xl tabular-nums">
            $24.00
          </p>
          <div className="rounded-xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] py-2.5 text-center text-sm font-bold text-navy">
            Send now
          </div>
        </div>
      )}
      {mode === "request" && (
        <div className="demo-fade-up space-y-3 pt-1">
          <p className="text-xs text-white/60">Request from · @team</p>
          <p className="font-extrabold tracking-tight text-2xl tabular-nums text-gold-light">
            $120.00
          </p>
          <div className="rounded-xl border border-gold/40 bg-gold/10 py-2.5 text-center text-sm font-bold text-gold-light">
            Request sent ✓
          </div>
        </div>
      )}
    </div>
  );
}

function ScreenReserve({ progress }: { progress: number }) {
  const reveal = progress > 0.35;
  return (
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-white/45">
        Reserve transparency
      </p>
      <h3 className="font-extrabold tracking-tight text-xl">Coming soon</h3>
      <div className="rounded-2xl border border-dashed border-gold/40 bg-gold/10 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-light">
          RESERVE_LIVE=false
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/70">
          Mint, redeem, and live proof-of-reserve stay gated until certified vault
          partners connect. Practice balances never imply vaulted gold.
        </p>
      </div>
      {reveal && (
        <div className="demo-fade-up space-y-2 text-xs">
          <div className="flex justify-between rounded-xl bg-white/[0.06] px-3 py-2">
            <span className="text-white/55">Mint against deposit</span>
            <span className="font-semibold text-white/80">Soon</span>
          </div>
          <div className="flex justify-between rounded-xl bg-white/[0.06] px-3 py-2">
            <span className="text-white/55">Physical redeem</span>
            <span className="font-semibold text-white/80">Soon</span>
          </div>
          <div className="flex justify-between rounded-xl bg-white/[0.06] px-3 py-2">
            <span className="text-white/55">Live PoR feed</span>
            <span className="font-semibold text-white/80">Soon</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ScreenMarkets({ progress }: { progress: number }) {
  const au = 2410 + Math.sin(progress * Math.PI * 3) * 4.2;
  const ag = 28.4 + Math.cos(progress * Math.PI * 2.5) * 0.18;
  return (
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-white/45">
        Live markets
      </p>
      <h3 className="font-extrabold tracking-tight text-xl">Pricing tick</h3>
      <div className="space-y-2.5 pt-1">
        {[
          {
            name: "Gold",
            unit: "USD/oz",
            price: au,
            up: Math.sin(progress * Math.PI * 3) >= 0,
          },
          {
            name: "Silver",
            unit: "USD/oz",
            price: ag,
            up: Math.cos(progress * Math.PI * 2.5) >= 0,
          },
        ].map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-3.5 py-3"
          >
            <div>
              <p className="text-sm font-semibold">{row.name}</p>
              <p className="text-[10px] text-white/45">{row.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold tabular-nums">
                ${row.price.toFixed(2)}
              </p>
              <p
                className={`text-[10px] font-semibold ${
                  row.up ? "text-emerald-400" : "text-rose-300"
                }`}
              >
                {row.up ? "▲" : "▼"} live
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-[10px] text-white/40">
        Illustrative quotes for demo only
      </p>
    </div>
  );
}

function ScreenChat({ progress }: { progress: number }) {
  const showReply = progress > 0.4;
  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-wider text-white/45">
        Ask AURIX
      </p>
      <div className="rounded-2xl bg-white/[0.06] px-3 py-2.5 text-xs text-white/80">
        How are reserves verified?
      </div>
      {showReply && (
        <div className="demo-fade-up rounded-2xl border border-gold/30 bg-gold/10 px-3 py-2.5 text-xs leading-relaxed text-gold-light">
          Live reserves stay gated (RESERVE_LIVE=false). Practice mode uses mock
          balances only — certified vault partners and PoR come later.
        </div>
      )}
      <button
        type="button"
        onClick={openSiteChat}
        className="mt-2 w-full rounded-xl bg-navy py-2.5 text-sm font-bold text-gold-light ring-1 ring-gold/40 transition-opacity hover:opacity-90"
      >
        Open live chat tip
      </button>
    </div>
  );
}
