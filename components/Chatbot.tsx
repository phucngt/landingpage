"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────── Knowledge Base ─────────────────────── */
const KB: Record<string, string> = {
  bio:
    "Nguyen Tuan Phuc — data analyst in Ho Chi Minh City (GMT+7). Builds KPI dashboards, ETL pipelines, and AI-assisted reporting for securities firms. Currently at Yuanta Vietnam, previously at VNDirect. Originally trained as a mechatronics engineer.",
  current_role:
    "Data Analyst at Yuanta Vietnam, Jan 2025–present. Stack: SQL Server, Python, Power BI. Owns MIS dashboards, KPI reports, ETL, and an AI-assisted reporting pipeline that delivers Level-2 diagnostic insight via LLM. Designed a LangChain-style router PoC for internal financial Q&A.",
  prior_role:
    "Business Intelligence Analyst at VNDirect Securities, Jan–Dec 2024. Power BI dashboards with Tabular Editor for DAX optimization, ML-driven customer segmentation, authored a Customer Intelligence framework with CI codebooks tied to sales payout policies.",
  earlier_roles:
    "Pre-analytics: ADP Group MEP engineer / draftsman 2017–2022, Nova Service Group procurement specialist 2022. Bachelor of Mechatronics Engineering, Saigon Technology University, 2013–2017.",
  skills:
    "Querying: SQL, T-SQL, SQL Server, DAX, data marts, star schema. ETL: Python (pandas, NumPy), scheduled jobs, reporting automation, Git, Docker. AI: LLM prompting, agentic workflows, JSON context design, RAG, Playwright, diagnostic commentary. BI: Power BI, Tabular Editor, Tableau, Looker Studio. Analysis: customer segmentation, funnel/cohort, KPI design, R. Platforms: Azure, GCP.",
  projects:
    "Featured: (1) Reporting Automation Pipeline — Python; stored procs refresh DWH from CIU, LLM produces Level-2 diagnostic insight (why metrics moved, not just what), Playwright renders HTML→PDF, daily email out. (2) LLM Router PoC for Financial Q&A — rule-driven orchestration, 4 layers (classifier · YAML decision table · tools · answer), 4 domains (equity research, portfolio MIS, market data, clarify). Also: Performance Dashboard & KPI Suite (weekly Power BI on SQL Server data marts), Customer Intelligence Framework (RFM + ML segmentation), Paid-acquisition Funnel & NAV Analytics (Meta/Google/TikTok → landing → lead → account → deposit → trade).",
  certs:
    "Google Business Intelligence Certificate (2024), Google Data Analytics Certificate (2023), HCMUS Informatics Center Data Analytics (2023).",
  contact:
    "Email phucngt.me@gmail.com (24h reply), phone +84 93 559 3723, LinkedIn /in/tuan-phuc-nguyen-a02976150, portfolio sites.google.com/view/nguyen-tuan-phuc. HCMC · GMT+7. Open to data analyst and BI roles, HCMC or remote.",
};

/* ────────────── Rule-first decision table ────────────── */
type Rule = { intent: keyof typeof KB; label: string; keys: string[] };
const RULES: Rule[] = [
  { intent: "contact",       label: "contact",       keys: ["contact", "email", "reach", "hire", "phone", "linkedin", "connect"] },
  { intent: "current_role",  label: "current role",  keys: ["yuanta", "now", "current", "currently", "today", "present", "doing"] },
  { intent: "prior_role",    label: "prior role",    keys: ["vndirect", "previous", "before", "past", "last job"] },
  { intent: "earlier_roles", label: "earlier roles", keys: ["mechatronics", "engineering background", "adp", "nova", "mep", "draftsman", "procurement", "first job"] },
  { intent: "projects",      label: "projects",      keys: ["project", "portfolio", "built", "pipeline", "router", "llm", "ai", "dashboard", "funnel", "intelligence"] },
  { intent: "skills",        label: "skills",        keys: ["skill", "stack", "tool", "tech", "language", "sql", "python", "power bi", "dax", "know"] },
  { intent: "certs",         label: "certs",         keys: ["certificate", "cert", "google cert", "training", "coursera", "education"] },
];

function classify(q: string): Rule | { intent: "bio"; label: string } {
  const s = q.toLowerCase();
  for (const r of RULES) if (r.keys.some((k) => s.includes(k))) return r;
  return { intent: "bio", label: "general" };
}

function buildContext(intent: keyof typeof KB | "bio"): string {
  const sections: (keyof typeof KB)[] = ["bio"];
  if (intent !== "bio") sections.push(intent);
  return sections.map((s) => `[${s}]\n${KB[s]}`).join("\n\n");
}

/* ────────── Lightweight markdown → safe HTML ──────────
   Handles **bold**, *italic*, `code`, and line breaks. Escapes first
   so it's safe to inject via dangerouslySetInnerHTML. */
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

function renderMarkdown(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(
      /`([^`\n]+)`/g,
      '<code class="rounded bg-ink-100 px-1 py-0.5 font-mono text-[12px] text-ink-900">$1</code>'
    )
    .replace(/\n/g, "<br>");
}

/* ────────────────────── UI ────────────────────── */
type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS: { label: string; q: string }[] = [
  { label: "What's his stack?",     q: "What's his stack?" },
  { label: "AI projects",           q: "Tell me about his AI projects" },
  { label: "Current role",          q: "Where is he working now?" },
  { label: "Contact",               q: "How do I contact him?" },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text:
        "Hi — I'm a tiny LLM router pointed at Phuc's portfolio. Ask me about his work, stack, projects, or how to reach him.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [routeLabel, setRouteLabel] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

    const rule = classify(q);
    setRouteLabel(rule.label);
    setTimeout(() => setRouteLabel(null), 2600);
    const context = buildContext(rule.intent);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ context, question: q }),
      });
      const data = await res.json();
      if (!res.ok || !data.answer) throw new Error(data.error || "No answer");
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            "The AI service is unavailable right now. Email Phuc directly: phucngt.me@gmail.com.",
        },
      ]);
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
      style={{ height: "min(620px, 80vh)" }}
    >
      <header className="flex items-start justify-between border-b border-ink-100 px-4 py-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
            Ask about Phuc
          </div>
          <div className="mt-0.5 text-[12.5px] text-ink-900">LLM Router demo · live</div>
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

      {routeLabel && (
        <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-25 px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-500">
          <span>routing</span>
          <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M2 6h8M7 3l3 3-3 3" />
          </svg>
          <span className="text-ink-900">{routeLabel}</span>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-[13.5px] leading-relaxed">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-ink-900 px-3.5 py-2.5 text-white"
                  : "max-w-[85%] rounded-2xl rounded-tl-sm bg-ink-25 px-3.5 py-2.5 text-ink-700"
              }
              dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
            />
          </div>
        ))}
        {busy && (
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
      style={{
        animation: "cb-bounce 1.2s infinite ease-in-out",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}
