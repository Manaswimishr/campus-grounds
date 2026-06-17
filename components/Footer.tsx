const STACK = ["Made by Manaswi"] as const;

export default function Footer() {
  return (
    <footer className="border-t border-board-line/70 bg-board">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base text-chalk">Campus Grounds</p>
          <p className="mt-1 max-w-md font-body text-sm text-chalk-dim">
            A campus cafe&apos;s order counter, rebuilt as an online system: priority 
            queue for tickets,  breadth-first search for tables,
            and Dijkstra&apos;s algorithm for getting coffee to your desk.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-chip border border-board-line px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-chalk-dim"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
