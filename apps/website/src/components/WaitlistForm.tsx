"use client";

import { FormEvent, useState } from "react";

// Front-end only for now: no backend/email capture service is wired up yet.
// TODO: POST to a waitlist-capture endpoint once services/backend exists.
export function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-gold/30 bg-white p-8 text-center">
        <p className="font-extrabold tracking-tight text-xl text-navy">
          You&apos;re on the list.
        </p>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll email you as AURIX moves from architecture to MVP.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--color-line)] bg-white p-8"
    >
      <label className="block text-sm font-medium text-navy">
        Email address
        <input
          required
          type="email"
          name="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        />
      </label>
      <label className="mt-6 block text-sm font-medium text-navy">
        I&apos;m most interested in...
        <select
          name="interest"
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        >
          <option>Saving in gold &amp; silver</option>
          <option>Everyday payments</option>
          <option>Gold-backed lending</option>
          <option>Investing (stocks, crypto, ETFs)</option>
          <option>Business / merchant tools</option>
        </select>
      </label>
      <button
        type="submit"
        className="mt-8 w-full rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] px-6 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
      >
        Join the Waitlist
      </button>
    </form>
  );
}
