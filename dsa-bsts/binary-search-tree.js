class BinarySearchNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(root = null) {
    this.root = root;
  }

  /** insert(val): insert a new node into the BST with value val.
   * Returns the tree. Uses iteration. */

  insert(value) {
    const newNode = new BinarySearchNode(value);
    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let curr = this.root;
    while (true) {
      if (value < curr.val) {
        if (!curr.left) {
          curr.left = newNode;
          return this;
        }
        curr = curr.left;
      } else {
        // Place duplicates on the right side by convention
        if (!curr.right) {
          curr.right = newNode;
          return this;
        }
        curr = curr.right;
      }
    }
}
  /** insertRecursively(val): insert a new node into the BST with value val.
   * Returns the tree. Uses recursion. */

  insertRecursively(value) {
    const insertNode = (node, val) => {
      if (!node) return new BinarySearchNode(val);
      if (val < node.val) {
        node.left = insertNode(node.left, val);
      } else {
        node.right = insertNode(node.right, val); // duplicates go right
      }
      return node;
    };

    this.root = insertNode(this.root, value);
    return this;
  }

  /** find(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses iteration. */

  findIteratively(value) {
    let curr = this.root;
    while (curr) {
      if (curr.val === value) return curr;
      curr = value < curr.val ? curr.left : curr.right;
    }
    return undefined;
  }

  /** findRecursively(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses recursion. */

  findRecursively(value) {
    const findNode = (node, val) => {
      if (!node) return undefined;
      if (node.val === val) return node;
      return val < node.val
        ? findNode(node.left, val)
        : findNode(node.right, val);
    };
    return findNode(this.root, value);
  }

  /** dfsPreOrder(): Traverse the array using pre-order DFS.
   * Return an array of visited nodes. */

  dfsPreOrder() {
    const out = [];
    const traverse = (node) => {
      if (!node) return;
      out.push(node.val);       // N
      traverse(node.left);      // L
      traverse(node.right);     // R
    };
    traverse(this.root);
    return out;
  }

  /** dfsInOrder(): Traverse the array using in-order DFS.
   * Return an array of visited nodes. */

  dfsInOrder() {
    const out = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);      // L
      out.push(node.val);       // N
      traverse(node.right);     // R
    };
    traverse(this.root);
    return out;
  }

  /** dfsPostOrder(): Traverse the array using post-order DFS.
   * Return an array of visited nodes. */

  dfsPostOrder() {
    const out = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);      // L
      traverse(node.right);     // R
      out.push(node.val);       // N
    };
    traverse(this.root);
    return out;
  }

  /** bfs(): Traverse the array using BFS.
   * Return an array of visited nodes. */

  bfs() {
    const out = [];
    if (!this.root) return out;

    const q = [this.root];
    while (q.length) {
      const node = q.shift();
      out.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    return out;
  }

  /** Further Study!
   * remove(val): Removes a node in the BST with the value val.
   * Returns the removed node. */

  remove(val) {

  }

  /** Further Study!
   * isBalanced(): Returns true if the BST is balanced, false otherwise. */

  isBalanced() {

  }

  /** Further Study!
   * findSecondHighest(): Find the second highest value in the BST, if it exists.
   * Otherwise return undefined. */

  findSecondHighest() {
    
  }
}

module.exports = BinarySearchTree;
