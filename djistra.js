// ========== Min-Heap Priority Queue ==========
/**
 * Min-Heap implementation for efficient extraction of minimum distance vertex.
 * This is essential for Dijkstra's algorithm to run in O((V + E) log V) time.
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  /**
   * Insert an element with its priority.
   * @param {string} vertex
   * @param {number} distance
   */
  insert(vertex, distance) {
    this.heap.push({ vertex, distance });
    this._siftUp(this.heap.length - 1);
  }

  /**
   * Extract the element with minimum distance.
   * @returns {{ vertex: string, distance: number } | null}
   */
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

  /**
   * Check if heap is empty.
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Sift up to maintain heap property.
   * @param {number} index
   */
  _siftUp(index) {
    const item = this.heap[index];
    
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].distance <= item.distance) break;
      
      this.heap[index] = this.heap[parentIndex];
      this.heap[parentIndex] = item;
      index = parentIndex;
    }
  }

  /**
   * Sift down to maintain heap property.
   * @param {number} index
   */
  _siftDown(index) {
    const length = this.heap.length;
    const item = this.heap[index];
    
    while (true) {
      let leftChild = 2 * index + 1;
      let rightChild = 2 * index + 2;
      let smallest = index;
      
      if (leftChild < length && this.heap[leftChild].distance < this.heap[smallest].distance) {
        smallest = leftChild;
      }
      if (rightChild < length && this.heap[rightChild].distance < this.heap[smallest].distance) {
        smallest = rightChild;
      }
      
      if (smallest === index) break;
      
      this.heap[index] = this.heap[smallest];
      this.heap[smallest] = item;
      index = smallest;
    }
  }
}

// ========== Dijkstra's Algorithm ==========
/**
 * Implements Dijkstra's algorithm to find shortest paths from start vertex.
 * 
 * @param {Object} graph - Weighted graph as adjacency list
 *   Example: { 'A': { 'B': 4, 'C': 2 }, 'B': { 'A': 4, 'C': 5, 'D': 10 }, ... }
 * @param {string} start - Starting vertex
 * @returns {Object} Shortest distances from start to all vertices
 * 
 * Time Complexity: O((V + E) log V) with min-heap
 * Space Complexity: O(V)
 */
function dijkstra(graph, start) {
  // Validate input
  if (!graph || typeof graph !== 'object') {
    throw new Error('Graph must be a valid object');
  }
  
  if (!graph[start]) {
    throw new Error(`Start vertex "${start}" does not exist in the graph`);
  }

  // Initialize distances with Infinity for all vertices
  const distances = {};
  const visited = new Set();
  const previous = {}; // Optional: to reconstruct paths
  
  // Initialize all distances to Infinity
  for (const vertex in graph) {
    distances[vertex] = Infinity;
    previous[vertex] = null;
  }
  
  // Distance from start to itself is 0
  distances[start] = 0;
  
  // Min-heap priority queue for efficient minimum extraction
  const pq = new MinHeap();
  pq.insert(start, 0);
  
  // Main Dijkstra loop
  while (!pq.isEmpty()) {
    const current = pq.extractMin();
    const currentVertex = current.vertex;
    const currentDistance = current.distance;
    
    // Skip if already visited (stale entry in heap)
    if (visited.has(currentVertex)) continue;
    
    // Mark as visited
    visited.add(currentVertex);
    
    // If current distance is greater than recorded, skip (outdated entry)
    if (currentDistance > distances[currentVertex]) continue;
    
    // Explore all neighbors of current vertex
    for (const neighbor in graph[currentVertex]) {
      // Skip if already visited
      if (visited.has(neighbor)) continue;
      
      const edgeWeight = graph[currentVertex][neighbor];
      const newDistance = currentDistance + edgeWeight;
      
      // If we found a shorter path, update it
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentVertex;
        pq.insert(neighbor, newDistance);
      }
    }
  }
  
  return distances;
}

// ========== Enhanced Version with Path Reconstruction ==========
/**
 * Enhanced Dijkstra that also returns the shortest paths.
 * 
 * @param {Object} graph - Weighted graph
 * @param {string} start - Starting vertex
 * @returns {Object} { distances, paths } where paths contains shortest paths
 */
