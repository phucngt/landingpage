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
  layout.tsx       Root layout, fonts, metadata
  page.tsx         Composes the sections
  globals.css      Tailwind directives + reveal/underline/grid CSS
components/
  Nav.tsx          Sticky header
  Hero.tsx         Headline + stats
  About.tsx        Bio + meta strip
  Skills.tsx       Grouped skill rows
  Experience.tsx   Roles + bullets
  Projects.tsx     Featured work cards
  Contact.tsx      CTAs + meta
  Footer.tsx
  Reveal.tsx       Client-side IntersectionObserver for scroll reveal
  SectionLabel.tsx Shared sticky section label
tailwind.config.ts Custom color scale (ink-*) + font wiring
```

## Notes
- Edit copy directly in the section components — no CMS, no data layer.
- Theme colors live in `tailwind.config.ts` under `colors.ink` and `colors.accent`.
- The placeholder project thumbnails are inline SVGs in `Projects.tsx`. Swap in real screenshots once available.
