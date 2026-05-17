import SectionLabel from "./SectionLabel";

const ArrowOut = () => (
  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path d="M3 9L9 3M9 3H4M9 3v5" />
  </svg>
);

export default function Contact() {
  return (
    <section id="contact" className="border-t border-ink-100 bg-ink-25">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-12 md:py-24">
        <SectionLabel num="05" label="Contact" />

        <div className="md:col-span-9">
          <h2 className="reveal max-w-3xl text-[36px] font-medium leading-[1.05] tracking-tighter2 md:text-[56px]">
            Hiring for data, BI or analytics?{" "}
            <span className="text-ink-400">Let&rsquo;s talk.</span>
          </h2>

          <p className="reveal mt-5 max-w-xl text-[15px] leading-relaxed text-ink-500" data-delay="1">
            Open to data analyst and BI roles in HCMC or remote. Quickest path is email — I
            reply within a day.
          </p>

          <div className="reveal mt-8 flex flex-wrap items-center gap-3" data-delay="2">
            <a
              href="mailto:phucngt.me@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-ink-700"
            >
              phucngt.me@gmail.com
              <ArrowOut />
            </a>
            <a
              href="tel:+84935593723"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-[13px] font-medium text-ink-900 transition hover:border-ink-900"
            >
              +84 93 559 3723
            </a>
            <a
              href="http://www.linkedin.com/in/tuan-phuc-nguyen-a02976150"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-[13px] font-medium text-ink-900 transition hover:border-ink-900"
            >
              LinkedIn
            </a>
          </div>

          <dl
            className="reveal mt-14 grid max-w-3xl grid-cols-2 gap-y-6 border-t border-ink-100 pt-8 sm:grid-cols-4"
            data-delay="3"
          >
            <Item k="Location" v="Ho Chi Minh City" />
            <Item k="Timezone" v="GMT+7" />
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Status</dt>
              <dd className="mt-1.5 flex items-center gap-2 text-[14px]">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Open to roles
              </dd>
            </div>
            <Item k="Reply within" v="24 hours" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">{k}</dt>
      <dd className="mt-1.5 text-[14px]">{v}</dd>
    </div>
  );
}
