"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ApiError, buildHandoffUrl } from "@/lib/auth-api";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { useLanguage } from "@/lib/i18n/language-context";

function LoginForm() {
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session =
        mode === "login" ? await login(email, password) : await register(email, password, fullName);
      window.location.href = buildHandoffUrl(session);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.login.genericError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] w-full items-center justify-center bg-[var(--color-paper)] px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand/aurix-mark.png" alt="" width={26} height={24} className="h-6 w-auto" />
          <span className="text-lg font-extrabold tracking-tight text-heading">AURIX</span>
        </Link>
        <h1 className="mt-6 text-xl font-extrabold tracking-tight text-heading">
          {mode === "login" ? t.login.signInTitle : t.login.registerTitle}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t.login.connectsNote}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === "register" && (
            <label className="flex flex-col gap-1.5 text-sm font-medium text-heading">
              {t.login.fullName}
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
              />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-sm font-medium text-heading">
            {t.login.email}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-heading">
            {t.login.password}
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          >
            {busy ? t.login.pleaseWait : mode === "login" ? t.login.signIn : t.login.createAccount}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode(mode === "login" ? "register" : "login");
          }}
          className="mt-4 w-full text-center text-sm font-semibold text-gold-dark hover:underline"
        >
          {mode === "login" ? t.login.needAccount : t.login.haveAccount}
        </button>

        <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted">
          <span className="h-px flex-1 bg-[var(--color-line)]" />
          {t.login.or}
          <span className="h-px flex-1 bg-[var(--color-line)]" />
        </div>
        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
