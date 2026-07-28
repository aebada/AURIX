"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
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
          <div>
            <span className="block text-lg font-extrabold tracking-tight text-navy">AURIX</span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
              Admin
            </span>
          </div>
        </div>
        <h1 className="mt-6 text-xl font-extrabold tracking-tight text-navy">
          Sign in to the ops portal
        </h1>
        <p className="mt-1 text-sm text-muted">
          Uses the same accounts as the rest of AURIX — any signed-up user can
          sign in here. There is no role-based access control yet, so treat
          this as an internal preview, not a production admin surface.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
            {busy ? "Please wait…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
