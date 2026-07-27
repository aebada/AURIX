import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: {
    default: "AURIX Web Platform",
    template: "%s | AURIX Web Platform",
  },
  description: "AURIX desktop dashboard — portfolio, transactions, statements, business, and partner/API management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full bg-[var(--color-paper)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
