# 104. Maximum Depth of Binary Tree (Easy) (<https://leetcode.com/problems/maximum-depth-of-binary-tree/>)

> Given the root of a binary tree, return its maximum depth.
> A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.
> Constraints: - The number of nodes in the tree is in the range [0, 10^4].
> - -100 <= Node.val <= 100

```ts
class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }
}

function maxDepth(root: TreeNode | null): number {
  if (root === null) {
    return 0
  }

  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}

// Local check:
const root = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7)),
)
console.log(maxDepth(root)) // 3

const root2 = new TreeNode(1, null, new TreeNode(2))
console.log(maxDepth(root2)) // 2
```

```md
Example 1:

    Input: root = [3,9,20,null,null,15,7]
    Output: 3

  Example 2:

    Input: root = [1,null,2]
    Output: 2
```
