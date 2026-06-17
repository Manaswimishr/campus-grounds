"use client";

import { useEffect, useState } from "react";
import { Loader2, Navigation } from "lucide-react";

interface Location {
  id: number;
  name: string;
  department: string;
  floor: number;
}

interface Step {
  name: string;
  distanceFromCafe: number;
}

export default function DeliveryPanel() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [destination, setDestination] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ distance: number; steps: Step[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/delivery/locations")
      .then((r) => r.json())
      .then((d) => {
        const opts: Location[] = (d.locations ?? []).filter((l: Location) => l.id !== 0);
        setLocations(opts);
        if (opts.length > 0) setDestination(opts[0].id);
      })
      .catch(() => setError("Couldn't load delivery locations."));
  }, []);

  const handleCalculate = async () => {
    if (destination === null) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/delivery/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination }),
      });
      const data = await res.json();
      if (!data.reachable) {
        setError("No route found to that location.");
      } else {
        setResult({ distance: data.distance, steps: data.steps });
      }
    } catch {
      setError("Couldn't reach the delivery system.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-5 rounded-2xl border border-board-line bg-board-soft p-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-chalk">
            Department delivery
          </h3>
          <p className="mt-1 font-body text-sm leading-relaxed text-chalk-dim">
            Corridors, staircases, and department blocks are modeled as a
            weighted map. 
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-chalk-dim">
            Deliver to
          </span>
          <select
            value={destination ?? ""}
            onChange={(e) => setDestination(Number(e.target.value))}
            className="rounded-lg border border-board-line bg-board px-3 py-2.5 font-body text-sm text-chalk focus:border-crema/60"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={handleCalculate}
          disabled={loading || destination === null}
          className="inline-flex items-center justify-center gap-2 rounded-chip bg-crema px-4 py-3 font-body text-sm font-semibold text-espresso shadow-lift transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          Calculate the route
        </button>

        {error && (
          <p className="rounded-lg bg-board px-3 py-2 font-mono text-xs text-stamp">{error}</p>
        )}
      </div>

      <div className="rounded-2xl border border-board-line bg-board-soft p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-chalk">Route</h3>
          {result && (
            <span className="font-mono text-sm font-semibold text-crema">
              {result.distance}m total
            </span>
          )}
        </div>

        {!result && (
          <p className="rounded-lg border border-dashed border-board-line px-4 py-10 text-center font-body text-sm text-chalk-dim">
            Pick a destination and see the shortest path.
          </p>
        )}

        {result && (
          <ol className="flex flex-col gap-0">
            {result.steps.map((step, idx) => {
              const isLast = idx === result.steps.length - 1;
              const hop =
                idx === 0 ? 0 : step.distanceFromCafe - result.steps[idx - 1].distanceFromCafe;
              return (
                <li key={step.name} className="relative flex gap-4 pb-7 last:pb-0">
                  {!isLast && (
                    <span className="absolute left-[7px] top-4 h-full w-px bg-board-line" />
                  )}
                  <span
                    className={
                      "relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 " +
                      (isLast ? "border-crema bg-crema" : "border-crema/50 bg-board")
                    }
                  />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-chalk">{step.name}</p>
                    <p className="font-mono text-[11px] text-chalk-dim">
                      {idx === 0
                        ? "starting point"
                        : `+${hop}m \u00b7 ${step.distanceFromCafe}m from the cafe`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