function dijkstraWithPaths(graph, start) {
  if (!graph || !graph[start]) {
    throw new Error('Invalid graph or start vertex');
  }
  
  const distances = {};
  const previous = {};
  const visited = new Set();
  
  for (const vertex in graph) {
    distances[vertex] = Infinity;
    previous[vertex] = null;
  }
  
  distances[start] = 0;
  
  const pq = new MinHeap();
  pq.insert(start, 0);
  
  while (!pq.isEmpty()) {
    const current = pq.extractMin();
    const currentVertex = current.vertex;
    
    if (visited.has(currentVertex)) continue;
    visited.add(currentVertex);
    
    for (const neighbor in graph[currentVertex]) {
      if (visited.has(neighbor)) continue;
      
      const newDistance = distances[currentVertex] + graph[currentVertex][neighbor];
      
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentVertex;
        pq.insert(neighbor, newDistance);
      }
    }
  }
  
  // Reconstruct all shortest paths
  const paths = {};
  for (const vertex in graph) {
    paths[vertex] = reconstructPath(previous, start, vertex);
  }
  
  return { distances, paths };
}

/**
 * Reconstruct path from start to end using previous array.
 */
function reconstructPath(previous, start, end) {
  const path = [];
  let current = end;
  
  // If unreachable (distance = Infinity)
  if (previous[current] === null && current !== start) {
    return null; // No path exists
  }
  
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  return path;
}

// ========== Alternative: Simple Implementation Without Heap ==========
/**
 * Simpler Dijkstra implementation for smaller graphs.
 * Uses array scanning instead of heap (O(V²) time).
 * 
 * @param {Object} graph - Weighted graph
 * @param {string} start - Starting vertex
 * @returns {Object} Shortest distances
 */
function dijkstraSimple(graph, start) {
  const vertices = Object.keys(graph);
  const distances = {};
  const visited = {};
  
  // Initialize
  for (const vertex of vertices) {
    distances[vertex] = Infinity;
    visited[vertex] = false;
  }
  distances[start] = 0;
  
  // Find shortest path for all vertices
  for (let i = 0; i < vertices.length; i++) {
    // Find the unvisited vertex with minimum distance
    let minVertex = null;
    let minDistance = Infinity;
    
    for (const vertex of vertices) {
      if (!visited[vertex] && distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        minVertex = vertex;
      }
    }
    
    // If no reachable vertex found, break
    if (minVertex === null) break;
    
    // Mark as visited
    visited[minVertex] = true;
    
    // Update distances to neighbors
    for (const neighbor in graph[minVertex]) {
      if (!visited[neighbor]) {
        const newDistance = distances[minVertex] + graph[minVertex][neighbor];
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
        }
      }
    }
  }
  
  return distances;
}

