import SectionLabel from "./SectionLabel";

type Group = { label: string; items: string[] };

const groups: Group[] = [
  {
    label: "Querying & Modeling",
    items: ["SQL", "T-SQL · MS SQL Server", "DAX", "Data marts", "Star schema"],
  },
  {
    label: "ETL & Automation",
    items: ["Python (pandas, NumPy)", "Scheduled jobs", "Reporting automation", "Git", "Docker"],
  },
  {
    label: "AI & Insight Generation",
    items: [
      "LLM prompting",
      "Agentic workflows",
      "JSON context design",
      "RAG over market PDFs",
      "Playwright",
      "Diagnostic commentary",
    ],
  },
  {
    label: "BI & Visualization",
    items: ["Power BI", "Tabular Editor", "Tableau", "Looker Studio", "Excel / Sheets"],
  },
  {
    label: "Analysis",
    items: ["Customer segmentation", "Funnel & cohort analysis", "KPI design", "Statistical modeling"],
  },
  {
    label: "Platforms",
    items: ["Azure", "Google Cloud Platform", "Windows SQL Server"],
  },
];

const certs: { label: string; href?: string }[] = [
  { label: "GEM Institute · Data-Driven Decision Making Cert · 2026" },
  {
    label: "Google BI Cert · 2024",
    href: "https://coursera.org/share/d9b7110342f1b24b3e91efba5661cd0c",
  },
  {
    label: "Google Data Analytics Cert · 2023",
    href: "https://coursera.org/share/de2b97b874c2b4ee8ab6aecdf4ba7db6",
  },
  { label: "HCMUS Data Analytics · 2023" },
];

export default function Skills() {
  return (
    <section id="skills" className="border-t border-ink-100">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-12 md:py-24">
        <SectionLabel num="02" label="Skills" />

        <div className="md:col-span-9">
          <h2 className="reveal max-w-2xl text-[26px] font-medium leading-[1.2] tracking-tightish md:text-[32px]">
            The stack I reach for, grouped by where it sits in the pipeline.
          </h2>

          <div className="reveal mt-10 divide-y divide-ink-100 border-y border-ink-100" data-delay="1">
            {groups.map((g) => (
              <div key={g.label} className="grid grid-cols-12 gap-4 py-5">
                <div className="col-span-12 md:col-span-3">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
                    {g.label}
                  </div>
                </div>
                <ul className="col-span-12 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink-800 md:col-span-9">
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="reveal mt-8 flex flex-wrap gap-2 font-mono text-[11px] text-ink-500" data-delay="2">
            {certs.map((c) =>
              c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ink-100 px-2.5 py-1 transition hover:border-ink-900 hover:text-ink-900"
                >
                  {c.label} ↗
                </a>
              ) : (
                <span key={c.label} className="rounded-full border border-ink-100 px-2.5 py-1">
                  {c.label}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
