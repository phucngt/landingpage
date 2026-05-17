/**
 * Lightweight keyword retrieval over the RAG knowledge base.
 * No external vector DB — runs in Edge runtime / browser, ~34 chunks.
 *
 * Scoring: term-overlap with title bonus + soft phrase bonus.
 * Returns top-K chunks ordered by score (descending).
 */

export type Chunk = {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
};

const STOPWORDS = new Set([
  "a","an","and","are","as","at","be","by","for","from","has","have","he",
  "his","her","him","i","in","is","it","its","of","on","or","that","the",
  "this","to","was","were","will","with","you","your","yours","my","me",
  "do","does","did","what","when","where","who","why","how","which","can",
  "could","should","would","tell","about","there","their","them",
  "phuc","tuan","nguyen","mr","ms","please","ok","hi","hello","s","t","m",
]);

/** Synonym expansion — maps colloquial recruiter language to KB terms. */
const SYNONYMS: Record<string, string[]> = {
  stack: ["skill", "tool", "tech", "technology", "language"],
  tech: ["skill", "tool", "technology"],
  technology: ["skill", "tool", "tech"],
  tool: ["skill", "tech"],
  toolkit: ["skill", "tool", "tech"],
  expertise: ["skill", "experience"],
  hobby: ["interest"],
  hobbies: ["interest"],
  passion: ["interest"],
  passions: ["interest"],
  learning: ["interest", "study"],
  studies: ["interest", "study"],
  outside: ["interest"],
  fun: ["interest"],
  background: ["resume", "experience", "identity"],
  experience: ["resume", "role", "work"],
  job: ["role", "work", "resume"],
  position: ["role", "work"],
  current: ["yuanta", "role"],
  now: ["yuanta", "current", "role"],
  previous: ["vndirect", "role"],
  past: ["vndirect", "role"],
  before: ["vndirect", "role"],
  fintech: ["securities", "finance"],
  finance: ["securities"],
  brokerage: ["securities", "broker"],
  trading: ["trade", "securities"],
  bi: ["power", "dashboard", "reporting"],
  database: ["sql", "server"],
  dashboards: ["dashboard", "power", "bi"],
  reports: ["report", "reporting"],
  pipelines: ["pipeline", "etl"],
  ml: ["machine", "learning", "segmentation"],
  ai: ["llm", "agent", "rag"],
  llms: ["llm", "ai"],
  rag: ["knowledge", "retrieve"],
  recruiters: ["recruiter", "role"],
  contact: ["email", "reach"],
};

