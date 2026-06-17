// Module-level singletons for the three subsystems. Next.js reloads
// route modules on every change in dev, which would otherwise reset
// state on every edit — so instances are cached on `globalThis`, the
// same trick the Next.js docs recommend for database clients.
//
// Production note: this keeps state in the memory of a single
// serverless function instance. That's perfect for a live portfolio
// demo, but a real deployment serving concurrent instances would
// swap these for a shared store (Redis / Postgres) behind the same
// three classes — the API routes wouldn't need to change at all.

import { OrderQueueManager } from "./orderQueue";
import { SeatingManager } from "./seating";
import { DeliveryManager } from "./delivery";

declare global {
  // eslint-disable-next-line no-var
  var __cafeOrderQueue: OrderQueueManager | undefined;
  // eslint-disable-next-line no-var
  var __cafeSeating: SeatingManager | undefined;
  // eslint-disable-next-line no-var
  var __cafeDelivery: DeliveryManager | undefined;
}

export const orderQueue = globalThis.__cafeOrderQueue ?? new OrderQueueManager();
globalThis.__cafeOrderQueue = orderQueue;

export const seating = globalThis.__cafeSeating ?? new SeatingManager();
globalThis.__cafeSeating = seating;

export const delivery = globalThis.__cafeDelivery ?? new DeliveryManager();
globalThis.__cafeDelivery = delivery;
