import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CurrencyProvider } from "@/lib/currency-context";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: {
    default: "AURIX — Measured Trust. Real Digital Money.",
    template: "%s | AURIX",
  },
  description:
    "AURIX is a regulated orchestration layer connecting real, vaulted gold and silver reserves to an AI-audited, instant global payment network.",
};

// Applies the stored/system theme before first paint so there's no
// light-mode flash for users who prefer/chose dark. Runs from a plain
// inline script (not next/script) since this is a fully static export.
const themeInitScript = `(function(){try{
  var t = localStorage.getItem("aurix-theme");
  if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  if (t === "dark") document.documentElement.classList.add("dark");
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
        <AuthProvider>
          <CurrencyProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
