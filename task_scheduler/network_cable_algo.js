// ---------- Disjoint Set (Union-Find) for Kruskal ----------
class DisjointSet {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    // union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

// ---------- Min-Heap for Prim ----------
class MinHeap {
  constructor(compare = (a, b) => a.weight - b.weight) {
    this.heap = [];
    this.compare = compare;
  }

  insert(item) {
    this.heap.push(item);
    this._siftUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.isEmpty()) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return min;
  }

  isEmpty() { return this.heap.length === 0; }

  _siftUp(i) {
    const item = this.heap[i];
    while (i > 0) {
      const parentIdx = Math.floor((i - 1) / 2);
      if (this.compare(item, this.heap[parentIdx]) >= 0) break;
      this.heap[i] = this.heap[parentIdx];
      this.heap[parentIdx] = item;
      i = parentIdx;
    }
  }

  _siftDown(i) {
    const length = this.heap.length;
    const item = this.heap[i];
    while (true) {
      let left = 2 * i + 1, right = 2 * i + 2, smallest = i;
      if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}

// ---------- Main Cable Network Class ----------
class CableNetwork {
  constructor() {
    this.computers = new Set();          // store unique computer IDs
    this.edges = [];                     // each edge: { u, v, weight }
  }

  /**
   * Add a computer (node) to the network.
   * @param {number|string} id - unique identifier
   */
  addComputer(id) {
    this.computers.add(id);
  }

  /**
   * Add a cable connection between two computers with given cost.
   * @param {number|string} u - first computer id
   * @param {number|string} v - second computer id
   * @param {number} weight - cable cost / length
   */
  addConnection(u, v, weight) {
    // Ensure both computers exist
    this.addComputer(u);
    this.addComputer(v);
    this.edges.push({ u, v, weight });
  }

  /**
   * Compute MST using Kruskal's algorithm.
   * Returns object: { mst: Array<{u,v,weight}>, totalCost: number, connected: boolean }
   */
  kruskalMST() {
    if (this.computers.size === 0) return { mst: [], totalCost: 0, connected: true };

    // Map computer IDs to 0..n-1 for Union-Find
    const compArray = Array.from(this.computers);
    const indexMap = new Map(compArray.map((id, idx) => [id, idx]));
    const n = compArray.length;

    // Sort edges by weight
    const sortedEdges = [...this.edges].sort((a, b) => a.weight - b.weight);

    const ds = new DisjointSet(n);
    const mst = [];
    let totalCost = 0;

    for (const edge of sortedEdges) {
      const uIdx = indexMap.get(edge.u);
      const vIdx = indexMap.get(edge.v);
      if (ds.union(uIdx, vIdx)) {
        mst.push(edge);
        totalCost += edge.weight;
        if (mst.length === n - 1) break; // MST complete
      }
    }

    const connected = mst.length === n - 1;
    return { mst, totalCost, connected };
  }

  /**
   * Compute MST using Prim's algorithm (starting from any node).
   * Returns same structure as kruskalMST.
   */
  primMST() {
    if (this.computers.size === 0) return { mst: [], totalCost: 0, connected: true };

    const compArray = Array.from(this.computers);
    const n = compArray.length;

    // Build adjacency list
    const adj = new Map();
    for (const id of compArray) adj.set(id, []);
    for (const edge of this.edges) {
      adj.get(edge.u).push({ v: edge.v, weight: edge.weight });
      adj.get(edge.v).push({ v: edge.u, weight: edge.weight });
    }

    const start = compArray[0];
    const visited = new Set();
    const minHeap = new MinHeap();
    const mst = [];
    let totalCost = 0;

    visited.add(start);
    // Add all edges from start
    for (const neighbor of adj.get(start)) {
      minHeap.insert({ u: start, v: neighbor.v, weight: neighbor.weight });
    }

    while (!minHeap.isEmpty() && visited.size < n) {
      const edge = minHeap.extractMin();
      if (visited.has(edge.v)) continue; // would create cycle

      visited.add(edge.v);
      mst.push({ u: edge.u, v: edge.v, weight: edge.weight });
      totalCost += edge.weight;

      for (const neighbor of adj.get(edge.v)) {
        if (!visited.has(neighbor.v)) {
          minHeap.insert({ u: edge.v, v: neighbor.v, weight: neighbor.weight });
        }
      }
    }

    const connected = visited.size === n;
    return { mst, totalCost, connected };
  }

  /**
   * Display results in a readable format.
   * @param {string} method - 'kruskal' or 'prim'
   */
  printMST(method = 'kruskal') {
    const result = method === 'kruskal' ? this.kruskalMST() : this.primMST();
    if (!result.connected) {
      console.warn('Warning: Not all computers are connected. The network is a Minimum Spanning Forest.');
    }
    console.log(`\n--- ${method.toUpperCase()} MST ---`);
    console.log('Selected connections:');
    result.mst.forEach(e => console.log(`  ${e.u} <--> ${e.v}  (cost: ${e.weight})`));
    console.log(`Total cost: ${result.totalCost}`);
    return result;
  }
}

// ---------- Example Usage ----------
const network = new CableNetwork();

// Add connections dynamically
network.addConnection('A', 'B', 4);
network.addConnection('A', 'C', 2);
network.addConnection('B', 'C', 1);
network.addConnection('B', 'D', 5);
network.addConnection('C', 'D', 8);
network.addConnection('C', 'E', 10);
network.addConnection('D', 'E', 2);
network.addConnection('D', 'F', 6);
network.addConnection('E', 'F', 3);

console.log('Computers in network:', ...network.computers);

// Compute and display MST using Kruskal
network.printMST('kruskal');

// Compute and display MST using Prim (should be identical in cost, possibly different edges if ties)
network.printMST('prim');