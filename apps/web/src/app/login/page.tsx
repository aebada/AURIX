"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
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
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, fullName);
      }
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-paper)] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[var(--color-line)] bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/brand/aurix-mark.png" alt="" width={26} height={24} className="h-6 w-auto" />
          <span className="text-lg font-extrabold tracking-tight text-navy">AURIX</span>
        </div>
        <h1 className="mt-6 text-xl font-extrabold tracking-tight text-navy">
          {mode === "login" ? "Sign in to your dashboard" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Connects to the live services/backend API — real auth, real wallet
          ledger, mock providers underneath.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === "register" && (
            <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
              Full name
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
              />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
            Password
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
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
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
          {mode === "login" ? "Need an account? Register" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
