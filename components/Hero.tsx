export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="reveal mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent text-accent" />
          </span>
          Available for data &amp; BI roles · Ho Chi Minh City
        </div>

        <h1 className="reveal" data-delay="1">
          <span className="block max-w-3xl text-[40px] font-medium leading-[1.05] tracking-tighter2 text-ink-900 sm:text-[56px] md:text-[64px]">
            Reporting systems and analytics{" "}
            <span className="text-ink-400">for capital markets.</span>
          </span>
        </h1>

        <p
          className="reveal mt-6 max-w-xl text-[15px] leading-relaxed text-ink-500 md:text-[16px]"
          data-delay="2"
        >
          I&rsquo;m Phuc — a data analyst building KPI dashboards, ETL pipelines, and
          customer intelligence for securities firms. Currently at{" "}
          <a
            href="https://yuanta.com.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-u text-ink-900"
          >
            Yuanta Vietnam
          </a>
          , previously{" "}
          <a
            href="https://www.vndirect.com.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-u text-ink-900"
          >
            VNDirect
          </a>
          .
        </p>

        <div className="reveal mt-8 flex flex-wrap items-center gap-3" data-delay="3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-ink-700"
          >
            View selected work
            <svg
              className="h-3 w-3 transition group-hover:translate-x-0.5"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path d="M2 6h8M7 3l3 3-3 3" />
            </svg>
          </a>
          <a
            href="mailto:phucngt.me@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-[13px] font-medium text-ink-900 transition hover:border-ink-900"
          >
            phucngt.me@gmail.com
          </a>
        </div>

        <dl
          className="reveal mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-ink-100 pt-8 sm:grid-cols-4"
          data-delay="4"
        >
          <Stat label="Experience" value="2+ yrs" />
          <Stat label="Industry" value="Securities" />
          <Stat label="Stack" value="SQL · Python · BI" />
          <Stat label="Based in" value="HCMC · GMT+7" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">{label}</dt>
      <dd className="mt-1.5 text-[22px] font-medium tracking-tightish">{value}</dd>
    </div>
  );
}
