import SectionLabel from "./SectionLabel";

type Project = {
  kind: string;
  title: string;
  blurb: string;
  tags: string[];
  thumb: "line" | "circles" | "flow" | "bars";
};

const projects: Project[] = [
  {
    kind: "Dashboard · Power BI",
    title: "Performance Dashboard & KPI Suite",
    blurb:
      "Weekly performance reporting layer for management — trading volume, NAV, customer activity and operational KPIs unified into one Power BI model on top of SQL Server data marts.",
    tags: ["SQL Server", "Power BI", "DAX", "Star schema"],
    thumb: "line",
  },
  {
    kind: "Analysis · Python",
    title: "Customer Intelligence Framework",
    blurb:
      "Behavioral segmentation across retail brokerage customers — RFM and ML clustering, plus a CI codebook that mapped segments to sales payout policies and outbound campaigns.",
    tags: ["Python", "scikit-learn", "Segmentation", "Strategy"],
    thumb: "circles",
  },
  {
    kind: "Customer behavior · Campaign analytics",
    title: "Paid-acquisition Funnel & NAV Analytics",
    blurb:
      "Customer-behavior and campaign-effectiveness analytics for a securities marketing team. End-to-end view of paid campaigns on Facebook, Google Ads and TikTok — from landing-page conversion through lead, account open, first deposit and first trade, into sustained activity. Cohorts and NAV trends sized where to push retention vs. acquisition spend.",
    tags: ["Meta Ads", "Google Ads", "TikTok", "SQL", "Power BI", "Cohorts", "NAV"],
    thumb: "bars",
  },
];

const ArrowOut = () => (
  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path d="M3 9L9 3M9 3H4M9 3v5" />
  </svg>
);

