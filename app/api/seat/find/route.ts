import { NextResponse } from "next/server";
import { seating } from "@/lib/store";

export async function POST() {
  const result = seating.findNearestFreeSeat();
  if (!result.found) {
    return NextResponse.json({ found: false });
  }
  return NextResponse.json({
    found: true,
    row: result.row,
    col: result.col,
    distance: result.distance,
  });
}
