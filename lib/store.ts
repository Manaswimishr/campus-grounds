// Module-level singletons for the three subsystems. Next.js reloads
// route modules on every change in dev, which would otherwise reset
// state on every edit — so instances are cached on `globalThis`, the
// same trick the Next.js docs recommend for database clients.
//
// State is persisted in a local SQLite database (better-sqlite3).
// getDb() runs the schema migration before these managers construct
// and hydrate from disk. Public APIs on OrderQueueManager,
// SeatingManager, and DeliveryManager stay the same, so API routes
// under app/api/ do not need to change.

import { getDb } from "./db";
import { OrderQueueManager } from "./orderQueue";
import { SeatingManager } from "./seating";
import { DeliveryManager } from "./delivery";

// Ensure the database exists and schema is applied before managers load.
const db = getDb();

declare global {
  // eslint-disable-next-line no-var
  var __cafeOrderQueue: OrderQueueManager | undefined;
  // eslint-disable-next-line no-var
  var __cafeSeating: SeatingManager | undefined;
  // eslint-disable-next-line no-var
  var __cafeDelivery: DeliveryManager | undefined;
}

export const orderQueue =
  globalThis.__cafeOrderQueue ?? new OrderQueueManager(db);
globalThis.__cafeOrderQueue = orderQueue;

export const seating = globalThis.__cafeSeating ?? new SeatingManager(db);
globalThis.__cafeSeating = seating;

export const delivery = globalThis.__cafeDelivery ?? new DeliveryManager(db);
globalThis.__cafeDelivery = delivery;
