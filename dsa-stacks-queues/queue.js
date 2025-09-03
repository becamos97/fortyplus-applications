/** Node: node for a queue. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** Queue: chained-together nodes where you can
 *  remove from the front or add to the back. */
class Queue {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  /** enqueue(val): add new value to end of the queue. Returns undefined. */
  enqueue(val) {
    const node = new Node(val);
    if (this.first === null) {
      this.first = this.last = node;
    } else {
      this.last.next = node;
      this.last = node;
    }
    this.size += 1;
    return undefined;
  }

  /** dequeue(): remove from start of queue & return value.
   *  Throws error if queue is empty. */
  dequeue() {
    if (this.first === null) {
      throw new Error("Cannot dequeue from an empty queue.");
    }
    const val = this.first.val;
    this.first = this.first.next;
    if (this.first === null) this.last = null;
    this.size -= 1;
    return val;
  }

  /** peek(): return first value without removing. */
  peek() {
    return this.first ? this.first.val : undefined;
  }

  /** isEmpty(): return true if empty, else false. */
  isEmpty() {
    return this.size === 0;
  }
}

module.exports = Queue;