import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CurrencyProvider } from "@/lib/currency-context";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { PhpAuthBridge } from "@/components/PhpAuthBridge";
import { ChatWidget } from "@/components/ChatWidget";
import { MarketingChrome } from "@/components/MarketingChrome";
import { GoldServiceProvider } from "@/lib/gold-service/store";

export const metadata: Metadata = {
  title: {
    default: "AURIX — Measured Trust. Real Digital Money.",
    template: "%s | AURIX",
  },
  description:
    "AURIX is a regulated orchestration layer connecting real, vaulted gold and silver reserves to an AI-audited, instant global payment network.",
};

// Applies the stored/system theme before first paint so there's no
// light-mode flash. Sets data-theme + .dark for dark themes (night /
// prestige / ocean). Runs from a plain inline script (not next/script)
// since this is a fully static export.
const themeInitScript = `(function(){try{
  var allowed = {light:1,dark:1,gold:1,ocean:1,classic:1};
  var t = localStorage.getItem("aurix-theme");
  if (!t || !allowed[t]) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  var dark = t === "dark" || t === "gold" || t === "ocean";
  document.documentElement.setAttribute("data-theme", t);
  document.documentElement.classList.toggle("dark", dark);
}catch(e){}})();`;

// Applies the stored language (and RTL direction for Arabic) before first
// paint, same rationale as themeInitScript above.
const langInitScript = `(function(){try{
  var l = localStorage.getItem("aurix-lang") || "en";
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
        <LanguageProvider>
          <AuthProvider>
            <PhpAuthBridge />
            <CurrencyProvider>
              <GoldServiceProvider>
                <MarketingChrome
                  header={<Header />}
                  footer={<Footer />}
                  chat={<ChatWidget />}
                >
                  {children}
                </MarketingChrome>
              </GoldServiceProvider>
            </CurrencyProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
