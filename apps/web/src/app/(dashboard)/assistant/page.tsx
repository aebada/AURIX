"use client";

import { FormEvent, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";
import { chatApi, ApiError } from "@/lib/api";

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
  provider?: string;
}

export default function AssistantPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm the AURIX AI assistant. Ask me about your wallet, transactions, or how AURIX works.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || !input.trim() || sending) return;

    const userMessage: DisplayMessage = { role: "user", content: input.trim() };
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setSending(true);

    try {
      const res = await chatApi.send(token, userMessage.content, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply, provider: res.provider },
      ]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The assistant is unavailable right now.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Topbar title="AI Assistant" />
      <main className="flex-1 p-6 lg:p-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Card className="flex h-[70vh] flex-col" padding="p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-navy text-white"
                      : "bg-[var(--color-paper)] text-navy"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.provider && (
                    <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted">
                      via {m.provider}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[var(--color-paper)] px-4 py-3 text-sm text-muted">
                  Thinking…
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-[var(--color-line)] p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your wallet, transactions, or AURIX..."
              className="flex-1 rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm outline-none focus:border-navy"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </Card>
      </main>
    </>
  );
}
