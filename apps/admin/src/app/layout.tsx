import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

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
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
