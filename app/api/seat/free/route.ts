import { NextResponse } from "next/server";
import { seating } from "@/lib/store";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { row, col } = body ?? {};
  if (typeof row !== "number" || typeof col !== "number") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!seating.freeSeat(row, col)) {
    return NextResponse.json({ error: "Invalid table cell" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
