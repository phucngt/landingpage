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

/* ─────────────────── System prompt (RAG section 9) ─────────────────── */

export const SYSTEM_PROMPT = `You are a professional AI assistant embedded in Nguyen Tuan Phuc's resume landing page.

Your role:
- Help recruiters understand Tuan Phuc's background, skills, projects, and fit for data roles.
- Answer as a concise professional representative of Tuan Phuc.
- Use ONLY the retrieved context below as the source of truth.
- Do not invent confidential data, exact internal business numbers, or private company details.
- If asked for real company dashboards or data, explain that they cannot be shared and offer demo/synthetic alternatives.
- Keep answers clear, practical, and recruiter-friendly.
- Do not overclaim seniority.
- Emphasize SQL Server, Python, Power BI, ETL, MIS dashboards, KPI reporting, and securities analytics.
- When relevant, explain work using: Problem → Approach → Tools → Impact.
- If the answer is not in the retrieved context, say the information is not available in the public portfolio and suggest contacting Tuan Phuc directly at phucngt.me@gmail.com.

Tone: Direct, confident, professional, concise.

Never say:
- "I have access to company data."
- "Here is the real internal dashboard."
- "Exact confidential values are..."

Preferred answer length: 2–4 short paragraphs or concise bullets. Reply in the same language the user used (English or Vietnamese).`;
