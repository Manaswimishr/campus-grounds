import { createTestDb } from "../db";
import { SeatingManager } from "../seating";

describe("SeatingManager BFS", () => {
  function freshSeating() {
    return new SeatingManager(createTestDb());
  }

  it("finds the nearest free table from the entrance", () => {
    const seating = freshSeating();
    const result = seating.findNearestFreeSeat();

    expect(result.found).toBe(true);
    // Entrance is (3,0); first reachable table cell is (3,1) at distance 1.
    expect(result).toMatchObject({ row: 3, col: 1, distance: 1 });
  });

  it("skips occupied seats and returns the next-nearest free table", () => {
    const seating = freshSeating();
    const first = seating.findNearestFreeSeat();
    const second = seating.findNearestFreeSeat();

    expect(first).toMatchObject({ row: 3, col: 1, distance: 1 });
    // Neighbor order is up/down/left/right, so (2,1) is the next free seat.
    expect(second).toMatchObject({ row: 2, col: 1, distance: 2 });
  });

  it("marks found seats as occupied in the grid", () => {
    const seating = freshSeating();
    const { row, col } = seating.findNearestFreeSeat();
    const grid = seating.getGridState();

    expect(grid[row!][col!]).toBe("table_occupied");
  });

  it("freeSeat makes a table available again for BFS", () => {
    const seating = freshSeating();
    const first = seating.findNearestFreeSeat();
    expect(seating.freeSeat(first.row!, first.col!)).toBe(true);

    const again = seating.findNearestFreeSeat();
    expect(again).toMatchObject({
      row: first.row,
      col: first.col,
      distance: first.distance,
    });
  });

  it("returns found:false when every table is occupied", () => {
    const seating = freshSeating();
    // Layout has tables in rows 1–4, cols 1–6 → 24 seats.
    for (let i = 0; i < 24; i++) {
      expect(seating.findNearestFreeSeat().found).toBe(true);
    }
    expect(seating.findNearestFreeSeat()).toEqual({ found: false });
  });

  it("occupySeat rejects walls and already-occupied tables", () => {
    const seating = freshSeating();
    expect(seating.occupySeat(0, 0)).toBe(false); // wall
    expect(seating.occupySeat(3, 1)).toBe(true);
    expect(seating.occupySeat(3, 1)).toBe(false);
  });
});
