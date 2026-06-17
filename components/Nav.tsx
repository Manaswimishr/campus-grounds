import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-board-line/70 bg-board/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-10 w-10 -rotate-6 items-center justify-center rounded-full border-[1.5px] border-crema/80 text-crema transition-transform group-hover:rotate-0">
            <span className="absolute inset-[3px] rounded-full border border-dashed border-crema/40" />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              CG
            </span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-chalk">
              Campus Grounds
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-chalk-dim/70">
              the counter, in code
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/#systems"
            className="hidden font-body text-sm text-chalk-dim transition-colors hover:text-chalk sm:block"
          >
            How it works
          </Link>
          <Link
            href="/counter"
            className="rounded-chip bg-crema px-4 py-2 font-body text-sm font-semibold text-espresso shadow-lift transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Start the counter
          </Link>
        </nav>
      </div>
    </header>
  );
}
