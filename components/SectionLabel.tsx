export default function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="md:col-span-3">
      <div className="reveal sticky top-24 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
        <span className="mr-2 text-ink-900">{num}</span> {label}
      </div>
    </div>
  );
}
