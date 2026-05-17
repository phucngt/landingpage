# Phuc Nguyen — Portfolio

Minimal single-page portfolio. Next.js 14 (App Router) + TailwindCSS + TypeScript.

## Stack
- Next.js 14 / React 18
- TailwindCSS 3.4
- IBM Plex Sans + JetBrains Mono via `next/font`
- Zero runtime dependencies beyond React

## Develop
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Next.js** (auto-detected).
4. Add env var `OPENROUTER_API_KEY` = your OpenRouter API key (used by the
   in-page chatbot at `/api/chat`). Get one at [openrouter.ai/keys](https://openrouter.ai/keys).
   Without it the chatbot falls back to a "service unavailable" message but
   the rest of the site works fine. Model is `anthropic/claude-haiku-4.5` —
   change `MODEL` in `app/api/chat/route.ts` to swap.
5. Deploy.

Or via CLI:
```bash
npm i -g vercel
vercel
```

## Structure
```
app/
  layout.tsx           Root layout, fonts, metadata
  page.tsx             Composes the sections + mounts <Chatbot/>
  globals.css          Tailwind + reveal/underline/grid/typing CSS
  api/chat/route.ts    Edge endpoint — RAG retrieve + OpenRouter stream
components/
  Nav · Hero · About · Skills · Experience · Projects · Contact · Footer
  Reveal.tsx           IntersectionObserver for scroll reveal
  Chatbot.tsx          Floating "Ask about Phuc" chat panel (streaming)
  SectionLabel.tsx     Shared sticky section label
data/
  knowledge.base.json  Hand-maintained primary RAG chunks
  sources/             Drop .md files here — auto-merged at build time
  knowledge.json       Auto-generated runtime KB (DO NOT EDIT)
lib/
  retrieve.ts          Keyword retrieve + SYSTEM_PROMPT + stem/synonyms
scripts/
  build-knowledge.mjs  Merges base + sources/*.md → knowledge.json
tailwind.config.ts     Custom color scale (ink-*) + font wiring
```

## How the chatbot works
1. User asks a question on the page → `POST /api/chat`
2. Edge route runs `retrieve(question, knowledge.json, k=5)` — keyword scoring with title-weighted boost + 2-gram phrase bonus, plus stemming and a synonym map (`stack` → `skill`, `hobby` → `interest`, etc.).
3. Top-5 chunks + `SYSTEM_PROMPT` injected into the OpenRouter call (`anthropic/claude-haiku-4.5`, `stream: true`).
4. Response is **streamed** back as plain text deltas — UI types out word-by-word with a blinking caret.

## Editing the chatbot's knowledge

There are two ways to add or change what the chatbot knows:

**A. Primary chunks** — edit `data/knowledge.base.json` directly. Each entry needs `id`, `title`, `content`, and optional `metadata`.

**B. Markdown drop-in** — put any `.md` file in `data/sources/`. The build script automatically splits it on `##` headings and merges each section into the runtime knowledge base. Good for project notes, blog-style writeups, FAQs, anything you'd rather author as Markdown than JSON.

The merger script (`scripts/build-knowledge.mjs`) runs automatically before `npm run dev` and `npm run build`, writing the combined output to `data/knowledge.json` (don't hand-edit that file — your changes will be overwritten). You can also run it manually with `npm run build:kb`.

Workflow: edit base JSON or drop a `.md` file → `git push` → Vercel runs `prebuild` → chatbot has the new knowledge.

## Notes
- Edit copy directly in the section components — no CMS, no data layer.
- Theme colors live in `tailwind.config.ts` under `colors.ink` and `colors.accent`.
- The placeholder project thumbnails are inline SVGs in `Projects.tsx`. Swap in real screenshots once available.
