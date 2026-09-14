// Primary header nav — Revolut-style product / audience IA (~6 items).
// Secondary pages (features, pricing, security, about, etc.) live in the footer
// and the mobile drawer extras. `key` maps to Dictionary["nav"] via t.nav[key].
export const navLinks = [
  { href: "/", key: "personal" as const },
  { href: "/business", key: "business" as const },
  { href: "/investors", key: "investors" as const },
  { href: "/partners", key: "partners" as const },
  { href: "/demo", key: "demo" as const },
  { href: "/markets", key: "markets" as const },
];

/** Extra links shown only in the mobile drawer (desktop keeps the primary row lean). */
export const mobileNavExtras = [
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/features", key: "features" as const },
  { href: "/download", key: "download" as const },
  { href: "/contact", key: "contact" as const },
];

export const footerLinks = {
  Product: [
    { href: "/app", key: "webApp" as const },
    { href: "/business", key: "business" as const },
    { href: "/download", key: "download" as const },
    { href: "/demo", key: "demo" as const },
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
    { href: "/investors", key: "investors" as const },
    { href: "/partners", key: "partners" as const },
    { href: "/careers", key: "careers" as const },
    { href: "/contact", key: "contact" as const },
  ],
};
