import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

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
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