// ========== Test Cases ==========
function runTests() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   DIJKSTRA\'S ALGORITHM - TESTS      ║');
  console.log('╚══════════════════════════════════════╝\n');

  // Test 1: Basic graph from the assignment
  console.log('=== Test 1: Basic Graph ===\n');
  
  const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'C': 5, 'D': 10 },
    'C': { 'A': 2, 'B': 5, 'D': 3 },
    'D': { 'B': 10, 'C': 3 }
  };

  console.log('Graph:');
  console.log('  A -> B(4), C(2)');
  console.log('  B -> A(4), C(5), D(10)');
  console.log('  C -> A(2), B(5), D(3)');
  console.log('  D -> B(10), C(3)');
  
  console.log('\nStarting vertex: A\n');

  const result = dijkstra(graph, 'A');
  
  console.log('Shortest distances from A:');
  console.log('Expected: { A: 0, B: 4, C: 2, D: 5 }');
  console.log('Result:  ', result);
  
  // Verify result
  const expected = { A: 0, B: 4, C: 2, D: 5 };
  const passed = JSON.stringify(result) === JSON.stringify(expected);
  console.log(`\nTest ${passed ? '✅ PASSED' : '❌ FAILED'}`);

  // Test 2: With paths
  console.log('\n\n=== Test 2: Shortest Paths ===\n');
  
  const resultWithPaths = dijkstraWithPaths(graph, 'A');
  
  console.log('Distances:', resultWithPaths.distances);
  console.log('\nShortest paths from A:');
  for (const vertex in resultWithPaths.paths) {
    const path = resultWithPaths.paths[vertex];
    console.log(`  A -> ${vertex}: ${path ? path.join(' -> ') : 'unreachable'} (distance: ${resultWithPaths.distances[vertex]})`);
  }

  // Test 3: Larger graph
  console.log('\n\n=== Test 3: Larger Graph ===\n');
  
  const largeGraph = {
    'A': { 'B': 5, 'C': 1 },
    'B': { 'A': 5, 'C': 2, 'D': 3, 'E': 7 },
    'C': { 'A': 1, 'B': 2, 'D': 4, 'E': 5 },
    'D': { 'B': 3, 'C': 4, 'E': 1, 'F': 8 },
    'E': { 'B': 7, 'C': 5, 'D': 1, 'F': 2 },
    'F': { 'D': 8, 'E': 2, 'G': 3 },
    'G': { 'F': 3, 'H': 1 },
    'H': { 'G': 1 }
  };
  
  console.log('Finding shortest paths from A in larger graph...');
  const largeResult = dijkstraWithPaths(largeGraph, 'A');
  
  console.log('\nDistances from A:');
  for (const vertex in largeResult.distances) {
    const distance = largeResult.distances[vertex];
    const path = largeResult.paths[vertex];
    console.log(`  A -> ${vertex}: ${distance === Infinity ? '∞ (unreachable)' : distance}`);
    if (path && path.length > 1) {
      console.log(`    Path: ${path.join(' -> ')}`);
    }
  }

  // Test 4: Disconnected graph
  console.log('\n\n=== Test 4: Disconnected Graph ===\n');
  
  const disconnectedGraph = {
    'X': { 'Y': 5 },
    'Y': { 'X': 5 },
    'Z': { 'W': 3 },
    'W': { 'Z': 3 }
  };
  
  const disResult = dijkstra(disconnectedGraph, 'X');
  console.log('Graph has two separate components: X-Y and Z-W');
  console.log('Starting from X:');
  console.log('Result:', disResult);
  console.log('Note: Unreachable vertices have distance Infinity');

  // Test 5: Single vertex
  console.log('\n\n=== Test 5: Single Vertex ===\n');
  
  const singleGraph = {
    'Solo': {}
  };
  
  const singleResult = dijkstra(singleGraph, 'Solo');
  console.log('Starting from Solo:');
  console.log('Result:', singleResult);

  // Test 6: Simple implementation comparison
  console.log('\n\n=== Test 6: Algorithm Comparison ===\n');
  
  console.log('Comparing heap-based vs simple implementation:');
  const heapResult = dijkstra(graph, 'A');
  const simpleResult = dijkstraSimple(graph, 'A');
  
  console.log('Heap-based:', heapResult);
  console.log('Simple:    ', simpleResult);
  console.log('Results match:', JSON.stringify(heapResult) === JSON.stringify(simpleResult) ? '✅ Yes' : '❌ No');
}

// Run all tests
runTests();

// ========== Interactive Example ==========
console.log('\n\n╔══════════════════════════════════════╗');
console.log('║   INTERACTIVE USAGE EXAMPLE         ║');
console.log('╚══════════════════════════════════════╝');

/**
 * Example of how to use the function in a real application.
 */
function exampleUsage() {
  // City distance graph
  const cityGraph = {
    'New York': { 'Boston': 215, 'Philadelphia': 97, 'Washington DC': 225 },
    'Boston': { 'New York': 215 },
    'Philadelphia': { 'New York': 97, 'Washington DC': 142 },
    'Washington DC': { 'New York': 225, 'Philadelphia': 142, 'Richmond': 109 },
    'Richmond': { 'Washington DC': 109, 'Raleigh': 154 },
    'Raleigh': { 'Richmond': 154, 'Atlanta': 356 },
    'Atlanta': { 'Raleigh': 356, 'Miami': 662 },
    'Miami': { 'Atlanta': 662 }
  };
  
  console.log('\nCity Distance Map:');
  console.log('Find shortest route from New York to Miami\n');
  
  const result = dijkstraWithPaths(cityGraph, 'New York');
  
  console.log(`Distance to Miami: ${result.distances['Miami']} miles`);
  console.log(`Route: ${result.paths['Miami'].join(' → ')}`);
}

exampleUsage();