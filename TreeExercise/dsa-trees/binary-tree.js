/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth() {
    if (!this.root) return 0;
    // BFS finds the first leaf at the shallowest depth
    const q = [{ node: this.root, depth: 1 }];
    while (q.length) {
      const { node, depth } = q.shift();
      if (!node.left && !node.right) return depth;
      if (node.left) q.push({ node: node.left, depth: depth + 1 });
      if (node.right) q.push({ node: node.right, depth: depth + 1 });
    }
    return 0; // unreachable

  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth() {
    const dfs = (n) => {
      if (!n) return 0;
      return 1 + Math.max(dfs(n.left), dfs(n.right));
    };
    return dfs(this.root);

  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

  
  maxSum() {
    let best = -Infinity;

    const gain = (n) => {
      if (!n) return 0;

      // Max gain from left/right (ignore negative branches by clamping at 0)
      const leftGain = Math.max(0, gain(n.left));
      const rightGain = Math.max(0, gain(n.right));

      // Path passing through n (as a "peak")
      const through = n.val + leftGain + rightGain;
      if (through > best) best = through;

      // Return the best single-branch gain to parent
      return n.val + Math.max(leftGain, rightGain);
    };

    if (!this.root) return 0; // define empty as 0; adjust if spec says otherwise
    gain(this.root);
    return best;
  }

  /**
   * nextLarger(x): returns the smallest value > x in the tree (or null).
   * @param {number} x
   */

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(x) {
      if (!this.root) return null;
      let candidate = null;
      const stack = [this.root];

      while (stack.length) {
        const n = stack.pop();
        if (n.val > x && (candidate === null || n.val < candidate)) {
          candidate = n.val;
        }
        if (n.left) stack.push(n.left);
        if (n.right) stack.push(n.right);
      }

      return candidate;
    }
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {

  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize() {

  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize() {

  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
