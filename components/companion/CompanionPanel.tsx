"use client";

import { useState } from "react";
import type { CompanionReply } from "@/lib/types";

export function CompanionPanel({ paragraphId }: { paragraphId: string }) {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<CompanionReply | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setReply(null);
    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraphId, question }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Request failed (${res.status}).`);
      }
      const data = (await res.json()) as CompanionReply;
      setReply(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ui rounded-sm border border-rule bg-paper-deep/50 p-5">
      <header>
        <p className="text-xs uppercase tracking-wide2 text-ink-faint">
          Companion
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          Ask a question about this paragraph. Answers are cited only.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What does Bahá'u'lláh mean by 'detachment' here?"
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-sm border border-rule bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent-deep/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="inline-flex items-center rounded-sm border border-accent-deep/70 bg-accent-deep px-4 py-2 text-xs text-paper disabled:opacity-50"
        >
          {loading ? "Consulting…" : "Ask"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}

      {reply && (
        <div className="mt-5 space-y-4">
          <p className="font-serif text-[1.02rem] leading-relaxed text-ink">
            {reply.answer}
          </p>
          {reply.citations.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide2 text-ink-faint">
                Citations
              </p>
              <ul className="mt-2 space-y-2">
                {reply.citations.map((c, i) => (
                  <li
                    key={`${c.ref}-${i}`}
                    className="rounded-sm border border-rule bg-paper px-3 py-2 text-xs text-ink-soft"
                  >
                    <span className="font-medium text-accent-deep">
                      {c.ref}
                    </span>
                    <span className="ml-2 italic text-ink-muted">
                      “{c.excerpt}”
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {reply.disclaimers.length > 0 && (
            <ul className="space-y-1 text-[0.7rem] leading-relaxed text-ink-faint">
              {reply.disclaimers.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
