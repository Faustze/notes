# 141. Linked List Cycle (Easy) (<https://leetcode.com/problems/linked-list-cycle/description/>)

> Дан head — голова связного списка. Определите, содержит ли связный список цикл.
> В связном списке есть цикл, если существует узел, к которому можно снова прийти, непрерывно следуя по указателю next.
> Внутренне используется pos для обозначения индекса узла, к которому подключён указатель next хвостового узла.
> Обратите внимание, что pos не передаётся как параметр.
> Верните true, если в связном списке есть цикл.
> В противном случае верните false.
> Ограничения: - Количество узлов в списке находится в диапазоне [0, 10^4].
> - -10^5 <= Node.val <= 10^5 - pos равен -1 или является допустимым индексом в связном списке.
> Дополнительное задание: Сможете ли вы решить эту задачу, используя O(1) (то есть
> константную) память?

```ts
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function hasCycle(head: ListNode | null): boolean {
  // Floyd's Cycle Detection
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (fast === slow) return true;
  }

  return false;
}

function toList(arr: number[], pos: number): ListNode | null {
  if (arr.length === 0) return null;
  const nodes = arr.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return nodes[0];
}

// Локальная проверка:
console.log(hasCycle(toList([3, 2, 0, -4], 1))); // true
console.log(hasCycle(toList([1, 2], 0))); // true
console.log(hasCycle(toList([1], -1))); // false
console.log(hasCycle(toList([], -1))); // false
console.log(hasCycle(toList([1, 2, 3, 4, 5], -1))); // false
console.log(hasCycle(toList([1, 2, 3, 4, 5], 4))); // true (tail → last node itself)
```

```md
Пример 1:

    Вход: head = [3,2,0,-4], pos = 1
    Выход: true
    Объяснение: В связном списке есть цикл, где хвост соединяется с 1-м узлом (индексация с 0).

  Пример 2:

    Вход: head = [1,2], pos = 0
    Выход: true
    Объяснение: В связном списке есть цикл, где хвост соединяется с 0-м узлом.

  Пример 3:

    Вход: head = [1], pos = -1
    Выход: false
    Объяснение: В связном списке нет цикла.
```

[[leetcode/Hash Table/index|hash-table]]
[[leetcode/Linked List/876-middle-of-the-linked-list|876 — тот же fast & slow pointer]]
[[leetcode/Patterns/index|patterns]]
#leetcode
