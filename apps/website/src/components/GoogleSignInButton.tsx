"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { buildHandoffUrl } from "@/lib/auth-api";
import { AUTH_GOOGLE_HREF, USE_PHP_AUTH } from "@/lib/auth-urls";

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
//
// When NEXT_PUBLIC_USE_PHP_AUTH=1, skip GIS entirely and link to
// php-auth's server-side OAuth start (/auth/google.php) — that flow
// needs the client secret on the server and is what the live site uses.
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_PHP_AUTH || !GOOGLE_CLIENT_ID) return;
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

  if (USE_PHP_AUTH) {
    return (
      <a
        href={AUTH_GOOGLE_HREF}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-heading transition-colors hover:bg-[var(--color-paper)]"
      >
        <GoogleGlyph />
        Continue with Google
      </a>
    );
  }

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div>
      <div ref={containerRef} className="flex justify-center" />
      {error && <p className="mt-2 text-center text-sm text-red-700">{error}</p>}
    </div>
  );
}
