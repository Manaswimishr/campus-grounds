import { NextResponse } from "next/server";
import { orderQueue } from "@/lib/store";
import { serializeOrder } from "@/lib/serialize";

export async function GET() {
  const orders = orderQueue.getAllOrders().map(serializeOrder);
  return NextResponse.json({ orders });
}
