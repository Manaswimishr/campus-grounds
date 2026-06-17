// Direct port of DeliveryManager from delivery.cpp.
// Models the building as a weighted undirected graph (corridors,
// staircases, department blocks) and runs Dijkstra's algorithm with
// a binary min-heap to find the shortest walking distance — in
// metres — from the cafe to any department, lab, or lounge.

import { MinHeap } from "./minHeap";
import type { DeliveryResult, LocationInfo } from "./types";

const LOCATIONS: LocationInfo[] = [
  { id: 0, name: "Cafe", department: "", floor: 1 },
  { id: 1, name: "Main Entrance / Ground Floor Corridor", department: "General", floor: 0 },
  { id: 2, name: "Staircase Left", department: "General", floor: 0 },
  { id: 3, name: "Staircase Right", department: "General", floor: 0 },
  { id: 4, name: "Floor 0 - Block A (Left Wing)", department: "General", floor: 0 },
  { id: 5, name: "Floor 0 - Block B (Center)", department: "General", floor: 0 },
  { id: 6, name: "Floor 0 - Block C (PMSE Dept)", department: "PMSE", floor: 0 },
  { id: 7, name: "Floor 1 - Block A (CSE Dept)", department: "CSE", floor: 1 },
  { id: 8, name: "Floor 1 - Block B (ECE Dept)", department: "ECE", floor: 1 },
  { id: 9, name: "Floor 1 - Block C (Right Wing)", department: "General", floor: 1 },
  { id: 10, name: "Computer Lab (Ground Floor)", department: "Lab", floor: 0 },
  { id: 11, name: "Electronics Lab (Ground Floor)", department: "Lab", floor: 0 },
  { id: 12, name: "Faculty Lounge (Floor 1)", department: "General", floor: 1 },
];

const EDGES: Array<[number, number, number]> = [
  [0, 8, 10],
  [0, 12, 15],
  [0, 3, 20],
  [1, 4, 40],
  [1, 5, 20],
  [1, 6, 50],
  [4, 2, 25],
  [5, 2, 30],
  [5, 3, 30],
  [6, 3, 25],
  [4, 10, 35],
  [5, 11, 40],
  [2, 7, 40],
  [2, 9, 50],
  [3, 8, 40],
  [3, 9, 35],
  [7, 8, 30],
  [8, 9, 30],
  [7, 12, 20],
  [8, 12, 20],
];

export class DeliveryManager {
  private adjacency: Array<Array<[number, number]>> = [];

  constructor() {
    this.adjacency = LOCATIONS.map(() => []);
    for (const [u, v, w] of EDGES) {
      this.adjacency[u].push([v, w]);
      this.adjacency[v].push([u, w]);
    }
  }

  getLocations(): LocationInfo[] {
    return LOCATIONS;
  }

  getAdjacencyListForDisplay(): string[] {
    return this.adjacency.map((edges, u) => {
      const parts = edges.map(
        ([v, w]) => `${LOCATIONS[v].name} (${w}m)`
      );
      return `${LOCATIONS[u].name} -> ${parts.join(", ")}`;
    });
  }

  findShortestPath(destination: number): DeliveryResult {
    const n = LOCATIONS.length;
    const source = 0;
    const INF = Number.MAX_SAFE_INTEGER;

    const dist = new Array<number>(n).fill(INF);
    const parent = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);

    const heap = new MinHeap<[number, number]>((a, b) => a[0] < b[0]);
    dist[source] = 0;
    heap.push([0, source]);

    while (!heap.isEmpty()) {
      const [d, node] = heap.pop()!;
      if (visited[node]) continue;
      if (d > dist[node]) continue;
      visited[node] = true;

      for (const [next, w] of this.adjacency[node]) {
        if (dist[node] + w < dist[next]) {
          dist[next] = dist[node] + w;
          parent[next] = node;
          heap.push([dist[next], next]);
        }
      }
    }

    if (destination < 0 || destination >= n || dist[destination] === INF) {
      return { reachable: false, distance: -1, path: [], steps: [] };
    }

    const reversedPath: number[] = [];
    let cur = destination;
    while (cur !== -1) {
      reversedPath.push(cur);
      cur = parent[cur];
    }
    reversedPath.reverse();

    return {
      reachable: true,
      distance: dist[destination],
      path: reversedPath.map((idx) => LOCATIONS[idx].name),
      steps: reversedPath.map((idx) => ({
        name: LOCATIONS[idx].name,
        distanceFromCafe: dist[idx],
      })),
    };
  }
}
