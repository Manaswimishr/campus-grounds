import { NextResponse } from "next/server";
import { orderQueue } from "@/lib/store";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { customer_name, item, priority } = body ?? {};
  if (
    typeof customer_name !== "string" ||
    !customer_name.trim() ||
    typeof item !== "string" ||
    !item.trim() ||
    typeof priority !== "number"
  ) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (priority < 1 || priority > 3) {
    return NextResponse.json({ error: "priority must be 1, 2, or 3" }, { status: 400 });
  }

  const order = orderQueue.addOrder({
    customerName: customer_name,
    item,
    priority: priority as 1 | 2 | 3,
    isFacultyDelivery: Boolean(body.is_faculty_delivery),
    deliveryLocation: typeof body.delivery_location === "string" ? body.delivery_location : "",
  });

  return NextResponse.json({
    success: true,
    order_id: order.id,
    queue_size: orderQueue.queueSize(),
  });
}
