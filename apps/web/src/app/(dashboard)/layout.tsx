"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  // On a cold full-page load (as opposed to client-side navigation within
  // the app), auth-context's useSyncExternalStore briefly reflects the
  // server snapshot (no token) until it corrects itself post-hydration —
  // e.g. right after the marketing site hands off a freshly-created
  // session. Wait one render past mount before treating "no token" as a
  // real signed-out state, so that correction has a chance to land first.
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
    <>
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">{children}</div>
    </>
  );
}
