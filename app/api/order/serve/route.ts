import { NextResponse } from "next/server";
import { orderQueue } from "@/lib/store";
import { notifyOrderReady } from "@/lib/notify";
import { serializeOrder } from "@/lib/serialize";

export async function POST() {
  try {
    const served = orderQueue.serveNextOrder();
    await notifyOrderReady(served);
    return NextResponse.json(serializeOrder(served));
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Queue is empty" }, { status: 400 });
  }
}
