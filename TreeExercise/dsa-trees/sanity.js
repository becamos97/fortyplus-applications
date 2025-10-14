// adjust paths to where your starter classes live
const { Tree, TreeNode, BinaryTree, BinaryTreeNode } = require('./trees'); 
// or ES modules:
// import { Tree, TreeNode, BinaryTree, BinaryTreeNode } from "./trees.js";

// N-ary tree
const t = new Tree(
  new TreeNode(5, [
    new TreeNode(2),
    new TreeNode(8, [new TreeNode(3), new TreeNode(10)]),
  ])
);
console.log('sumValues ->', t.sumValues());      // expect 28
console.log('countEvens ->', t.countEvens());    // expect 2   (2,10)
console.log('numGreater(5) ->', t.numGreater(5));// expect 2   (8,10)

// Binary tree
//      1
//     / \
//    2   3
//       / \
//      4   5
const bt = new BinaryTree(
  new BinaryTreeNode(1,
    new BinaryTreeNode(2),
    new BinaryTreeNode(3, new BinaryTreeNode(4), new BinaryTreeNode(5))
  )
);
console.log('minDepth ->', bt.minDepth());   // expect 2 (1->2)
console.log('maxDepth ->', bt.maxDepth());   // expect 3
console.log('maxSum ->', bt.maxSum());       // expect 10 (4+3+1+2)
console.log('nextLarger(3) ->', bt.nextLarger(3)); // expect 4