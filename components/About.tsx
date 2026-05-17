import SectionLabel from "./SectionLabel";

export default function About() {
  return (
    <section id="about" className="border-t border-ink-100 bg-ink-25">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-12 md:py-24">
        <SectionLabel num="01" label="About" />

        <div className="md:col-span-9">
          <h2 className="reveal max-w-2xl text-[26px] font-medium leading-[1.2] tracking-tightish md:text-[32px]">
            I turn messy operational data into reporting that teams{" "}
            <span className="text-ink-400">actually open every morning.</span>
          </h2>

          <div
            className="reveal mt-8 grid max-w-3xl grid-cols-1 gap-6 text-[15px] leading-relaxed text-ink-500 md:grid-cols-2"
            data-delay="1"
          >
            <p>
              My background is in the securities industry — building data marts and
              reporting structures around customer activity, trading, NAV, and
              day-to-day operations. The work sits between SQL Server, Python, and
              Power BI: pipelines on one side, dashboards stakeholders trust on the
              other.
            </p>
            <p>
              Before analytics I trained as a mechatronics engineer, which left me
              with a habit of treating pipelines like systems — small, observable,
              and easy to fix. I care about clean models, fast iterations, and
              reports that lead to decisions instead of more meetings.
            </p>
          </div>

          <ul
            className="reveal mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink-100 bg-ink-100 sm:grid-cols-4"
            data-delay="2"
          >
            <MetaCell
              k="Now"
              v={
                <a
                  href="https://yuanta.com.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-u"
                >
                  Yuanta Vietnam
                </a>
              }
            />
            <MetaCell k="Focus" v="KPI & MIS" />
            <MetaCell k="Domain" v="Brokerage data" />
            <MetaCell k="Languages" v="EN · VI" />
          </ul>
        </div>
      </div>
    </section>
  );
}

function MetaCell({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <li className="bg-white p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-400">{k}</div>
      <div className="mt-1 text-[13px] text-ink-900">{v}</div>
    </li>
  );
}
