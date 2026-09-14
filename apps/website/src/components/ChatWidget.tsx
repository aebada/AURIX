"use client";

import Image from "next/image";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  CHAT_IS_LIVE,
  sendChatMessage,
  type ChatHistoryItem,
  type ChatRole,
} from "@/lib/chat-api";
import { useLanguage } from "@/lib/i18n/language-context";

interface DisplayMessage {
  role: ChatRole;
  content: string;
  provider?: string;
}

export function ChatWidget() {
  const panelId = useId();
  const { t, locale, dir } = useLanguage();
  const c = t.pages.chat;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: "assistant", content: c.welcome },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([...c.suggestions]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seededLocale = useRef(locale);

  useEffect(() => {
    if (seededLocale.current === locale) return;
    seededLocale.current = locale;
    setMessages([{ role: "assistant", content: c.welcome }]);
    setSuggestions([...c.suggestions]);
    setError(null);
  }, [locale, c.welcome, c.suggestions]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, sending, open, suggestions]);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 220);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const openFromDemo = () => setOpen(true);
    window.addEventListener("aurix:open-chat", openFromDemo);
    return () => window.removeEventListener("aurix:open-chat", openFromDemo);
  }, []);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMessage: DisplayMessage = { role: "user", content: trimmed };
    const history: ChatHistoryItem[] = messages.map(({ role, content }) => ({
      role,
      content,
    }));
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setSending(true);
    setSuggestions([]);

    try {
      const res = await sendChatMessage(trimmed, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply, provider: res.provider },
      ]);
      setSuggestions(res.suggestions ?? [...c.suggestions]);
    } catch (err) {
      setError(err instanceof Error ? err.message : c.unavailable);
      setSuggestions([...c.suggestions]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleSuggestionClick(label: string) {
    void sendMessage(label);
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex p-4 sm:p-6"
      style={{ justifyContent: dir === "rtl" ? "flex-start" : "flex-end" }}
    >
      <div
        className="pointer-events-auto flex flex-col gap-3"
        style={{ alignItems: dir === "rtl" ? "flex-start" : "flex-end" }}
      >
        <div
          id={panelId}
          role="dialog"
          aria-label={c.title}
          aria-hidden={!open}
          className={`overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_24px_48px_-28px_rgba(18,22,44,0.55)] transition-all duration-300 ease-out motion-reduce:transition-none ${
            open
              ? "mb-0 max-h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] translate-y-0 scale-100 opacity-100"
              : "pointer-events-none mb-0 max-h-0 w-[min(22rem,calc(100vw-2rem))] translate-y-3 scale-95 opacity-0"
          }`}
        >
          <div className="flex h-[min(32rem,70vh)] flex-col">
            <div className="flex items-center gap-3 border-b border-[var(--color-line)] bg-navy px-4 py-3 text-white">
              <Image
                src="/brand/aurix-mark.png"
                alt=""
                width={28}
                height={26}
                className="h-7 w-auto"
              />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold tracking-tight text-sm leading-tight">{c.title}</p>
                <p className="text-[11px] text-white/55">
                  {CHAT_IS_LIVE ? c.live : c.demo}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={c.closeChat}
              >
                <CloseIcon />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-navy text-white"
                        : "rounded-bl-md border border-[var(--color-line)] bg-[var(--color-paper)] text-heading"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.provider && m.provider !== "api" && (
                      <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted">
                        via {m.provider}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm text-muted">
                    <span className="inline-flex gap-1">
                      <span className="animate-pulse">·</span>
                      <span className="animate-pulse [animation-delay:150ms]">·</span>
                      <span className="animate-pulse [animation-delay:300ms]">·</span>
                    </span>
                  </div>
                </div>
              )}
              {error && (
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            {!sending && suggestions.length > 0 && (
              <div className="border-t border-[var(--color-line)] bg-[var(--color-paper)]/60 px-3 py-2.5">
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {c.quickOptions}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleSuggestionClick(label)}
                      className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1.5 text-left text-xs font-medium text-navy transition-colors hover:border-gold hover:bg-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold dark:text-heading"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-[var(--color-line)] p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={c.placeholder}
                maxLength={4000}
                disabled={sending}
                className="min-w-0 flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold disabled:opacity-60"
                aria-label={c.messageAria}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="shrink-0 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {c.send}
              </button>
            </form>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex h-14 items-center gap-2.5 rounded-full bg-navy pl-4 pr-5 text-white shadow-[0_16px_32px_-16px_rgba(18,22,44,0.7)] transition-transform duration-300 ease-out hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/90 text-navy">
            {open ? <CloseIcon /> : <ChatIcon />}
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {open ? c.close : c.title}
          </span>
        </button>
      </div>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4.2 3.2A.75.75 0 0 1 4.5 18.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
