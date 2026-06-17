"use client";

import { useState } from "react";
import { Armchair, Route, Ticket } from "lucide-react";
import OrderPanel from "@/components/OrderPanel";
import SeatPanel from "@/components/SeatPanel";
import DeliveryPanel from "@/components/DeliveryPanel";

const TABS = [
  { id: "order", label: "Order & Queue", icon: Ticket },
  { id: "seats", label: "Find a Seat", icon: Armchair },
  { id: "delivery", label: "Delivery Route", icon: Route },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CounterPage() {
  const [active, setActive] = useState<TabId>("order");

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-crema/80">
          The counter
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-chalk sm:text-4xl">
          Three windows. Pick one.
        </h1>
      </div>

      <div className="mb-8 flex w-full flex-col gap-2 rounded-2xl border border-board-line bg-board-soft p-1.5 sm:w-fit sm:flex-row">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={
                "flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-body text-sm font-medium transition-colors " +
                (isActive
                  ? "bg-crema text-espresso"
                  : "text-chalk-dim hover:bg-board hover:text-chalk")
              }
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {active === "order" && <OrderPanel />}
      {active === "seats" && <SeatPanel />}
      {active === "delivery" && <DeliveryPanel />}
    </main>
  );
}