function Thumb({ kind }: { kind: Project["thumb"] }) {
  return (
    <>
      <div className="stripes absolute inset-0" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        {kind === "line" && (
          <>
            <g fill="#0a0a0a" opacity={0.12}>
              <rect x={20}  y={150} width={12} height={30} />
              <rect x={40}  y={140} width={12} height={40} />
              <rect x={60}  y={155} width={12} height={25} />
              <rect x={80}  y={135} width={12} height={45} />
              <rect x={100} y={142} width={12} height={38} />
              <rect x={120} y={125} width={12} height={55} />
              <rect x={140} y={130} width={12} height={50} />
              <rect x={160} y={115} width={12} height={65} />
              <rect x={180} y={120} width={12} height={60} />
              <rect x={200} y={100} width={12} height={80} />
              <rect x={220} y={105} width={12} height={75} />
              <rect x={240} y={90}  width={12} height={90} />
              <rect x={260} y={80}  width={12} height={100} />
              <rect x={280} y={60}  width={12} height={120} />
            </g>
            <g
              stroke="#0a0a0a"
              strokeWidth={1.25}
              fill="none"
              opacity={0.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M26 145 L46 130 L66 142 L86 120 L106 128 L126 110 L146 115 L166 95 L186 100 L206 78 L226 82 L246 65 L266 55 L286 35" />
            </g>
            <g fill="#0a0a0a" opacity={0.5}>
              <circle cx={286} cy={35} r={2} />
            </g>
          </>
        )}
        {kind === "circles" && (
          <>
            <g fill="#0a0a0a">
              <circle cx={80}  cy={100} r={38} opacity={0.32} />
              <circle cx={160} cy={100} r={50} opacity={0.18} />
              <circle cx={240} cy={100} r={28} opacity={0.1} />
            </g>
            <g stroke="#0a0a0a" strokeWidth={1} fill="none" opacity={0.4}>
              <circle cx={80}  cy={100} r={38} />
              <circle cx={160} cy={100} r={50} />
              <circle cx={240} cy={100} r={28} />
            </g>
          </>
        )}
        {kind === "flow" && (
          <>
            <g stroke="#0a0a0a" strokeWidth={1} fill="none" opacity={0.35}>
              <rect x={18}  y={24}  width={58} height={36} rx={3} />
              <rect x={18}  y={82}  width={58} height={36} rx={3} />
              <rect x={110} y={55}  width={58} height={36} rx={3} />
              <rect x={200} y={55}  width={58} height={36} rx={3} />
              <rect x={110} y={125} width={58} height={36} rx={3} />
              <rect x={200} y={125} width={58} height={36} rx={3} />
              <path d="M76 42 H92 V73 H110" />
              <path d="M76 100 H92 V73 H110" />
              <path d="M168 73 H200" />
              <path d="M229 91 V108 H139 V125" />
              <path d="M168 143 H200" />
            </g>
            <g fill="#0a0a0a" opacity={0.06}>
              <rect x={18}  y={24}  width={58} height={36} rx={3} />
              <rect x={200} y={55}  width={58} height={36} rx={3} />
              <rect x={200} y={125} width={58} height={36} rx={3} />
            </g>
            <g fontFamily="ui-monospace,monospace" fontSize={7} fill="#0a0a0a" opacity={0.55}>
              <text x={31}  y={46}>PDF</text>
              <text x={31}  y={104}>DWH</text>
              <text x={121} y={77}>JSON</text>
              <text x={215} y={77}>LLM</text>
              <text x={118} y={147}>HTML</text>
              <text x={213} y={147}>EMAIL</text>
            </g>
          </>
        )}
        {kind === "bars" && (
          <>
            <g fill="#0a0a0a" opacity={0.1}>
              <rect x={57}  y={125} width={30} height={55} />
              <rect x={92}  y={145} width={30} height={35} />
              <rect x={162} y={135} width={30} height={45} />
              <rect x={232} y={120} width={30} height={60} />
            </g>
            <g fill="#0a0a0a" opacity={0.32}>
              <rect x={22}  y={85}  width={30} height={95} />
              <rect x={127} y={65}  width={30} height={115} />
              <rect x={197} y={95}  width={30} height={85} />
              <rect x={267} y={75}  width={30} height={105} />
            </g>
            <g stroke="#0a0a0a" strokeWidth={1} fill="none" opacity={0.5}>
              <path d="M20 110 H300" strokeDasharray="3 3" />
            </g>
          </>
        )}
      </svg>
    </>
  );
}

function FeaturedRouterCard() {
  return (
    <article className="group flex flex-col bg-white md:col-span-2">
      <div className="relative aspect-[32/8] overflow-hidden border-b border-ink-100 md:aspect-[32/7]">
        <div className="stripes absolute inset-0" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 640 160"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <g stroke="#0a0a0a" strokeWidth={1} fill="none" opacity={0.4}>
            <rect x={40}  y={60} width={88} height={40} rx={3} />
            <rect x={160} y={60} width={88} height={40} rx={3} />
            <rect x={280} y={60} width={88} height={40} rx={3} />
            <rect x={400} y={60} width={88} height={40} rx={3} />
            <rect x={520} y={60} width={88} height={40} rx={3} />
            <path d="M128 80 H160 M248 80 H280 M368 80 H400 M488 80 H520" />
          </g>
          <g fill="#0a0a0a" opacity={0.5}>
            <path d="M160 80 l-6 -3 v6 z" />
            <path d="M280 80 l-6 -3 v6 z" />
            <path d="M400 80 l-6 -3 v6 z" />
            <path d="M520 80 l-6 -3 v6 z" />
          </g>
          <g fill="#0a0a0a" opacity={0.06}>
            <rect x={160} y={60} width={88} height={40} rx={3} />
            <rect x={520} y={60} width={88} height={40} rx={3} />
          </g>
          <g fontFamily="ui-monospace,monospace" fontSize={9} fill="#0a0a0a" opacity={0.75} textAnchor="middle">
            <text x={84}  y={84}>QUESTION</text>
            <text x={204} y={84}>CLASSIFY</text>
            <text x={324} y={84}>ROUTE</text>
            <text x={444} y={84}>PROMPT</text>
            <text x={564} y={84}>ANSWER</text>
          </g>
          <g fontFamily="ui-monospace,monospace" fontSize={7} fill="#0a0a0a" opacity={0.4} textAnchor="middle">
            <text x={84}  y={120}>input</text>
            <text x={204} y={120}>YAML rules</text>
            <text x={324} y={120}>domain tools</text>
            <text x={444} y={120}>template</text>
            <text x={564} y={120}>LLM</text>
          </g>
        </svg>
        <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-wider text-ink-400">
          Featured · AI engineering
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="text-[18px] font-medium tracking-tightish">LLM Router for Financial Q&amp;A</h3>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-400">PoC · 2025</span>
        </div>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-ink-500">
          Rule-driven orchestration that classifies intent, routes to the right tools, and
          generates grounded answers through a modular AI pipeline. Built as an internal
          PoC for securities Q&amp;A — routing logic kept separate from prompt design so new
          domains and rules can ship without touching the model layer.
        </p>
        <ul className="mt-5 grid max-w-3xl grid-cols-1 gap-y-2 text-[13.5px] leading-relaxed text-ink-500 sm:grid-cols-2 sm:gap-x-8">
          {[
            "Four-layer pipeline: classifier · decision table · tools · answer generator.",
            "Rule-first routing via YAML decision table — transparent, auditable, easy to extend.",
            "Four domains today: equity research, portfolio MIS, market data, clarify.",
            "Fail-safe mock fallback so dev/test flow works without LLM API keys.",
          ].map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-2 inline-block h-px w-3 flex-none bg-ink-300" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-1.5 font-mono text-[10.5px] text-ink-500">
          {["Python", "FastAPI", "LangChain-style", "YAML routing", "LLM orchestration", "Pytest"].map((t) => (
            <li key={t} className="rounded border border-ink-100 px-2 py-0.5">{t}</li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <span className="link-u inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-900">
            Walkthrough on request
            <ArrowOut />
          </span>
        </div>
      </div>
    </article>
  );
}

function FeaturedReportingCard() {
  return (
    <article className="group flex flex-col bg-white md:col-span-2">
      <div className="relative aspect-[32/8] overflow-hidden border-b border-ink-100 md:aspect-[32/7]">
        <div className="stripes absolute inset-0" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 640 160"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <g stroke="#0a0a0a" strokeWidth={1} fill="none" opacity={0.4}>
            <rect x={40}  y={60} width={88} height={40} rx={3} />
            <rect x={160} y={60} width={88} height={40} rx={3} />
            <rect x={280} y={60} width={88} height={40} rx={3} />
            <rect x={400} y={60} width={88} height={40} rx={3} />
            <rect x={520} y={60} width={88} height={40} rx={3} />
            <path d="M128 80 H160 M248 80 H280 M368 80 H400 M488 80 H520" />
          </g>
          <g fill="#0a0a0a" opacity={0.5}>
            <path d="M160 80 l-6 -3 v6 z" />
            <path d="M280 80 l-6 -3 v6 z" />
            <path d="M400 80 l-6 -3 v6 z" />
            <path d="M520 80 l-6 -3 v6 z" />
          </g>
          <g fill="#0a0a0a" opacity={0.06}>
            <rect x={40}  y={60} width={88} height={40} rx={3} />
            <rect x={400} y={60} width={88} height={40} rx={3} />
          </g>
          <g stroke="#0a0a0a" strokeWidth={1.5} fill="#0a0a0a" fillOpacity={0.18} opacity={0.95}>
            <rect x={280} y={60} width={88} height={40} rx={3} />
          </g>
          <g fontFamily="ui-monospace,monospace" fontSize={9} fill="#0a0a0a" opacity={0.75} textAnchor="middle">
            <text x={84}  y={84}>DATA</text>
            <text x={204} y={84}>JSON</text>
            <text x={324} y={84}>LLM</text>
            <text x={444} y={84}>HTML</text>
            <text x={564} y={84}>EMAIL</text>
          </g>
          <g fontFamily="ui-monospace,monospace" fontSize={7} fill="#0a0a0a" opacity={0.4} textAnchor="middle">
            <text x={84}  y={120}>DWH + market PDF</text>
            <text x={204} y={120}>prompt context</text>
            <text x={324} y={120}>Level-2 insight</text>
            <text x={444} y={120}>render via Playwright</text>
            <text x={564} y={120}>daily mail-out</text>
          </g>
        </svg>
        <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-wider text-ink-400">
          Featured · AI reporting pipeline
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="text-[18px] font-medium tracking-tightish">Reporting Automation Pipeline</h3>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-400">Production · Daily</span>
        </div>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-ink-500">
          Reports that don&rsquo;t just show numbers — they explain them. An LLM produces{" "}
          <span className="text-ink-900">Level-2 diagnostic insight</span> on top of
          warehouse data and market context:{" "}
          <span className="text-ink-900">why metrics moved, not just what they did</span>.
          Built in Python, end-to-end, stakeholder mailbox to stakeholder mailbox.
        </p>
        <ul className="mt-5 grid max-w-3xl grid-cols-1 gap-y-2 text-[13.5px] leading-relaxed text-ink-500 sm:grid-cols-2 sm:gap-x-8">
          {[
            "Stored procs refresh the DWH from CIU; an agent fetches the day's market-context PDF.",
            "Both feed a JSON prompt so the LLM reasons over fresh numbers + market narrative.",
            "LLM drafts the report as HTML/CSS — Playwright renders deterministic PDF.",
            "SMTP job ships to stakeholders daily, no analyst-in-the-loop.",
          ].map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-2 inline-block h-px w-3 flex-none bg-ink-300" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-1.5 font-mono text-[10.5px] text-ink-500">
          {["Python", "SQL Server", "LLM prompting", "Agentic RAG", "Playwright", "SMTP"].map((t) => (
            <li key={t} className="rounded border border-ink-100 px-2 py-0.5">{t}</li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <span className="link-u inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-900">
            Walkthrough on request
            <ArrowOut />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="border-t border-ink-100">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-12 md:py-24">
        <SectionLabel num="04" label="Featured Projects" />

        <div className="md:col-span-9">
          <h2 className="reveal max-w-2xl text-[26px] font-medium leading-[1.2] tracking-tightish md:text-[32px]">
            Selected work from inside Yuanta and VNDirect — brokerage data, marketing analytics, and reporting infrastructure.
          </h2>
          <p className="reveal mt-3 max-w-xl text-[14px] text-ink-500" data-delay="1">
            Project details are abstracted where data is non-public. Happy to walk through specifics.
          </p>

          <div
            className="reveal mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ink-100 bg-ink-100 md:grid-cols-2"
            data-delay="2"
          >
            <FeaturedReportingCard />
            <FeaturedRouterCard />

            {projects.map((p, i) => {
              const wide = i === projects.length - 1 && projects.length % 2 === 1;
              return (
                <article
                  key={p.title}
                  className={`group flex flex-col bg-white ${wide ? "md:col-span-2" : ""}`}
                >
                  <div
                    className={`relative overflow-hidden border-b border-ink-100 ${
                      wide ? "aspect-[16/10] md:aspect-[32/8]" : "aspect-[16/10]"
                    }`}
                  >
                    <Thumb kind={p.thumb} />
                    <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-wider text-ink-400">
                      {p.kind}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-[16px] font-medium tracking-tightish">{p.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{p.blurb}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10.5px] text-ink-500">
                      {p.tags.map((t) => (
                        <li key={t} className="rounded border border-ink-100 px-2 py-0.5">{t}</li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <span className="link-u inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-900">
                        Walkthrough on request
                        <ArrowOut />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
