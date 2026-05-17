"use client";

import { useEffect, useRef, useState } from "react";

/* ────────────────────────── Markdown ────────────────────────── */
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

/** Tiny markdown -> HTML: bold, italic, inline code, bullets, hr, line breaks. */
function renderMd(src: string): string {
  let s = escapeHtml(src);
  // Inline code
  s = s.replace(/`([^`]+)`/g, '<code class="rounded bg-ink-100 px-1 py-0.5 font-mono text-[12px]">$1</code>');
  // Bold **x**
  s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-medium text-ink-900">$1</strong>');
  // Italic *x* or _x_
  s = s.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  s = s.replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, "$1<em>$2</em>");
  // Horizontal rule
  s = s.replace(/^\s*---\s*$/gm, '<hr class="my-2 border-ink-100">');
  // Bullets
  s = s.replace(/(?:^|\n)([-*])\s+(.+)/g, (_m, _b, txt) => "\n<li class=\"ml-4 list-disc\">" + txt + "</li>");
  s = s.replace(/(?:<li[^>]*>.*?<\/li>\n?)+/g, (block) => '<ul class="my-1.5 space-y-1">' + block.replace(/\n/g, "") + "</ul>");
  // Headers
  s = s.replace(/^###\s+(.+)$/gm, '<div class="mt-2 font-medium text-ink-900">$1</div>');
  s = s.replace(/^##\s+(.+)$/gm, '<div class="mt-2 text-[14px] font-medium text-ink-900">$1</div>');
  s = s.replace(/^#\s+(.+)$/gm, '<div class="mt-2 text-[15px] font-medium text-ink-900">$1</div>');
  // Line breaks
  s = s.replace(/\n/g, "<br>");
  return s;
}

/* ────────────────────────── UI ────────────────────────── */
type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS: { label: string; q: string }[] = [
  { label: "What's his stack?",   q: "What's his stack?" },
  { label: "Featured projects",   q: "Tell me about his featured AI projects" },
  { label: "Securities domain",   q: "What is his securities analytics experience?" },
  { label: "Roles he fits",       q: "What kind of roles is he suitable for?" },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text:
        "Hi, I'm Tuan Phuc's portfolio assistant. Ask me about his experience in SQL Server, Python, Power BI, MIS dashboards, ETL, securities analytics, customer funnel, and reporting automation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);

    // Reserve an empty assistant bubble we'll stream into
    setMessages((m) => [...m, { role: "assistant", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok || !res.body) {
        throw new Error("chat request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        // update last (assistant) message in-place
        setMessages((m) => {
          const last = m[m.length - 1];
          if (!last || last.role !== "assistant") return m;
          return [...m.slice(0, -1), { ...last, text: acc }];
        });
      }
      if (!acc.trim()) throw new Error("empty response");
    } catch {
      setMessages((m) => {
        const last = m[m.length - 1];
        const fallback =
          "The AI service is unavailable right now. Email Phuc directly: phucngt.me@gmail.com.";
        if (last && last.role === "assistant" && last.text === "") {
          return [...m.slice(0, -1), { ...last, text: fallback }];
        }
        return [...m, { role: "assistant", text: fallback }];
      });
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-[12.5px] font-medium text-ink-900 shadow-sm transition hover:border-ink-900 hover:shadow-md sm:bottom-6 sm:right-6"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path d="M3 4h10v7H8l-3 3v-3H3V4z" />
        </svg>
        Ask about Phuc
        <span className="ml-0.5 rounded-full bg-ink-25 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-500">
          AI
        </span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-xl sm:bottom-6 sm:right-6"
      style={{ height: "min(640px, 82vh)" }}
    >
      <header className="flex items-start justify-between border-b border-ink-100 px-4 py-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
            Portfolio assistant
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-ink-400 transition hover:text-ink-900"
          aria-label="Close chat"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M4 4l8 8M12 4L4 12" />
          </svg>
        </button>
      </header>

      {/* retrieved-sources strip removed for recruiter-facing build */}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-[13.5px] leading-relaxed">
        {messages.map((m, i) => {
          // skip empty assistant placeholder — typing dots render separately
          if (m.role === "assistant" && m.text === "" && i === messages.length - 1) return null;
          return (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-ink-900 px-3.5 py-2.5 text-white"
                    : "max-w-[85%] rounded-2xl rounded-tl-sm bg-ink-25 px-3.5 py-2.5 text-ink-700"
                }
              >
                {m.role === "assistant" ? (
                  <>
                    <span
                      // tiny markdown renderer, escaped before format substitution
                      dangerouslySetInnerHTML={{ __html: renderMd(m.text) }}
                    />
                    {busy && i === messages.length - 1 && (
                      <span className="ml-0.5 inline-block h-3 w-[1px] -translate-y-px animate-pulse bg-ink-400" />
                    )}
                  </>
                ) : (
                  m.text.split("\n").map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
        {busy && messages[messages.length - 1]?.text === "" && (
          <div className="flex">
            <div className="rounded-2xl rounded-tl-sm bg-ink-25 px-3.5 py-2.5">
              <span className="inline-flex items-center gap-1">
                <Dot delay={0} />
                <Dot delay={150} />
                <Dot delay={300} />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-ink-100 px-4 py-2.5">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.q}
              type="button"
              onClick={() => ask(s.q)}
              disabled={busy}
              className="rounded-full border border-ink-100 px-2.5 py-1 font-mono text-[10.5px] text-ink-500 transition hover:border-ink-900 hover:text-ink-900 disabled:opacity-40"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 border-t border-ink-100 px-3 py-2.5"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Ask anything about Phuc…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-md border border-ink-100 bg-white px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md bg-ink-900 text-white transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M2 6h8M7 3l3 3-3 3" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-ink-300"
      style={{ animation: "cb-bounce 1.2s infinite ease-in-out", animationDelay: `${delay}ms` }}
    />
  );
}
