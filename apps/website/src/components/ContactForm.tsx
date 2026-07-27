"use client";

import { FormEvent, useState } from "react";

// Front-end only for now: no backend/email service is wired up yet.
// TODO: POST to the auth/notification service once services/backend exists.
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-gold/30 bg-[var(--color-surface)] p-8 text-center">
        <p className="font-extrabold tracking-tight text-xl text-heading">
          Thanks — we&apos;ve got your message.
        </p>
        <p className="mt-2 text-sm text-muted">
          Someone from the AURIX team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-heading">
          Name
          <input
            required
            type="text"
            name="name"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-heading">
          Email
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
      </div>
      <label className="mt-6 block text-sm font-medium text-heading">
        I am reaching out as a...
        <select
          name="role"
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        >
          <option>Prospective user</option>
          <option>Investor</option>
          <option>Vault / payment / KYC partner</option>
          <option>Journalist</option>
          <option>Other</option>
        </select>
      </label>
      <label className="mt-6 block text-sm font-medium text-heading">
        Message
        <textarea
          required
          name="message"
          rows={5}
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="mt-8 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Send Message
      </button>
    </form>
  );
}