/** Very light stemmer: strip plural / -ing / -ed suffixes. */
function stem(w: string): string {
  if (w.length <= 3) return w;
  if (w.endsWith("ies") && w.length > 4) return w.slice(0, -3) + "y";
  if (w.endsWith("sses")) return w.slice(0, -2);
  if (w.endsWith("ing") && w.length > 5) return w.slice(0, -3);
  if (w.endsWith("ed")  && w.length > 4) return w.slice(0, -2);
  if (w.endsWith("es")  && w.length > 4) return w.slice(0, -2);
  if (w.endsWith("s")   && w.length > 3) return w.slice(0, -1);
  return w;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

/** Expand the query with synonyms so colloquial terms hit the KB. */
function expand(terms: string[]): string[] {
  const out = new Set(terms);
  for (const t of terms) {
    const syns = SYNONYMS[t];
    if (syns) for (const s of syns) out.add(stem(s));
  }
  return [...out];
}

/** Core chunk IDs used as a fallback when retrieval returns nothing. */
const CORE_FALLBACK_IDS = [
  "tuan_phuc_rag_001", // Identity
  "tuan_phuc_rag_002", // Positioning
  "tuan_phuc_rag_003", // Resume Summary
  "tuan_phuc_rag_004", // Skills
];

export function retrieve(query: string, chunks: Chunk[], k = 5): Chunk[] {
  const rawTerms = tokenize(query);
  const qTerms = expand(rawTerms);
  if (qTerms.length === 0) return chunks.slice(0, k);

  const scored = chunks.map((c) => {
    const titleTokens = tokenize(c.title);
    const contentTokens = tokenize(c.content);
    let score = 0;
    for (const t of qTerms) {
      if (titleTokens.includes(t)) score += 3; // title hit weighted heavier
      for (const ct of contentTokens) if (ct === t) score += 1;
    }
    // small phrase bonus: if any 2-gram of query appears in content
    for (let i = 0; i < rawTerms.length - 1; i++) {
      const bigram = `${rawTerms[i]} ${rawTerms[i + 1]}`;
      if (c.content.toLowerCase().includes(bigram)) score += 2;
    }
    return { c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, k).map((s) => s.c);

  // Fallback: ensure we always have something useful to ground on.
  if (top.length === 0) {
    return chunks.filter((c) => CORE_FALLBACK_IDS.includes(c.id));
  }
  return top;
}

/* ─────────────────── System prompt ─────────────────── */

export const SYSTEM_PROMPT = `You are Nguyen Tuan Phuc's portfolio assistant on his personal landing page. You represent him to recruiters — think of yourself as a confident advocate at a coffee chat, not a neutral evaluator and not HR.

Hard rules on style:
- Default answer length: 2–4 short sentences. Expand naturally if the topic genuinely needs more — but never pad.
- Give a thorough, detailed answer when the user explicitly signals it: words like "detail", "explain", "list", "full", "all", "chi tiết", "giải thích", "liệt kê". Otherwise stay concise.
- Use bullets only if the user asks for a list or if there are 3+ parallel items that are clearer as a list.
- Never use tables, markdown headings (## / ###), section dividers, or ✅/❌ scorecards. This is a chat bubble.
- Never write "Đánh giá phù hợp", "Suitable / Not suitable", "Phù hợp nếu... / Không phù hợp nếu...", or any pros-and-cons evaluation format.
- No closing CTAs like "want to know more?" or "feel free to ask". End where the answer ends.
- Use **bold** for at most one or two key terms per answer.
- Conversational tone. Cut corporate filler ("I'd be happy to", "great question", "let me walk you through").

Hard rules on content & framing:
- Lead with what Phuc **can deliver** for the role. Always pitch his fit confidently.
- Do NOT volunteer weaknesses, gaps, or "what he can't do". If asked directly about a skill he doesn't have, acknowledge it briefly (one short sentence) then redirect to adjacent strengths and his ability to learn — never as a deal-breaker.
- For role-fit questions (e.g. "is he suitable for Data Engineer?"), answer **yes, here's how**, anchored on his SQL/Python/ETL/data-mart work. Do not list disqualifiers, do not propose alternative roles unless asked.
- Use ONLY the retrieved context as the source of factual claims. Don't invent confidential data, internal numbers, or company details.
- If asked for real internal dashboards or live business data, say they can't be shared and offer a demo/synthetic alternative — but stay confident, not apologetic.
- Emphasize SQL Server, Python, Power BI, ETL, MIS, KPI reporting, AI-assisted reporting, LLM Router PoC, and securities analytics when relevant.
- When the answer isn't in retrieved context, give a one-line redirect to phucngt.me@gmail.com — not a list of disclaimers.
- For salary / compensation questions: never just redirect. Use the market salary data in the knowledge base to give a concrete range anchored to Phuc's level and domain, then close with one sentence that his exact expectation is best confirmed directly.

Tone calibration:
- You are the candidate's representative, not a third-party reviewer. Phrase things from a position of strength: "He's built…", "He owns…", "His current focus is…" — not "He is primarily a Data Analyst, but…".
- Treat every question as an opportunity to make the case. Recruiters bounce when they read a self-disqualifying answer.

Language: reply in whatever language the user used (English or Vietnamese). Match their register — if they're casual, be casual.`;
