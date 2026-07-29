"use client";

import { useEffect } from "react";
import { USE_PHP_AUTH, syncSessionFromPhpAuth } from "@/lib/auth-context";

interface PhpMeResponse {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
}

// Syncs the PHP session (php-auth/, see docs/PHP-AUTH.md) into the site's
// existing localStorage-backed auth store on load, so Header/CtaBand/etc.
// work unmodified regardless of which auth backend is actually in use.
export function PhpAuthBridge() {
  useEffect(() => {
    if (!USE_PHP_AUTH) return;
    let cancelled = false;

    fetch("/auth/me.php", { credentials: "include", cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<PhpMeResponse>) : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.authenticated && data.user) {
          syncSessionFromPhpAuth({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.name?.trim() || data.user.email,
            kycStatus: "unverified",
          });
        } else {
          syncSessionFromPhpAuth(null);
        }
      })
      .catch(() => {
        if (!cancelled) syncSessionFromPhpAuth(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
