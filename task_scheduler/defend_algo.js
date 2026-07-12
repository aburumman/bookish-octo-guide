const tasks = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 7 },
  { start: 5, end: 9 },
  { start: 8, end: 10 }
];



function isNonOverlapping(subset) {
  // Sort subset by end time to easily check overlaps
  const sorted = [...subset].sort((a, b) => a.end - b.end);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end) {
      return false;
    }
  }
  return true;
}

function bruteForceMaxTasks(tasks) {
  const n = tasks.length;
  let maxSubset = [];

  // Enumerate all 2^n subsets using bitmask
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subset.push(tasks[i]);
      }
    }
    if (subset.length > maxSubset.length && isNonOverlapping(subset)) {
      maxSubset = subset;
    }
  }
  return maxSubset;
}


function greedyMaxTasks(tasks) {
  if (tasks.length === 0) return [];
  // Sort by end time ascending
  const sorted = [...tasks].sort((a, b) => a.end - b.end);
  const selected = [sorted[0]];
  let lastEnd = sorted[0].end;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start >= lastEnd) {
      selected.push(sorted[i]);
      lastEnd = sorted[i].end;
    }
  }
  return selected;
}