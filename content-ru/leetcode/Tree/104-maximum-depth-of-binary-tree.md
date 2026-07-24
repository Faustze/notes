# 104. Максимальная глубина бинарного дерева (Easy) (<https://leetcode.com/problems/maximum-depth-of-binary-tree/>)

> Дан корень бинарного дерева, верните его максимальную глубину.
> Максимальная глубина бинарного дерева — это количество узлов вдоль самого длинного пути от корневого узла до самого дальнего листового узла.
> Ограничения: - Количество узлов в дереве находится в диапазоне [0, 10^4].
>
> - -100 <= Node.val <= 100

```ts
class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

function maxDepth(root: TreeNode | null): number {
  if (root === null) {
    return 0
  }

  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}

// Local check:
const root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)))
console.log(maxDepth(root)) // 3

const root2 = new TreeNode(1, null, new TreeNode(2))
console.log(maxDepth(root2)) // 2
```

```md
Пример 1:

    Ввод: root = [3,9,20,null,null,15,7]
    Вывод: 3

Пример 2:

    Ввод: root = [1,null,2]
    Вывод: 2
```

[[leetcode/Binary-Tree/index]]
#leetcode
