"use client";

import { useId, useRef, type MouseEvent } from "react";

// Visual mark for Pointcoin (the BPC atomic gold/silver unit — see
// docs/PRODUCT_PLAN.md "Appendix: Gold Tokenization Model"). Pure SVG so it
// stays crisp at any size and adapts to the light/dark theme.
export function PointcoinCoin({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const stageRef = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--pc-tilt-x", `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty("--pc-tilt-y", `${(x * 8).toFixed(2)}deg`);
  }

  function onLeave() {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--pc-tilt-x", "0deg");
    el.style.setProperty("--pc-tilt-y", "0deg");
  }

  return (
    <div
      ref={stageRef}
      className={`pointcoin-stage relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 42% 35%, var(--glow-gold), transparent 58%)",
        }}
        aria-hidden
      />
      <div className="pointcoin-float relative will-change-transform">
        <div className="pointcoin-tilt">
          <svg
            viewBox="0 0 320 320"
            className="relative h-full w-full drop-shadow-[0_28px_48px_rgba(18,22,44,0.28)]"
            role="img"
            aria-label="Pointcoin, the AURIX atomic gold and silver unit"
          >
          <defs>
            <radialGradient id={`${uid}-face`} cx="32%" cy="28%" r="78%">
              <stop offset="0%" stopColor="var(--color-gold-light)" />
              <stop offset="42%" stopColor="var(--color-gold)" />
              <stop offset="100%" stopColor="var(--color-gold-dark)" />
            </radialGradient>
            <linearGradient id={`${uid}-rim`} x1="12%" y1="8%" x2="88%" y2="92%">
              <stop offset="0%" stopColor="var(--color-gold-light)" />
              <stop offset="45%" stopColor="var(--color-gold)" />
              <stop offset="100%" stopColor="var(--color-gold-dark)" />
            </linearGradient>
            <linearGradient id={`${uid}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-gold-light)" stopOpacity="0.95" />
              <stop offset="50%" stopColor="var(--color-gold-dark)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-gold-light)" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id={`${uid}-spec`} cx="30%" cy="22%" r="45%">
              <stop offset="0%" stopColor="#fff8e8" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#fff8e8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#fff8e8" stopOpacity="0" />
            </radialGradient>
            <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
            <path id={`${uid}-arc`} d="M 160,274 A 114,114 0 0 1 160,46" fill="none" />
          </defs>

          {/* Depth stack */}
          <ellipse
            cx="128"
            cy="208"
            rx="108"
            ry="22"
            fill="var(--color-navy)"
            opacity="0.12"
            filter={`url(#${uid}-soft)`}
          />
          <circle cx="122" cy="198" r="104" fill="var(--color-navy-soft)" opacity="0.28" />
          <circle cx="140" cy="184" r="106" fill="var(--color-navy-soft)" opacity="0.48" />

          {/* Main coin body */}
          <circle cx="160" cy="160" r="116" fill={`url(#${uid}-rim)`} />
          <circle cx="160" cy="160" r="108" fill={`url(#${uid}-bevel)`} opacity="0.9" />
          <circle
            cx="160"
            cy="160"
            r="100"
            fill={`url(#${uid}-face)`}
            stroke="var(--color-gold-dark)"
            strokeWidth="1.5"
          />
          <circle cx="160" cy="160" r="100" fill={`url(#${uid}-spec)`} />
          <circle
            cx="160"
            cy="160"
            r="90"
            fill="none"
            stroke="var(--color-navy)"
            strokeOpacity="0.16"
            strokeWidth="1.25"
            strokeDasharray="1.5 5"
          />
          <circle
            cx="160"
            cy="160"
            r="78"
            fill="none"
            stroke="var(--color-gold-light)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />

          {/* Rim engraving */}
          <text
            fontSize="14"
            fontWeight="700"
            letterSpacing="5"
            fill="var(--color-navy)"
            opacity="0.5"
          >
            <textPath href={`#${uid}-arc`} startOffset="50%" textAnchor="middle">
              POINTCOIN
            </textPath>
          </text>

          {/* Center emblem */}
          <g transform="translate(160,148)">
            <path
              d="M0,-40 L35,32 L-35,32 Z"
              fill="var(--color-navy)"
              opacity="0.9"
            />
            <path d="M0,-40 L12,32 L-35,32 Z" fill="var(--color-navy-deep)" opacity="0.55" />
            <path
              d="M0,-28 L22,22 L-22,22 Z"
              fill="none"
              stroke="var(--color-gold-light)"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
          </g>
          <text
            x="160"
            y="218"
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            letterSpacing="1.5"
            fill="var(--color-navy)"
            opacity="0.92"
          >
            0.0001g
          </text>
        </svg>
        </div>
      </div>
    </div>
  );
}
