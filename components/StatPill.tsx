export default function StatPill({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-board-line bg-board-soft px-6 py-5 text-center">
      <span className="font-display text-3xl font-semibold text-crema">
        {loading ? "\u2014" : value}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-chalk-dim">
        {label}
      </span>
    </div>
  );
}
