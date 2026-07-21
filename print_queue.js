// ========== Queue Data Structure ==========
class Queue {
  constructor() {
    this.items = [];
  }

  /**
   * Add an element to the end of the queue.
   * Time: O(1)
   */
  enqueue(element) {
    this.items.push(element);
  }

  /**
   * Remove and return the front element.
   * Time: O(n) due to shift, but acceptable for simulation.
   * For production, use a linked list for O(1) dequeue.
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue underflow: cannot dequeue from an empty queue');
    }
    return this.items.shift();
  }

  /**
   * Return the front element without removing it.
   * Time: O(1)
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty: cannot peek');
    }
    return this.items[0];
  }

  /**
   * Check if the queue is empty.
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get the number of elements in the queue.
   */
  size() {
    return this.items.length;
  }

  /**
   * Print all items in the queue (for debugging).
   */
  print() {
    if (this.isEmpty()) {
      console.log('Queue is empty');
      return;
    }
    console.log('Current queue:');
    this.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.toString()}`);
    });
  }
}

// ========== Print Job ==========
class PrintJob {
  /**
   * @param {string} employeeName
   * @param {number} pages - number of pages to print
   */
  constructor(employeeName, pages) {
    this.id = PrintJob._nextId++;
    this.employeeName = employeeName;
    this.pages = pages;
    this.timestamp = new Date();
  }

  toString() {
    return `[Job #${this.id}] ${this.employeeName} - ${this.pages} page(s) [submitted: ${this.timestamp.toLocaleTimeString()}]`;
  }

  // Static ID counter
  static _nextId = 1;
}

// ========== Printer Queue Simulation ==========
class PrinterQueue {
  constructor(printerName = 'Office Printer') {
    this.queue = new Queue();
    this.printerName = printerName;
    this.totalJobsProcessed = 0;
    this.totalPagesPrinted = 0;
    this.currentJob = null;
    this.isProcessing = false;
  }

  /**
   * Add a print job to the queue.
   * @param {string} employeeName
   * @param {number} pages
   */
  addJob(employeeName, pages) {
    if (pages <= 0) {
      console.log('Error: Page count must be positive');
      return;
    }
    const job = new PrintJob(employeeName, pages);
    this.queue.enqueue(job);
    console.log(`✅ Added: ${job.toString()}`);
    console.log(`   Queue size: ${this.queue.size()}`);
  }

  /**
   * Process the next job in the queue.
   */
  processNext() {
    if (this.queue.isEmpty()) {
      console.log('ℹ️  No print jobs in queue. Printer is idle.');
      return null;
    }

    const job = this.queue.dequeue();
    this.currentJob = job;
    this.isProcessing = true;

    console.log(`\n🖨️  Processing ${job.toString()}`);
    
    // Simulate printing time (approximately 1 second per page, simulated with a delay)
    this._simulatePrinting(job);
    
    return job;
  }

  /**
   * Simulate the printing process with delays.
   * In real implementation, this could be async.
   * @param {PrintJob} job
   */
  _simulatePrinting(job) {
    const timePerPage = 200; // milliseconds per page (for simulation)
    const totalTime = Math.min(job.pages * timePerPage, 3000); // cap at 3 seconds for demo
    
    // Simulate synchronous printing (in real system, this would be async)
    console.log(`   Printing ${job.pages} page(s)...`);
    
    // Use setTimeout to simulate async printing
    setTimeout(() => {
      this._completeJob(job);
    }, totalTime);
  }

  /**
   * Complete a print job and update statistics.
   * @param {PrintJob} job
   */
  _completeJob(job) {
    this.totalJobsProcessed++;
    this.totalPagesPrinted += job.pages;
    this.currentJob = null;
    this.isProcessing = false;
    
    console.log(`✅ Completed: [Job #${job.id}] ${job.employeeName}`);
    console.log(`   Total pages printed: ${this.totalPagesPrinted}`);
    console.log(`   Jobs remaining in queue: ${this.queue.size()}`);
    
    // Auto-process next job if queue is not empty
    if (!this.queue.isEmpty()) {
      console.log('   Processing next job...');
      this.processNext();
    }
  }

