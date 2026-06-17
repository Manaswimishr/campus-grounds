// A textbook binary min-heap, array-backed, O(log n) push/pop.
// Used for two unrelated jobs in this codebase: ranking order tickets
// by priority, and the relaxation queue inside Dijkstra's algorithm.
// `less(a, b)` should return true when `a` must come out of the heap
// before `b`.

export class MinHeap<T> {
  private items: T[] = [];

  constructor(private readonly less: (a: T, b: T) => boolean) {}

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  push(value: T): void {
    this.items.push(value);
    this.bubbleUp(this.items.length - 1);
  }

  pop(): T | undefined {
    if (this.items.length === 0) return undefined;
    const top = this.items[0];
    const last = this.items.pop()!;
    if (this.items.length > 0) {
      this.items[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  toSortedArray(): T[] {
    const copy = [...this.items];
    const out: T[] = [];
    const clone = new MinHeap<T>(this.less);
    clone.items = copy;
    while (!clone.isEmpty()) out.push(clone.pop()!);
    return out;
  }

  private bubbleUp(index: number): void {
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.less(this.items[i], this.items[parent])) {
        this.swap(i, parent);
        i = parent;
      } else break;
    }
  }

  private bubbleDown(index: number): void {
    let i = index;
    const n = this.items.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.less(this.items[left], this.items[smallest])) smallest = left;
      if (right < n && this.less(this.items[right], this.items[smallest])) smallest = right;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  private swap(i: number, j: number): void {
    const tmp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = tmp;
  }
}
