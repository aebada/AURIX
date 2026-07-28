import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: {
    default: "AURIX Admin",
    template: "%s | AURIX Admin",
  },
  description: "AURIX internal operations portal — KYC, transaction monitoring, partner health, and AI governance review.",
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