  /**
   * Process all jobs in the queue sequentially.
   * Note: Due to setTimeout, this will process them asynchronously.
   */
  processAll() {
    if (this.queue.isEmpty()) {
      console.log('ℹ️  No print jobs to process.');
      return;
    }
    
    console.log(`\n📋 Starting to process ${this.queue.size()} job(s)...`);
    this.processNext();
  }

  /**
   * Peek at the next job to be printed.
   */
  peekNext() {
    if (this.queue.isEmpty()) {
      console.log('ℹ️  No jobs in queue');
      return null;
    }
    
    const next = this.queue.peek();
    console.log(`🔍 Next to print: ${next.toString()}`);
    return next;
  }

  /**
   * Print the current queue status.
   */
  printStatus() {
    console.log(`\n=== ${this.printerName} Status ===`);
    console.log(`Current job: ${this.currentJob ? this.currentJob.toString() : 'Idle'}`);
    console.log(`Jobs in queue: ${this.queue.size()}`);
    console.log(`Total processed: ${this.totalJobsProcessed} jobs, ${this.totalPagesPrinted} pages`);
    
    if (!this.queue.isEmpty()) {
      console.log('\nPending jobs:');
      this.queue.print();
    }
    console.log('===============================\n');
  }

  /**
   * Cancel all pending jobs (clear the queue).
   */
  cancelAll() {
    const count = this.queue.size();
    // Reset queue
    this.queue.items = [];
    console.log(`🗑️  Cancelled ${count} pending job(s)`);
  }
}

// ========== Synchronous Version (for immediate output demo) ==========
class SynchronousPrinterQueue extends PrinterQueue {
  /**
   * Override to process without delay for demo purposes.
   */
  processNext() {
    if (this.queue.isEmpty()) {
      console.log('ℹ️  No print jobs in queue. Printer is idle.');
      return null;
    }

    const job = this.queue.dequeue();
    this.currentJob = job;
    this.totalJobsProcessed++;
    this.totalPagesPrinted += job.pages;

    console.log(`🖨️  Processed: ${job.toString()}`);
    console.log(`   ✅ Completed ${job.pages} page(s)`);
    console.log(`   Total pages printed: ${this.totalPagesPrinted}\n`);

    this.currentJob = null;
    return job;
  }

  processAll() {
    if (this.queue.isEmpty()) {
      console.log('ℹ️  No print jobs to process.');
      return;
    }

    console.log(`\n📋 Processing ${this.queue.size()} job(s) synchronously...\n`);
    while (!this.queue.isEmpty()) {
      this.processNext();
    }
    console.log('✅ All jobs completed!');
  }
}

// ========== Test the Implementation ==========
function runDemo() {
  console.log('╔════════════════════════════════════╗');
  console.log('║   OFFICE PRINTER QUEUE SYSTEM      ║');
  console.log('╚════════════════════════════════════╝\n');

  const printer = new SynchronousPrinterQueue('Office Printer');

  // Test 1: Add print jobs
  console.log('=== Adding Print Jobs ===\n');
  printer.addJob('Alice Johnson', 5);
  printer.addJob('Bob Smith', 3);
  printer.addJob('Carol Williams', 10);
  printer.addJob('David Brown', 2);
  printer.addJob('Eva Martinez', 7);

  // Test 2: Check status
  printer.printStatus();

  // Test 3: Peek at next job
  console.log('=== Checking Next Job ===');
  printer.peekNext();

  // Test 4: Process all jobs
  console.log('\n=== Processing All Jobs ===');
  printer.processAll();

  // Test 5: Check status after processing
  printer.printStatus();

  // Test 6: Add more jobs and process individually
  console.log('=== Adding More Jobs ===\n');
  printer.addJob('Frank Wilson', 4);
  printer.addJob('Grace Lee', 6);

  console.log('\n=== Processing Jobs Individually ===');
  printer.processNext();
  printer.printStatus();
  printer.processNext();
  printer.printStatus();

  // Test 7: Try to process empty queue
  console.log('=== Attempting to Process Empty Queue ===');
  printer.processNext();

  // Test 8: Cancel all test
  console.log('\n=== Testing Cancel All ===');
  printer.addJob('Test User', 1);
  printer.addJob('Another User', 2);
  printer.printStatus();
  printer.cancelAll();
  printer.printStatus();
}

// Run the demo
runDemo();