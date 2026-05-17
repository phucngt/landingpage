import SectionLabel from "./SectionLabel";

type Role = {
  title: string;
  company: string;
  companyHref?: string;
  period: string;
  promotionNote?: string;
  bullets: React.ReactNode[];
  tags?: string[];
};

const roles: Role[] = [
  {
    title: "Senior Data Analyst",
    company: "Yuanta Vietnam",
    companyHref: "https://yuanta.com.vn/",
    period: "Jan 2025 — Present",
    promotionNote: "Promoted from Data Analyst · Jan 2026",
    bullets: [
      "Built MIS dashboards, KPI reports and ETL pipelines on SQL Server, Python and Power BI — replacing manual workbooks for management.",
      "Designed data marts and reporting structures for customer activity, trading, NAV and operational analytics.",
      "Designed a LangChain-style router PoC for an internal financial-Q&A chatbot — classifier, YAML decision table, tool routing and prompt construction kept as separate layers so rules and prompts can change independently.",
      "Ran customer behavior, funnel and performance analyses feeding weekly management reviews.",
      "Built an AI-assisted reporting pipeline that delivers Level-2 insight (diagnostic commentary, not just descriptive metrics): stored procs refresh the DWH from CIU, an agent merges market-context PDFs with fresh warehouse data into a JSON prompt, an LLM drafts the report as HTML/CSS, and Playwright renders it to PDF for daily mail-out.",
    ],
    tags: ["SQL Server", "Python", "Power BI", "LLM + Playwright", "LangChain · FastAPI", "ETL · MIS"],
  },
  {
    title: "Business Intelligence Analyst",
    company: "VNDirect Securities",
    companyHref: "https://www.vndirect.com.vn/",
    period: "Jan 2024 — Dec 2024",
    bullets: [
      "Shipped on-demand Power BI dashboards using Tabular Editor for DAX optimization and PowerBI.tips templates to keep layouts consistent across the team.",
      "Ad-hoc analysis in Power BI, Python and Excel — including ML-driven customer segmentation feeding sales strategy.",
      "Authored a Customer Intelligence framework and CI codebooks used in sales payout policies.",
    ],
    tags: ["Power BI", "DAX", "Tabular Editor", "Segmentation", "Python"],
  },
  {
    title: "Data Analytics Practitioner",
    company: "Independent / Academic",
    period: "Jan 2023 — Dec 2023",
    bullets: [
      "Applied Python, R, SQL and Tableau to real-world datasets across analytics coursework — top class performance.",
      "Completed the Google Data Analytics and Business Intelligence professional certificates.",
      <>
        Personal portfolio with academic projects and writeups:{" "}
        <a
          href="https://sites.google.com/view/nguyen-tuan-phuc?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="link-u text-ink-900"
        >
          sites.google.com/view/nguyen-tuan-phuc ↗
        </a>
      </>,
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="border-t border-ink-100 bg-ink-25">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-12 md:py-24">
        <SectionLabel num="03" label="Experience" />

        <div className="md:col-span-9">
          <h2 className="reveal max-w-2xl text-[26px] font-medium leading-[1.2] tracking-tightish md:text-[32px]">
            Five years of building things that ship — first physical systems, now data ones.
          </h2>

          <ol className="reveal mt-10 space-y-px overflow-hidden rounded-lg border border-ink-100 bg-ink-100" data-delay="1">
            {roles.map((r) => (
              <li key={r.title + r.period} className="bg-white p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-[17px] font-medium tracking-tightish">{r.title}</h3>
                    <span className="text-ink-400">·</span>
                    <span className="text-[14px] text-ink-700">
                      {r.companyHref ? (
                        <a
                          href={r.companyHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-u"
                        >
                          {r.company}
                        </a>
                      ) : (
                        r.company
                      )}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
                    {r.period}
                  </div>
                </div>
                {r.promotionNote && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink-25 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-ink-500">
                    <span className="text-accent">↑</span>
                    {r.promotionNote}
                  </div>
                )}
                <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-ink-500">
                  {r.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 inline-block h-px w-3 flex-none bg-ink-300" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {r.tags && (
                  <div className="mt-5 flex flex-wrap gap-1.5 font-mono text-[10.5px] text-ink-500">
                    {r.tags.map((t) => (
                      <span key={t} className="rounded border border-ink-100 px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}

            <li className="bg-white p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[17px] font-medium tracking-tightish">Earlier — Engineering</h3>
                  <span className="text-ink-400">·</span>
                  <span className="text-[14px] text-ink-700">
                    <a href="https://adpworkplace.vn/" target="_blank" rel="noopener noreferrer" className="link-u">ADP Group</a>
                    ,{" "}
                    <a href="https://novaservice.com.vn/" target="_blank" rel="noopener noreferrer" className="link-u">Nova Service Group</a>
                  </span>
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
                  2017 — 2022
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-ink-500">
                MEP engineer and draftsman, then procurement specialist. Five years of working
                inside operational systems before moving them to dashboards.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
