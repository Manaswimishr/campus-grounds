// Direct port of SeatingManager from seating.cpp.
// The floor is a 6x8 grid: 2 = wall, 0 = open aisle, 1 = table.
// findNearestFreeSeat runs a breadth-first search from the door, so
// the first table it reaches is guaranteed to be the closest one by
// number of steps — BFS explores the grid one ring of distance at a
// time, so whichever free table it pops first is provably nearest.

import type { GridCell, SeatResult } from "./types";

const ROWS = 6;
const COLS = 8;
const ENTRANCE: [number, number] = [3, 0];

const LAYOUT: number[][] = [
  [2, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 1, 1],
];

export class SeatingManager {
  private occupied: boolean[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => false)
  );

  private isWithinBounds(row: number, col: number): boolean {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
  }

  private isTableCell(row: number, col: number): boolean {
    return this.isWithinBounds(row, col) && LAYOUT[row][col] === 1;
  }

  private isTraversable(row: number, col: number): boolean {
    if (!this.isWithinBounds(row, col)) return false;
    return LAYOUT[row][col] === 0 || LAYOUT[row][col] === 1;
  }

  findNearestFreeSeat(): SeatResult {
    const [startRow, startCol] = ENTRANCE;
    const visited: boolean[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => false)
    );
    const distance: number[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => -1)
    );

    const queue: Array<[number, number]> = [[startRow, startCol]];
    visited[startRow][startCol] = true;
    distance[startRow][startCol] = 0;

    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, -1, 1];

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;

      if (this.isTableCell(row, col) && !this.occupied[row][col]) {
        this.occupied[row][col] = true;
        return { found: true, row, col, distance: distance[row][col] };
      }

      for (let i = 0; i < 4; i++) {
        const nr = row + dr[i];
        const nc = col + dc[i];
        if (!this.isWithinBounds(nr, nc) || visited[nr][nc]) continue;
        if (!this.isTraversable(nr, nc)) continue;
        visited[nr][nc] = true;
        distance[nr][nc] = distance[row][col] + 1;
        queue.push([nr, nc]);
      }
    }

    return { found: false };
  }

  occupySeat(row: number, col: number): boolean {
    if (!this.isTableCell(row, col) || this.occupied[row][col]) return false;
    this.occupied[row][col] = true;
    return true;
  }

  freeSeat(row: number, col: number): boolean {
    if (!this.isTableCell(row, col) || !this.occupied[row][col]) return false;
    this.occupied[row][col] = false;
    return true;
  }

  getGridState(): GridCell[][] {
    const grid: GridCell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: GridCell[] = [];
      for (let c = 0; c < COLS; c++) {
        if (LAYOUT[r][c] === 2) row.push("wall");
        else if (LAYOUT[r][c] === 0) row.push("aisle");
        else row.push(this.occupied[r][c] ? "table_occupied" : "table_free");
      }
      grid.push(row);
    }
    return grid;
  }
}
