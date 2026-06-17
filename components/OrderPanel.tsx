"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { MENU } from "@/lib/menu";

interface OrderView {
  id: number;
  customer_name: string;
  item: string;
  priority: 1 | 2 | 3;
  timestamp: number;
  is_faculty_delivery: boolean;
  delivery_location: string;
}

interface Location {
  id: number;
  name: string;
  department: string;
  floor: number;
}

type ServiceType = "student" | "non-teaching staff" | "Teaching faculty";

function tagFor(order: OrderView): { label: string; stamped: boolean } {
  if (order.is_faculty_delivery) {
    return { label: `Faculty \u2192 ${order.delivery_location || "Dept"}`, stamped: true };
  }
  if (order.priority === 2) return { label: "student", stamped: false };
  return { label: "non-teaching faculty", stamped: false };
}

function timeAgo(ts: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export default function OrderPanel() {
  const [name, setName] = useState("");
  const [itemId, setItemId] = useState(MENU[0].id);
  const [serviceType, setServiceType] = useState<ServiceType>("student");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [serving, setServing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const selectedItem = useMemo(() => MENU.find((m) => m.id === itemId)!, [itemId]);

  const refreshQueue = async () => {
    try {
      const res = await fetch("/api/order/queue");
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch {
      // best-effort; queue view will just retry on the next poll
    }
  };

  useEffect(() => {
    refreshQueue();
    fetch("/api/delivery/locations")
      .then((r) => r.json())
      .then((d) => setLocations((d.locations ?? []).filter((l: Location) => l.id !== 0)))
      .catch(() => {});
    const queuePoll = setInterval(refreshQueue, 5000);
    const clockPoll = setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      clearInterval(queuePoll);
      clearInterval(clockPoll);
    };
  }, []);

  useEffect(() => {
    if (serviceType === "Teaching faculty" && !deliveryLocation && locations.length > 0) {
      setDeliveryLocation(locations[0].name);
    }
  }, [serviceType, locations, deliveryLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Enter a name for the ticket first.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/order/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          item: selectedItem.name,
          priority: serviceType === "non-teaching staff" ? 3 : 2,
          is_faculty_delivery: serviceType === "Teaching faculty",
          delivery_location: serviceType === "Teaching faculty" ? deliveryLocation : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setMessage(`Ticket #${String(data.order_id).padStart(3, "0")} placed.`);
      setName("");
      await refreshQueue();
    } catch (err: any) {
      setMessage(err.message ?? "Could not place the order.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleServeNext = async () => {
    setServing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/order/serve", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Queue is empty");
      setMessage(`Served ticket #${String(data.id).padStart(3, "0")} \u2014 ${data.customer_name}.`);
      await refreshQueue();
    } catch (err: any) {
      setMessage(err.message ?? "Queue is empty.");
    } finally {
      setServing(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-board-line bg-board-soft p-6"
      >
        <div>
          <h3 className="font-display text-xl font-semibold text-chalk">Place a ticket</h3>
          <p className="mt-1 font-body text-sm text-chalk-dim">
            Picked up by priority and type.
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-chalk-dim">
            Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aanya Rao"
            className="rounded-lg border border-board-line bg-board px-3 py-2.5 font-body text-sm text-chalk placeholder:text-chalk-dim/50 focus:border-crema/60"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-chalk-dim">
            Item
          </span>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="rounded-lg border border-board-line bg-board px-3 py-2.5 font-body text-sm text-chalk focus:border-crema/60"
          >
            {(["Coffee", "Tea", "Cold", "Bakery"] as const).map((cat) => (
              <optgroup key={cat} label={cat}>
                {MENU.filter((m) => m.category === cat).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} &middot; ₹{m.price}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-chalk-dim">
            Service
          </span>
          {(
            [
              { id: "student", label: "Student" },
              { id: "non-teaching staff", label: "Non-teaching staff" },
              { id: "Teaching faculty", label: "Teaching faculty" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-board-line px-3 py-2 font-body text-sm text-chalk transition-colors hover:border-crema/40"
            >
              <input
                type="radio"
                name="service"
                checked={serviceType === opt.id}
                onChange={() => setServiceType(opt.id)}
                className="accent-crema"
              />
              {opt.label}
            </label>
          ))}
        </div>

        {serviceType === "Teaching faculty" && (
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wide text-chalk-dim">
              Deliver to
            </span>
            <select
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="rounded-lg border border-board-line bg-board px-3 py-2.5 font-body text-sm text-chalk focus:border-crema/60"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-chip bg-crema px-4 py-3 font-body text-sm font-semibold text-espresso shadow-lift transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Place ticket
        </button>

        {message && (
          <p className="rounded-lg bg-board px-3 py-2 font-mono text-xs text-crema">{message}</p>
        )}
      </form>

      <div className="flex flex-col rounded-2xl border border-board-line bg-board-soft p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-chalk">Live queue</h3>
            <p className="mt-1 font-body text-sm text-chalk-dim">
              Sorted by priority, then by who arrived first.
            </p>
          </div>
          <button
            onClick={handleServeNext}
            disabled={serving || orders.length === 0}
            className="inline-flex items-center gap-2 rounded-chip border border-stamp/60 px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-stamp transition-colors hover:bg-stamp/10 disabled:opacity-40"
          >
            <Sparkles size={14} />
            Staff: serve next
          </button>
        </div>

        <div className="scrollbar-thin flex max-h-[440px] flex-col gap-2.5 overflow-y-auto pr-1">
          {orders.length === 0 && (
            <p className="rounded-lg border border-dashed border-board-line px-4 py-8 text-center font-body text-sm text-chalk-dim">
              The queue is empty — be the first to order.
            </p>
          )}
          {orders.map((order, idx) => {
            const tag = tagFor(order);
            return (
              <div
                key={order.id}
                className="flex items-center gap-3 rounded-xl border border-board-line bg-board px-3.5 py-3"
              >
                <span className="font-mono text-xs text-chalk-dim/60">{idx + 1}</span>
                <span className="font-mono text-sm font-semibold text-crema">
                  #{String(order.id).padStart(3, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-medium text-chalk">
                    {order.customer_name}
                    <span className="text-chalk-dim"> &middot; {order.item}</span>
                  </p>
                  <p className="font-mono text-[10px] text-chalk-dim/60">
                    {timeAgo(order.timestamp)}
                  </p>
                </div>
                <span
                  className={
                    "shrink-0 rounded-sm border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide " +
                    (tag.stamped
                      ? "border-stamp/60 text-stamp"
                      : "border-board-line text-chalk-dim")
                  }
                >
                  {tag.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
