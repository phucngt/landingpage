export default function Footer() {
  return (
    <footer className="border-t border-ink-100">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 font-mono text-[11px] text-ink-400">
        <div>© {new Date().getFullYear()} Nguyen Tuan Phuc</div>
        <div className="flex items-center gap-6">
          <span>Built with Next.js + Tailwind</span>
          <a href="#top" className="link-u text-ink-700">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
