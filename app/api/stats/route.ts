import { NextResponse } from "next/server";
import { orderQueue, seating } from "@/lib/store";

export async function GET() {
  const grid = seating.getGridState();
  let freeTables = 0;
  let totalTables = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === "table_free") {
        freeTables++;
        totalTables++;
      } else if (cell === "table_occupied") {
        totalTables++;
      }
    }
  }

  return NextResponse.json({
    queue_size: orderQueue.queueSize(),
    free_tables: freeTables,
    total_tables: totalTables,
  });
}
