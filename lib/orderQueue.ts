// Direct port of OrderQueueManager from order_queue.cpp.
// Tickets are ranked by priority first (1 is most urgent — faculty
// deliveries are forced to 1), then by timestamp (first come, first
// served within the same tier). Backed by a binary min-heap, same
// as the std::priority_queue in the original C++.

import { MinHeap } from "./minHeap";
import type { NewOrderInput, Order } from "./types";

function orderComesFirst(a: Order, b: Order): boolean {
  if (a.priority !== b.priority) return a.priority < b.priority;
  return a.timestamp < b.timestamp;
}

export class OrderQueueManager {
  private heap = new MinHeap<Order>(orderComesFirst);
  private nextId = 1;

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
    this.heap.push(order);
    return order;
  }

  serveNextOrder(): Order {
    const next = this.heap.pop();
    if (!next) throw new Error("Queue is empty");
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
