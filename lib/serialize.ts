import type { Order } from "./types";

export function serializeOrder(order: Order) {
  return {
    id: order.id,
    customer_name: order.customerName,
    item: order.item,
    priority: order.priority,
    timestamp: order.timestamp,
    is_faculty_delivery: order.isFacultyDelivery,
    delivery_location: order.deliveryLocation,
  };
}
