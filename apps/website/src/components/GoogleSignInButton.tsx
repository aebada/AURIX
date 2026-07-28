"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { buildHandoffUrl } from "@/lib/auth-api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

// Client-side Google Identity Services flow — the browser gets an ID
// token directly from Google, which is sent to services/backend for
// verification. No client secret is ever needed here. Only renders when
// a client ID is configured at build time (see .env.example); otherwise
// this is a silent no-op rather than a broken button.
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    async function handleCredential(response: { credential: string }) {
      try {
        const session = await loginWithGoogle(response.credential);
        window.location.href = buildHandoffUrl(session);
      } catch {
        if (!cancelled) setError("Google sign-in failed. Please try again.");
      }
    }

    function renderButton() {
      if (cancelled || !window.google || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID!,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
      });
    }

    if (window.google) {
      renderButton();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderButton;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div>
      <div ref={containerRef} className="flex justify-center" />
      {error && <p className="mt-2 text-center text-sm text-red-700">{error}</p>}
    </div>
  );
}
