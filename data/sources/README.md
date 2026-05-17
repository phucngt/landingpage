# Drop additional knowledge here

Any `.md` file in this folder is automatically merged into the chatbot's
knowledge base at build time by `scripts/build-knowledge.mjs`.

## How chunking works

Each markdown file is split on level-2 headings (`##`). Each section becomes
one retrieval chunk with:

- `id`: `md_<filename-slug>_<index>`
- `title`: the heading text
- `content`: heading + body until the next `##`

Files **without** any `##` headings become a single chunk per file, titled
from the filename.

## Example

```markdown
## LLM Router PoC — Architecture

A four-layer pipeline: classifier → decision table → tools → answer.
The decision table lives in YAML so non-engineers can edit routing rules.

## LLM Router PoC — Domains

Four domains today: equity research, portfolio MIS, market data, clarify.
```

→ produces 2 chunks the chatbot can retrieve over.

## Workflow

1. Drop `.md` files here.
2. Run `npm run dev` (or `npm run build`) — the prebuild script regenerates
   `data/knowledge.json` automatically.
3. Commit + push. Vercel rebuilds the KB on every deploy.

## Tips

- Keep section titles **specific** and **keyword-rich** — they get a 3× score
  weight during retrieval.
- Don't put confidential company data here — these files end up in the
  bundled site and are shipped to recruiters' browsers via the API context.
- For a one-off note that doesn't need headings, just write the file and
  let it become a single chunk.
