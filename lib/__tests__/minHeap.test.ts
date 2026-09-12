import { MinHeap } from "../minHeap";

describe("MinHeap", () => {
  it("pops values in ascending order for a numeric min-heap", () => {
    const heap = new MinHeap<number>((a, b) => a < b);
    for (const n of [5, 1, 9, 3, 7, 2]) heap.push(n);

    const out: number[] = [];
    while (!heap.isEmpty()) out.push(heap.pop()!);
    expect(out).toEqual([1, 2, 3, 5, 7, 9]);
  });

  it("peek returns the minimum without removing it", () => {
    const heap = new MinHeap<number>((a, b) => a < b);
    heap.push(4);
    heap.push(1);
    heap.push(3);

    expect(heap.peek()).toBe(1);
    expect(heap.size).toBe(3);
    expect(heap.pop()).toBe(1);
    expect(heap.peek()).toBe(3);
  });

  it("orders by custom comparator (priority then timestamp)", () => {
    type Ticket = { id: string; priority: number; timestamp: number };
    const heap = new MinHeap<Ticket>((a, b) => {
      if (a.priority !== b.priority) return a.priority < b.priority;
      return a.timestamp < b.timestamp;
    });

    heap.push({ id: "c", priority: 2, timestamp: 100 });
    heap.push({ id: "a", priority: 1, timestamp: 200 });
    heap.push({ id: "b", priority: 1, timestamp: 50 });
    heap.push({ id: "d", priority: 3, timestamp: 10 });

    expect(heap.pop()!.id).toBe("b");
    expect(heap.pop()!.id).toBe("a");
    expect(heap.pop()!.id).toBe("c");
    expect(heap.pop()!.id).toBe("d");
  });

  it("toSortedArray returns ascending order without mutating the heap", () => {
    const heap = new MinHeap<number>((a, b) => a < b);
    heap.push(3);
    heap.push(1);
    heap.push(2);

    expect(heap.toSortedArray()).toEqual([1, 2, 3]);
    expect(heap.size).toBe(3);
    expect(heap.peek()).toBe(1);
  });

  it("pop on an empty heap returns undefined", () => {
    const heap = new MinHeap<number>((a, b) => a < b);
    expect(heap.pop()).toBeUndefined();
    expect(heap.isEmpty()).toBe(true);
  });
});
