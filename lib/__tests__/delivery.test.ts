import { createTestDb } from "../db";
import { DeliveryManager } from "../delivery";

describe("DeliveryManager Dijkstra", () => {
  function freshDelivery() {
    return new DeliveryManager(createTestDb());
  }

  it("returns zero-length path when destination is the cafe", () => {
    const delivery = freshDelivery();
    const result = delivery.findShortestPath(0);

    expect(result.reachable).toBe(true);
    expect(result.distance).toBe(0);
    expect(result.path).toEqual(["Cafe"]);
    expect(result.steps).toEqual([{ name: "Cafe", distanceFromCafe: 0 }]);
  });

  it("uses the direct edge to ECE (node 8)", () => {
    const delivery = freshDelivery();
    const result = delivery.findShortestPath(8);

    expect(result.reachable).toBe(true);
    expect(result.distance).toBe(10);
    expect(result.path).toEqual([
      "Cafe",
      "Floor 1 - Block B (ECE Dept)",
    ]);
  });

  it("uses the direct edge to Faculty Lounge (node 12)", () => {
    const delivery = freshDelivery();
    const result = delivery.findShortestPath(12);

    expect(result.reachable).toBe(true);
    expect(result.distance).toBe(15);
    expect(result.path[0]).toBe("Cafe");
    expect(result.path[result.path.length - 1]).toBe(
      "Faculty Lounge (Floor 1)"
    );
  });

  it("finds the shortest multi-hop path to CSE (node 7)", () => {
    const delivery = freshDelivery();
    // Cafe → Faculty Lounge (15) → CSE (20) = 35
    // Cafe → ECE (10) → CSE (30) = 40
    const result = delivery.findShortestPath(7);

    expect(result.reachable).toBe(true);
    expect(result.distance).toBe(35);
    expect(result.path).toEqual([
      "Cafe",
      "Faculty Lounge (Floor 1)",
      "Floor 1 - Block A (CSE Dept)",
    ]);
    expect(result.steps.map((s) => s.distanceFromCafe)).toEqual([0, 15, 35]);
  });

  it("finds the shortest path to Floor 1 Block C (node 9)", () => {
    const delivery = freshDelivery();
    // Cafe → ECE (10) → Block C (30) = 40
    // Cafe → Staircase Right (20) → Block C (35) = 55
    const result = delivery.findShortestPath(9);

    expect(result.reachable).toBe(true);
    expect(result.distance).toBe(40);
    expect(result.path).toEqual([
      "Cafe",
      "Floor 1 - Block B (ECE Dept)",
      "Floor 1 - Block C (Right Wing)",
    ]);
  });

  it("marks out-of-range destinations as unreachable", () => {
    const delivery = freshDelivery();
    expect(delivery.findShortestPath(-1)).toEqual({
      reachable: false,
      distance: -1,
      path: [],
      steps: [],
    });
    expect(delivery.findShortestPath(99).reachable).toBe(false);
  });

  it("persists each routing request", () => {
    const db = createTestDb();
    const delivery = new DeliveryManager(db);
    delivery.findShortestPath(8);

    const row = db
      .prepare(
        `SELECT destination, reachable, distance, path_json
         FROM delivery_requests ORDER BY id DESC LIMIT 1`
      )
      .get() as {
      destination: number;
      reachable: number;
      distance: number;
      path_json: string;
    };

    expect(row.destination).toBe(8);
    expect(row.reachable).toBe(1);
    expect(row.distance).toBe(10);
    expect(JSON.parse(row.path_json)).toEqual([
      "Cafe",
      "Floor 1 - Block B (ECE Dept)",
    ]);
  });
});
