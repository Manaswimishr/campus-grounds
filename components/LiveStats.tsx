"use client";

import { useEffect, useState } from "react";
import StatPill from "./StatPill";

interface Stats {
  queue_size: number;
  free_tables: number;
  total_tables: number;
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch {
        // Live counters are a nice-to-have on the landing page; if the
        // request fails the pills just keep their loading dash.
      }
    };
    load();
    const interval = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <StatPill
        label="Tickets in queue"
        value={String(stats?.queue_size ?? "")}
        loading={!stats}
      />
      <StatPill
        label="Tables free"
        value={stats ? `${stats.free_tables} / ${stats.total_tables}` : ""}
        loading={!stats}
      />
      <StatPill label="Departments served" value="12" />
    </div>
  );
}
