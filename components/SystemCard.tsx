import type { LucideIcon } from "lucide-react";

export default function SystemCard({
  icon: Icon,
  title,
  description,
  algorithm,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  algorithm: string;
}) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-board-line bg-board-soft p-6 transition-colors hover:border-crema/40">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-board text-crema">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-chalk">{title}</h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-chalk-dim">
          {description}
        </p>
      </div>
      <div className="mt-auto pt-2">
        <span className="inline-block rounded-sm border border-board-line bg-board px-2.5 py-1 font-mono text-[11px] text-crema/90">
          {algorithm}
        </span>
      </div>
    </div>
  );
}
