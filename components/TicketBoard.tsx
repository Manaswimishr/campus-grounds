type Ticket = {
  num: string;
  name: string;
  item: string;
  tag: string;
  stamped?: boolean;
};

const TICKETS: Ticket[] = [
  { num: "041", name: "Aanya R.", item: "Cappuccino", tag: "Table 12" },
  {
    num: "042",
    name: "Prof. Iyer",
    item: "Filter Coffee",
    tag: "Faculty \u2192 CSE Dept",
    stamped: true,
  },
  { num: "043", name: "Rohan K.", item: "Cold Brew + Croissant", tag: "Takeaway" },
  {
    num: "044",
    name: "ECE Lab",
    item: "Masala Chai \u00d73",
    tag: "Faculty \u2192 ECE Dept",
    stamped: true,
  },
  { num: "045", name: "Meera S.", item: "Caramel Latte", tag: "Table 04" },
  { num: "046", name: "Sahil P.", item: "Walnut Brownie", tag: "Takeaway" },
];

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="ticket-edge flex items-center gap-4 rounded-md bg-paper px-4 py-3 shadow-sm">
      <div className="flex flex-col items-start">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-espresso/50">
          Ticket
        </span>
        <span className="font-mono text-xl font-semibold leading-none text-espresso">
          #{ticket.num}
        </span>
      </div>
      <div className="h-9 w-px shrink-0 bg-espresso/15" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-semibold text-espresso">
          {ticket.name}
        </p>
        <p className="truncate font-body text-xs text-espresso/60">{ticket.item}</p>
      </div>
      <span
        className={
          "shrink-0 -rotate-3 rounded-sm border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide " +
          (ticket.stamped
            ? "border-stamp/60 text-stamp"
            : "border-espresso/25 text-espresso/50")
        }
      >
        {ticket.tag}
      </span>
    </div>
  );
}

export default function TicketBoard() {
  const looped = [...TICKETS, ...TICKETS];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-board-line bg-board-soft p-4 shadow-ticket sm:p-5">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-crema" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-chalk-dim">
            Now serving
          </span>
        </div>
        <span className="font-mono text-xs text-chalk-dim/60">live queue preview</span>
      </div>

      <div className="relative h-[360px] overflow-hidden rounded-2xl">
        <div className="animate-marquee flex flex-col gap-3 [animation-play-state:running] motion-reduce:animate-none">
          {looped.map((ticket, i) => (
            <TicketCard key={`${ticket.num}-${i}`} ticket={ticket} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-board-soft to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-board-soft to-transparent" />
      </div>
    </div>
  );
}
