// Visual mark for Pointcoin (the BPC atomic gold/silver unit — see
// docs/PRODUCT_PLAN.md "Appendix: Gold Tokenization Model"). Pure SVG so it
// stays crisp at any size and adapts to the light/dark theme.
export function PointcoinCoin({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Pointcoin, the AURIX atomic gold and silver unit"
    >
      <defs>
        <radialGradient id="pc-face" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="var(--color-gold-light)" />
          <stop offset="55%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-gold-dark)" />
        </radialGradient>
        <linearGradient id="pc-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-gold-light)" />
          <stop offset="100%" stopColor="var(--color-gold-dark)" />
        </linearGradient>
        <path id="pc-arc" d="M 160,272 A 112,112 0 0 1 160,48" fill="none" />
      </defs>

      {/* Back coins, stacked to suggest fractional/atomic units */}
      <circle cx="126" cy="196" r="104" fill="var(--color-navy-soft)" opacity="0.35" />
      <circle cx="146" cy="182" r="104" fill="var(--color-navy-soft)" opacity="0.55" />

      {/* Main coin */}
      <circle cx="160" cy="160" r="112" fill="url(#pc-rim)" />
      <circle cx="160" cy="160" r="100" fill="url(#pc-face)" stroke="var(--color-gold-dark)" strokeWidth="2" />
      <circle
        cx="160"
        cy="160"
        r="88"
        fill="none"
        stroke="var(--color-navy)"
        strokeOpacity="0.18"
        strokeWidth="1.5"
        strokeDasharray="2 4"
      />

      {/* Rim engraving */}
      <text fontSize="15" fontWeight="700" letterSpacing="4" fill="var(--color-navy)" opacity="0.55">
        <textPath href="#pc-arc" startOffset="50%" textAnchor="middle">
          POINTCOIN
        </textPath>
      </text>

      {/* Center emblem: the AURIX mark, abstracted as a faceted triangle */}
      <g transform="translate(160,150)">
        <path
          d="M0,-38 L33,30 L-33,30 Z"
          fill="var(--color-navy)"
          opacity="0.85"
        />
        <path d="M0,-38 L10,30 L-33,30 Z" fill="var(--color-navy-deep)" opacity="0.5" />
      </g>
      <text
        x="160"
        y="216"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        letterSpacing="1"
        fill="var(--color-navy)"
      >
        0.0001g
      </text>
    </svg>
  );
}
