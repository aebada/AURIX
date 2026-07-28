"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  // See apps/web's equivalent layout for why this one-time "settled" flag
  // is needed: useSyncExternalStore briefly reflects the server snapshot
  // (no token) until it corrects itself post-hydration on a cold load.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setSettled(true);
  }, []);

  useEffect(() => {
    if (settled && !token) {
      router.replace("/login");
    }
  }, [settled, token, router]);

  if (!settled || !token) {
    return (
      <div className="flex min-h-screen w-full flex-1 items-center justify-center">
        <p className="text-sm font-medium text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">{children}</div>
    </div>
  );
}
