import { NextResponse } from "next/server";
import { delivery } from "@/lib/store";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { destination } = body ?? {};
  if (typeof destination !== "number") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (destination <= 0 || destination > 12) {
    return NextResponse.json({ error: "destination must be between 1 and 12" }, { status: 400 });
  }

  const result = delivery.findShortestPath(destination);
  if (!result.reachable) {
    return NextResponse.json({ reachable: false, distance: -1, path: [], steps: [] });
  }

  return NextResponse.json({
    reachable: true,
    distance: result.distance,
    path: result.path,
    steps: result.steps,
  });
}
