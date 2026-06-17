// Shared domain types for Campus Grounds.
// These mirror the structs defined in the original C++ backend
// (order_queue.h, seating.h, delivery.h) so the data shapes carried
// across the API stay identical to the system this was modeled on.

export interface Order {
  id: number;
  customerName: string;
  item: string;
  priority: 1 | 2 | 3;
  timestamp: number;
  isFacultyDelivery: boolean;
  deliveryLocation: string;
}

export interface NewOrderInput {
  customerName: string;
  item: string;
  priority: 1 | 2 | 3;
  isFacultyDelivery?: boolean;
  deliveryLocation?: string;
}

export type GridCell = "wall" | "aisle" | "table_free" | "table_occupied";

export interface SeatResult {
  found: boolean;
  row?: number;
  col?: number;
  distance?: number;
}

export interface LocationInfo {
  id: number;
  name: string;
  department: string;
  floor: number;
}

export interface DeliveryStep {
  name: string;
  distanceFromCafe: number;
}

export interface DeliveryResult {
  reachable: boolean;
  distance: number;
  path: string[];
  steps: DeliveryStep[];
}
