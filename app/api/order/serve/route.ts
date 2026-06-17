import { NextResponse } from "next/server";
import { orderQueue } from "@/lib/store";
import { serializeOrder } from "@/lib/serialize";

export async function POST() {
  try {
    const served = orderQueue.serveNextOrder();
    return NextResponse.json(serializeOrder(served));
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Queue is empty" }, { status: 400 });
  }
}
