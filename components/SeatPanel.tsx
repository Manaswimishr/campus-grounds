"use client";

import { useEffect, useState } from "react";
import { DoorOpen, Loader2, MapPin } from "lucide-react";

type GridCell = "wall" | "aisle" | "table_free" | "table_occupied";

const ENTRANCE_ROW = 3;
const ENTRANCE_COL = 0;

export default function SeatPanel() {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<{ row: number; col: number; distance: number } | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);

  const refreshGrid = async () => {
    try {
      const res = await fetch("/api/seat/grid");
      const data = await res.json();
      setGrid(data.grid ?? []);
    } catch {
      // ignore, next poll will retry
    }
  };

  useEffect(() => {
    refreshGrid();
  }, []);

  const handleFindSeat = async () => {
    setLoading(true);
    setMessage(null);
    setFound(null);
    try {
      const res = await fetch("/api/seat/find", { method: "POST" });
      const data = await res.json();
      if (!data.found) {
        setMessage("Every table is full right now.");
      } else {
        setFound({ row: data.row, col: data.col, distance: data.distance });
        setMessage(
          `Found you Table (${data.row}, ${data.col}) \u2014 ${data.distance} steps from the door.`
        );
      }
      await refreshGrid();
    } catch {
      setMessage("Couldn't reach the seating system.");
    } finally {
      setLoading(false);
    }
  };

  const handleFreeSeat = async (row: number, col: number) => {
    try {
      await fetch("/api/seat/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col }),
      });
      setFound(null);
      await refreshGrid();
    } catch {
      // no-op
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-5 rounded-2xl border border-board-line bg-board-soft p-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-chalk">Find a seat</h3>
          <p className="mt-1 font-body text-sm leading-relaxed text-chalk-dim">
            Breadth-first search fans out from the door one ring at a time,
            so the very first free table it reaches is the
            closest one.
          </p>
        </div>
        <button
          onClick={handleFindSeat}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-chip bg-crema px-4 py-3 font-body text-sm font-semibold text-espresso shadow-lift transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
          Find me a seat
        </button>
        {message && (
          <p className="rounded-lg bg-board px-3 py-2 font-mono text-xs text-crema">{message}</p>
        )}
        <div className="flex flex-col gap-2 pt-2 font-mono text-[11px] text-chalk-dim">
          <Legend swatch="border border-crema/50" label="Free table — tap to find" />
          <Legend swatch="bg-espresso-soft" label="Occupied — tap to clear it" />
          <Legend swatch="bg-board" label="Wall" />
        </div>
      </div>

      <div className="flex items-center justify-center rounded-2xl border border-board-line bg-board-soft p-6">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 8}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isEntrance = r === ENTRANCE_ROW && c === ENTRANCE_COL;
              const isJustFound = found && found.row === r && found.col === c;
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => cell === "table_occupied" && handleFreeSeat(r, c)}
                  disabled={cell !== "table_occupied"}
                  className={
                    "relative flex h-10 w-10 items-center justify-center rounded-md transition-all sm:h-12 sm:w-12 " +
                    (cell === "wall"
                      ? "bg-board"
                      : cell === "table_free"
                      ? "cursor-default border-2 border-crema/50 bg-board-soft"
                      : "border-2 border-espresso/40 bg-espresso-soft/70 hover:brightness-110")
                  }
                  title={
                    cell === "table_free"
                      ? "Free table"
                      : cell === "table_occupied"
                      ? "Occupied \u2014 click to clear"
                      : undefined
                  }
                >
                  {isEntrance && <DoorOpen size={16} className="text-chalk-dim" />}
                  {isJustFound && (
                    <span className="absolute inset-0 animate-pulse rounded-md ring-2 ring-crema" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3.5 w-3.5 rounded-sm ${swatch}`} />
      {label}
    </div>
  );
}
