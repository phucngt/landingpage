# Featured AI Projects

These are Phuc's flagship AI-focused projects shown as featured cards on his portfolio.

## Reporting Automation Pipeline (AI-assisted, production)

A production reporting pipeline running daily for the brokerage business. Built end-to-end in Python:

- Stored-procedure jobs refresh the data warehouse (DWH) from the CIU core system on schedule
- An agent fetches the day's market-context PDF from the firm's research portal
- DWH metrics + market PDF are merged into a structured JSON prompt
- An LLM (Claude / GPT class) generates the report as HTML + CSS, including **Level-2 diagnostic insight** — commentary on *why* metrics moved, not just *what* they did
- Playwright renders the HTML deterministically to PDF
- An SMTP job emails the PDF to stakeholders before the morning meeting

The Level-2 insight layer is what makes this stand out. Standard MIS dashboards stop at descriptive metrics (Level 1: "NAV is down 3%"). This pipeline goes a step further (Level 2: "NAV is down 3% — driven by margin unwind on tech tickers following yesterday's bond auction"), grounded in both the warehouse data and the day's market narrative.

Stack: Python, SQL Server, OpenAI/Anthropic LLM, Playwright, JSON prompt design, SMTP. Production cadence: daily.

## LLM Router for Financial Q&A (PoC, internal)

A LangChain-style router PoC Phuc designed for an internal financial Q&A chatbot at the brokerage. Built as a clean four-layer architecture so routing rules and prompt design stay independently editable:

1. **Classifier** — small model or rules tags the incoming question with an intent
2. **Decision table** — a YAML file maps intent → which downstream tool/domain to invoke (no code changes to add a new route)
3. **Tools** — domain-specific handlers: equity research lookup, portfolio MIS query, market data fetch, clarify-and-ask-back
4. **Answer generator** — template + LLM produces the grounded reply

Four domains live today: equity research, portfolio MIS, market data, clarify. The whole pipeline ships with a mock fallback so engineers can dev + run tests without burning LLM API keys.

The design principle: keep routing logic (YAML) separate from prompt design (templates) separate from the model itself. Swap any of the three without touching the other two.

Stack: Python, FastAPI, LangChain-style routing, YAML decision tables, LLM orchestration, Pytest.

## What "AI projects" means on this portfolio

When recruiters ask about AI projects on Phuc's portfolio, point at these two — they are the dedicated AI work, not just "uses ML somewhere". Both are anchored in real brokerage operations: one ships PDFs to stakeholders every morning in production, the other is the PoC that the production pipeline borrows architecture ideas from.

Phuc's broader AI skillset: LLM prompting, agentic workflows, JSON context design, retrieval (RAG) over market PDFs and internal knowledge bases, Playwright-based deterministic rendering, diagnostic commentary generation.
