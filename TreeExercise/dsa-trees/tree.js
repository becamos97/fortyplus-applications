/** TreeNode: node for a general tree. */

class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

class Tree {
  constructor(root = null) {
    this.root = root;
  }

  /** sumValues(): add up all of the values in the tree. */

  sumValues() {
    if (!this.root) return 0;
    let sum = 0;
    const stack = [this.root];
    while (stack.length) {
      const cur = stack.pop();
      sum += cur.val;
      for (const child of cur.children) stack.push(child);
    }
    return sum;
  }

  /** countEvens(): count all of the nodes in the tree with even values. */

  countEvens() {
    if (!this.root) return 0;
    let count = 0;
    const stack = [this.root];
    while (stack.length) {
      const cur = stack.pop();
      if (cur.val % 2 === 0) count++;
      for (const child of cur.children) stack.push(child);
    }
    return count;
  }

  /** numGreater(lowerBound): return a count of the number of nodes
   * whose value is greater than lowerBound. */

  numGreater(x) {
    if (!this.root) return 0;
    let count = 0;
    const stack = [this.root];
    while (stack.length) {
      const cur = stack.pop();
      if (cur.val > x) count++;
      for (const child of cur.children) stack.push(child);
    }
    return count;
  }
}

module.exports = { Tree, TreeNode };
