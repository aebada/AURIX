"use client";

import { PracticeProvider } from "@/lib/app/practice-store";
import { AppShell } from "@/components/app/AppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PracticeProvider>
      <AppShell>{children}</AppShell>
    </PracticeProvider>
  );
}
