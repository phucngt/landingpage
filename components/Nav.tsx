const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden
  >
    <path d="M2 6h8M7 3l3 3-3 3" />
  </svg>
);

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5 text-[13px] font-medium tracking-tightish">
          <span className="inline-block h-2 w-2 rotate-45 bg-ink-900" />
          <span>Phuc Nguyen</span>
          <span className="hidden text-ink-300 sm:inline">/</span>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-ink-400 sm:inline">
            Data Analyst
          </span>
        </a>

        <ul className="hidden items-center gap-7 text-[13px] text-ink-500 md:flex">
          <li><a href="#about" className="link-u hover:text-ink-900">About</a></li>
          <li><a href="#skills" className="link-u hover:text-ink-900">Skills</a></li>
          <li><a href="#experience" className="link-u hover:text-ink-900">Experience</a></li>
          <li><a href="#projects" className="link-u hover:text-ink-900">Projects</a></li>
        </ul>

        <a
          href="#contact"
          className="group inline-flex items-center gap-2 rounded-full border border-ink-900 bg-ink-900 px-3.5 py-1.5 text-[12px] font-medium text-white transition hover:bg-ink-700"
        >
          Get in touch
          <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
        </a>
      </nav>
    </header>
  );
}
