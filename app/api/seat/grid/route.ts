import { NextResponse } from "next/server";
import { seating } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ grid: seating.getGridState() });
}
