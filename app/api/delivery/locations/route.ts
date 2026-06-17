import { NextResponse } from "next/server";
import { delivery } from "@/lib/store";

export async function GET() {
  const locations = delivery.getLocations().map((loc) => ({
    id: loc.id,
    name: loc.name,
    department: loc.department,
    floor: loc.floor,
  }));
  return NextResponse.json({ locations });
}
