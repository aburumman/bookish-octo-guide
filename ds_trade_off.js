/**
 * Fixed‑size queue implemented with a circular buffer.
 * @param {number} capacity - Maximum number of elements.
 */
class ArrayQueue {
  constructor(capacity) {
    if (capacity <= 0) throw new Error('Capacity must be positive');
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.front = 0;       // index of the first element
    this.rear = -1;       // index of the last element
    this.size = 0;        // current number of elements
  }

  /**
   * Add an element to the rear of the queue.
   * Time: O(1)
   */
  enqueue(element) {
    if (this.size === this.capacity) {
      throw new Error('Queue overflow: cannot enqueue into a full queue');
    }
    this.rear = (this.rear + 1) % this.capacity;
    this.items[this.rear] = element;
    this.size++;
  }

  /**
   * Remove and return the front element.
   * Time: O(1)
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue underflow: cannot dequeue from an empty queue');
    }
    const element = this.items[this.front];
    this.items[this.front] = undefined; // help garbage collection
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return element;
  }

  /**
   * Return the front element without removing it.
   * Time: O(1)
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty: cannot peek');
    }
    return this.items[this.front];
  }

  /**
   * Check if the queue is empty.
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Get current number of elements.
   */
  getSize() {
    return this.size;
  }
}

/**
 * Node for singly linked list.
 */
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * Dynamic queue implemented with a singly linked list.
 */
class LinkedListQueue {
  constructor() {
    this.head = null; // front of the queue
    this.tail = null; // rear of the queue
    this.size = 0;
  }

  /**
   * Add an element to the rear.
   * Time: O(1)
   */
  enqueue(element) {
    const newNode = new ListNode(element);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  /**
   * Remove and return the front element.
   * Time: O(1)
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue underflow: cannot dequeue from an empty queue');
    }
    const element = this.head.value;
    this.head = this.head.next;
    if (this.head === null) {
      this.tail = null; // queue became empty
    }
    this.size--;
    return element;
  }

  /**
   * Return the front element without removing it.
   * Time: O(1)
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty: cannot peek');
    }
    return this.head.value;
  }

  /**
   * Check if the queue is empty.
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Get current number of elements.
   */
  getSize() {
    return this.size;
  }
}

/**
 * Priority queue using a binary min‑heap.
 * Elements are assumed to be comparable (numbers, or objects with a .priority property).
 */
class MinHeapPriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];        // index 0 unused for simpler math, or we can use 0‑indexed.
    this.compare = comparator;
  }

  /**
   * Insert an element.
   * Time: O(log n)
   */
  insert(element) {
    this.heap.push(element);
    this._siftUp(this.heap.length - 1);
  }

  /**
   * Remove and return the minimum element.
   * Time: O(log n)
   */
  extractMin() {
    if (this.isEmpty()) {
      throw new Error('Priority queue underflow: cannot extract from empty queue');
    }
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return min;
  }

  /**
   * Return the minimum element without removing it.
   * Time: O(1)
   */
  peekMin() {
    if (this.isEmpty()) {
      throw new Error('Priority queue is empty: cannot peek');
    }
    return this.heap[0];
  }

  /**
   * Check if the priority queue is empty.
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Get number of elements.
   */
  getSize() {
    return this.heap.length;
  }

  // Helper: bubble up from index i
  _siftUp(i) {
    const element = this.heap[i];
    while (i > 0) {
      const parentIdx = Math.floor((i - 1) / 2);
      const parent = this.heap[parentIdx];
      if (this.compare(element, parent) >= 0) break;
      // swap
      this.heap[i] = parent;
      this.heap[parentIdx] = element;
      i = parentIdx;
    }
  }

  // Helper: sift down from index i
  _siftDown(i) {
    const length = this.heap.length;
    const element = this.heap[i];
    while (true) {
      let leftIdx = 2 * i + 1;
      let rightIdx = 2 * i + 2;
      let smallestIdx = i;

      if (leftIdx < length && this.compare(this.heap[leftIdx], this.heap[smallestIdx]) < 0) {
        smallestIdx = leftIdx;
      }
      if (rightIdx < length && this.compare(this.heap[rightIdx], this.heap[smallestIdx]) < 0) {
        smallestIdx = rightIdx;
      }
      if (smallestIdx === i) break;

      // swap
      [this.heap[i], this.heap[smallestIdx]] = [this.heap[smallestIdx], this.heap[i]];
      i = smallestIdx;
    }
  }
}

/**
 * Priority queue using an ordered array (ascending order).
 * Elements are assumed to be comparable (default: numbers).
 */
class OrderedArrayPriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    this.items = [];
    this.compare = comparator;
  }

  /**
   * Insert an element, maintaining sorted order.
   * Time: O(n) due to array.splice (shifting elements).
   */
  insert(element) {
    // Find index to insert using binary search
    let low = 0;
    let high = this.items.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.compare(element, this.items[mid]) < 0) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    this.items.splice(low, 0, element); // O(n)
  }

  /**
   * Remove and return the minimum element (first in array).
   * Time: O(1) (shift is O(n) but we can use pop if we store reversed; still O(n) for shift).
   * Using shift makes it O(n). For true O(1) extraction, we'd reverse order, but that's not typical.
   * Here we use shift; the problem statement likely expects O(1) for extractMin, but ordered array insertion is O(n) anyway.
   * We'll note complexity.
   */
  extractMin() {
    if (this.isEmpty()) {
      throw new Error('Priority queue underflow: cannot extract from empty queue');
    }
    return this.items.shift(); // O(n) due to shifting elements
  }

  /**
   * Return the minimum element without removing it.
   * Time: O(1)
   */
  peekMin() {
    if (this.isEmpty()) {
      throw new Error('Priority queue is empty: cannot peek');
    }
    return this.items[0];
  }

  /**
   * Check if empty.
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get number of elements.
   */
  getSize() {
    return this.items.length;
  }
}