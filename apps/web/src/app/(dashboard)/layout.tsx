"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) {
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
