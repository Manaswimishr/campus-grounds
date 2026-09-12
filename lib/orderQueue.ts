// Direct port of OrderQueueManager from order_queue.cpp.
// Tickets are ranked by priority first (1 is most urgent — faculty
// deliveries are forced to 1), then by timestamp (first come, first
// served within the same tier). Backed by a binary min-heap, same
// as the std::priority_queue in the original C++.
// Pending tickets are persisted in SQLite (see lib/schema.sql).

import type Database from "better-sqlite3";
import { getDb } from "./db";
import { MinHeap } from "./minHeap";
import type { NewOrderInput, Order } from "./types";

function orderComesFirst(a: Order, b: Order): boolean {
  if (a.priority !== b.priority) return a.priority < b.priority;
  return a.timestamp < b.timestamp;
}

type OrderRow = {
  id: number;
  customer_name: string;
  item: string;
  priority: number;
  timestamp: number;
  is_faculty_delivery: number;
  delivery_location: string;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    item: row.item,
    priority: row.priority as 1 | 2 | 3,
    timestamp: row.timestamp,
    isFacultyDelivery: Boolean(row.is_faculty_delivery),
    deliveryLocation: row.delivery_location,
  };
}

export class OrderQueueManager {
  private heap = new MinHeap<Order>(orderComesFirst);
  private nextId = 1;
  private readonly db: Database.Database;

  constructor(db?: Database.Database) {
    this.db = db ?? getDb();
    this.loadFromDb();
  }

  private loadFromDb(): void {
    const rows = this.db
      .prepare(
        `SELECT id, customer_name, item, priority, timestamp,
                is_faculty_delivery, delivery_location
         FROM orders WHERE status = 'queued'`
      )
      .all() as OrderRow[];

    for (const row of rows) {
      this.heap.push(rowToOrder(row));
    }

    const maxRow = this.db
      .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM orders`)
      .get() as { max_id: number };
    this.nextId = maxRow.max_id + 1;
  }

  addOrder(input: NewOrderInput): Order {
    const isFacultyDelivery = Boolean(input.isFacultyDelivery);
    const order: Order = {
      id: this.nextId++,
      customerName: input.customerName,
      item: input.item,
      priority: isFacultyDelivery ? 1 : input.priority,
      timestamp: Date.now(),
      isFacultyDelivery,
      deliveryLocation: input.deliveryLocation ?? "",
    };

    this.db
      .prepare(
        `INSERT INTO orders (
           id, customer_name, item, priority, timestamp,
           is_faculty_delivery, delivery_location, status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, 'queued')`
      )
      .run(
        order.id,
        order.customerName,
        order.item,
        order.priority,
        order.timestamp,
        order.isFacultyDelivery ? 1 : 0,
        order.deliveryLocation
      );

    this.heap.push(order);
    return order;
  }

  serveNextOrder(): Order {
    const next = this.heap.pop();
    if (!next) throw new Error("Queue is empty");

    this.db
      .prepare(`UPDATE orders SET status = 'served' WHERE id = ?`)
      .run(next.id);

    return next;
  }

  peekNextOrder(): Order {
    const next = this.heap.peek();
    if (!next) throw new Error("Queue is empty");
    return next;
  }

  getAllOrders(): Order[] {
    return this.heap.toSortedArray();
  }

  queueSize(): number {
    return this.heap.size;
  }

  isEmpty(): boolean {
    return this.heap.isEmpty();
  }
}
