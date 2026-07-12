// Priority values (using strings for simplicity)
const Priority = Object.freeze({
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
});

/**
 * Represents a task with a name, time interval, and priority.
 */
class Task {
  /**
   * @param {string} name
   * @param {number} start - start time (inclusive)
   * @param {number} end - end time (exclusive)
   * @param {string} priority - one of Priority.HIGH, MEDIUM, LOW
   */
  constructor(name, start, end, priority) {
    if (start >= end) {
      throw new Error('Start time must be less than end time');
    }
    this.name = name;
    this.start = start;
    this.end = end;
    this.priority = priority;
  }
}

/**
 * A task scheduler that supports sorting, grouping, and overlap detection.
 */
class TaskScheduler {
  constructor(tasks = []) {
    this.tasks = tasks;
  }

  /**
   * Add a task to the scheduler.
   * @param {Task} task
   */
  addTask(task) {
    this.tasks.push(task);
  }

  /**
   * Returns a new array of tasks sorted by start time.
   * Time: O(n log n) – uses Array.prototype.sort (Timsort in most engines).
   * Space: O(n) – creates a sorted copy.
   * @returns {Task[]}
   */
  sortByStartTime() {
    return [...this.tasks].sort((a, b) => a.start - b.start);
  }

  /**
   * Groups tasks by priority.
   * Time: O(n) – single pass with hash map lookups/inserts.
   * Space: O(n) – all tasks stored in groups.
   * @returns {Object<string, Task[]>} e.g., { High: [task1, task2], Medium: [...] }
   */
  groupByPriority() {
    const groups = {};
    for (const task of this.tasks) {
      if (!groups[task.priority]) {
        groups[task.priority] = [];
      }
      groups[task.priority].push(task);
    }
    return groups;
  }

  /**
   * Finds all pairs of tasks that overlap in time.
   * Two tasks overlap if one starts before the other ends.
   *
   * Algorithm:
   * 1. Sort tasks by start time (O(n log n)).
   * 2. For each task i, compare with subsequent tasks while the next task's start < current task's end.
   *    Because the list is sorted, once we find a task with start >= current.end, no later task can overlap.
   *
   * Time: O(n log n + k), where k is the number of pair comparisons (output‑sensitive, worst‑case O(n²) when all tasks overlap).
   * Space: O(n) for the sorted copy + O(m) for the result array, where m is the number of overlapping pairs.
   *
   * @returns {Array<[Task, Task]>} Array of overlapping task pairs.
   */
  findOverlaps() {
    if (this.tasks.length < 2) return [];

    const sorted = this.sortByStartTime();
    const overlaps = [];
    const n = sorted.length;

    for (let i = 0; i < n; i++) {
      const curr = sorted[i];
      let j = i + 1;
      while (j < n && sorted[j].start < curr.end) {
        // Overlap condition: curr.start < sorted[j].end (true because startj < currend) and startj < currend (already checked)
        // Also need to check that current doesn't end before the other starts (already implied by loop condition)
        overlaps.push([curr, sorted[j]]);
        j++;
      }
    }
    return overlaps;
  }

  /**
   * Rough memory estimation for a given number of tasks.
   * Assumptions (simplified, not exact):
   * - Task object: ~96 bytes (string reference, two numbers, a string reference, object overhead).
   * - Overhead for the task list: ~56 bytes.
   * This is a very basic model; actual memory depends on engine optimisations.
   *
   * @param {number} numTasks
   * @returns {number} estimated bytes
   */
  static estimateMemory(numTasks) {
    // Rough size of a Task object (assuming 64‑bit system)
    const taskObjectOverhead = 32;  // base object
    const nameRef = 8;              // pointer to string
    const startNum = 8;
    const endNum = 8;
    const priorityRef = 8;
    // Total per Task: approx. 64 bytes plus the string data (which varies)
    const perTask = 96; // simple estimate

    // List overhead (array object + pointer array)
    const arrayOverhead = 56;
    return arrayOverhead + numTasks * perTask;
  }
}

// ---------- Demonstration ----------
const scheduler = new TaskScheduler([
  new Task('Write report', 1, 4, Priority.HIGH),
  new Task('Team meeting', 2, 3, Priority.MEDIUM),
  new Task('Code review', 5, 7, Priority.HIGH),
  new Task('Lunch break', 3, 5, Priority.LOW),
  new Task('Planning', 1, 2, Priority.MEDIUM),
]);

// 1. Sorting
console.log('Tasks sorted by start time:');
scheduler.sortByStartTime().forEach(t => {
  console.log(`  ${t.name} [${t.start}-${t.end}) ${t.priority}`);
});

// 2. Grouping
console.log('\nTasks grouped by priority:');
const groups = scheduler.groupByPriority();
for (const [priority, taskList] of Object.entries(groups)) {
  console.log(`  ${priority}: ${taskList.map(t => t.name).join(', ')}`);
}

// 3. Overlap detection
const overlaps = scheduler.findOverlaps();
console.log('\nOverlapping task pairs:');
overlaps.forEach(([t1, t2]) => {
  console.log(`  (${t1.name}, ${t2.name})`);
});

// 4. Memory estimate
console.log(`\nEstimated memory for ${scheduler.tasks.length} tasks: ${TaskScheduler.estimateMemory(scheduler.tasks.length)} bytes`);