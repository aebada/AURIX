// Primary nav is deliberately short (5 items) per standard UX guidance for
// top-level navigation (aim for 5-7 max) — the rest of the site's sections
// are one click away via the footer (see footerLinks below).
// `key` maps each link to its translation in lib/i18n/translations.ts
// (Dictionary["nav"]) — labels are resolved via t.nav[key] at render time
// rather than hardcoded here so the nav can be localized.
export const navLinks = [
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/features", key: "features" as const },
  { href: "/markets", key: "markets" as const },
  { href: "/pricing", key: "pricing" as const },
  { href: "/security", key: "security" as const },
  { href: "/about", key: "about" as const },
];

export const footerLinks = {
  Product: [
    { href: "/how-it-works", key: "howItWorks" as const },
    { href: "/features", key: "features" as const },
    { href: "/markets", key: "markets" as const },
    { href: "/pricing", key: "pricing" as const },
    { href: "/ai-governance", key: "aiGovernance" as const },
  ],
  Trust: [
    { href: "/security", key: "security" as const },
    { href: "/reserve-transparency", key: "reserveTransparency" as const },
    { href: "/whitepaper", key: "whitepaper" as const },
  ],
  Company: [
    { href: "/about", key: "about" as const },
    { href: "/partners", key: "partners" as const },
    { href: "/careers", key: "careers" as const },
    { href: "/contact", key: "contact" as const },
  ],
};
