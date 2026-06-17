import Link from "next/link";
import { ArrowRight, Armchair, Route, Ticket } from "lucide-react";
import TicketBoard from "@/components/TicketBoard";
import SystemCard from "@/components/SystemCard";
import LiveStats from "@/components/LiveStats";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-chip border border-board-line bg-board-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-chalk-dim">
            Ground floor, Block B &middot; open 8am&ndash;8pm
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-chalk sm:text-6xl">
            The campus cafe counter,
            <br />
            rebuilt as <span className="text-crema">code.</span>
          </h1>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-chalk-dim sm:text-lg">
            Every ticket gets ranked the instant it&apos;s placed, every
            free table gets found by searching outward from the door, and
            every department delivery gets routed by its shortest hallway.
            No magic — just a heap, a search, and a graph.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/counter"
              className="inline-flex items-center gap-2 rounded-chip bg-crema px-5 py-3 font-body text-sm font-semibold text-espresso shadow-lift transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Walk up to the counter
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/#systems"
              className="font-body text-sm font-semibold text-chalk-dim underline-offset-4 transition-colors hover:text-chalk hover:underline"
            >
              See what&apos;s under the hood
            </Link>
          </div>
        </div>

        <TicketBoard />
      </section>

      {/* Live stats */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <LiveStats />
      </section>

      {/* Three windows at the counter */}
      <section id="systems" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-crema/80">
            Three windows, one counter
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-chalk sm:text-4xl">
            Each window solves a different kind of problem.
          </h2>
          <p className="mt-3 font-body text-sm leading-relaxed text-chalk-dim">
            They share one storefront, but underneath, each is built on the
            data structure that actually fits the job.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <SystemCard
            icon={Ticket}
            title="Order & Queue"
            description="Faculty deliveries jump straight to the front. Everyone else is served first-come, first-served within their tier — automatically, every time."
            algorithm="Priority queue · binary heap"
          />
          <SystemCard
            icon={Armchair}
            title="Find a Seat"
            description="Press one button and the system searches outward from the entrance, ring by ring, until it reaches the nearest table that's actually free."
            algorithm="Breadth-first search"
          />
          <SystemCard
            icon={Route}
            title="Department Delivery"
            description="Thirteen corridors, staircases, and department blocks, modeled as a weighted map — so a faculty order finds the shortest walk every time."
            algorithm="Dijkstra's algorithm"
          />
        </div>
      </section>
    </main>
  );
}
