/** Node: node for a stack. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** Stack: chained-together nodes where you can
 *  remove from the top or add to the top. */
class Stack {
  constructor() {
    this.first = null; // top
    this.last = null;  // bottom
    this.size = 0;
  }

  /** push(val): add new value to top of the stack. Returns undefined. */
  push(val) {
    const node = new Node(val);
    if (this.first === null) {
      this.first = this.last = node;
    } else {
      node.next = this.first;
      this.first = node;
    }
    this.size += 1;
    return undefined;
  }

  /** pop(): remove from top & return value.
   *  Throws error if stack is empty. */
  pop() {
    if (this.first === null) {
      throw new Error("Cannot pop from an empty stack.");
    }
    const val = this.first.val;
    this.first = this.first.next;
    if (this.first === null) this.last = null;
    this.size -= 1;
    return val;
  }

  /** peek(): return top value without removing. */
  peek() {
    return this.first ? this.first.val : undefined;
  }

  /** isEmpty(): return true if empty, else false. */
  isEmpty() {
    return this.size === 0;
  }
}

module.exports = Stack;