"use client";

import { useState } from "react";
import { Card } from "./Card";
import { useAuth } from "@/lib/auth-context";
import { usersApi, ApiError } from "@/lib/api";

// Not collected at registration (no reason to add friction to sign-up for
// it) — this prompts for it afterward from the dashboard, and can be
// skipped for now without blocking anything.
export function TaxIdPrompt({ onSaved }: { onSaved?: () => void }) {
  const { token } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (dismissed) return null;

  async function handleSave() {
    if (!token || !taxId.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await usersApi.setTaxId(token, taxId.trim());
      onSaved?.();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Couldn't save your tax ID");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-gold/30 bg-gold/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-navy">Add your tax number</p>
          <p className="mt-1 text-xs text-muted">
            We&apos;ll need your tax ID (e.g. for annual reporting) before you can withdraw large
            amounts. You can add it now or later from your account settings.
          </p>
        </div>
        <div className="flex gap-2 sm:shrink-0">
          <input
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="Tax ID / Tax number"
            className="w-full min-w-0 rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm sm:w-48"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={busy || !taxId.trim()}
            className="whitespace-nowrap rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="mt-2 text-xs font-semibold text-gold-dark hover:underline"
      >
        Remind me later
      </button>
    </Card>
  );
}
