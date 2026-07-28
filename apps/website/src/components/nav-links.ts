// Primary nav is deliberately short (5 items) per standard UX guidance for
// top-level navigation (aim for 5-7 max) — the rest of the site's sections
// are one click away via the footer (see footerLinks below).
export const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: "/about", label: "About" },
];

export const footerLinks = {
  Product: [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/features", label: "Features" },
    { href: "/markets", label: "Markets" },
    { href: "/pricing", label: "Pricing" },
    { href: "/ai-governance", label: "AI & Governance" },
  ],
  Trust: [
    { href: "/security", label: "Security & Trust" },
    { href: "/reserve-transparency", label: "Reserve Transparency" },
    { href: "/whitepaper", label: "Whitepaper" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/partners", label: "Partners" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
};
