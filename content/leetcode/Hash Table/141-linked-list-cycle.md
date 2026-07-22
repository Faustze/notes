# 141. Linked List Cycle (Easy) (<https://leetcode.com/problems/linked-list-cycle/description/>)

> Given head, the head of a linked list, determine if the linked list has a cycle in it.
> There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.
> Internally, pos is used to denote the index of the node that tail's next pointer is connected to.
> Note that pos is not passed as a parameter.
> Return true if there is a cycle in the linked list.
> Otherwise, return false.
> Constraints: - The number of the nodes in the list is in the range [0, 10^4].
> - -10^5 <= Node.val <= 10^5 - pos is -1 or a valid index in the linked-list.
> Follow up: Can you solve it using O(1) (i.e.
> constant) memory?

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

// Local check:
console.log(hasCycle(toList([3, 2, 0, -4], 1))); // true
console.log(hasCycle(toList([1, 2], 0))); // true
console.log(hasCycle(toList([1], -1))); // false
console.log(hasCycle(toList([], -1))); // false
console.log(hasCycle(toList([1, 2, 3, 4, 5], -1))); // false
console.log(hasCycle(toList([1, 2, 3, 4, 5], 4))); // true (tail → last node itself)
```

```md
Example 1:

    Input: head = [3,2,0,-4], pos = 1
    Output: true
    Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).

  Example 2:

    Input: head = [1,2], pos = 0
    Output: true
    Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.

  Example 3:

    Input: head = [1], pos = -1
    Output: false
    Explanation: There is no cycle in the linked list.
```

[[leetcode/Hash Table/index|hash-table]]
[[leetcode/Linked List/876-middle-of-the-linked-list|876 — тот же fast & slow pointer]]
[[leetcode/Patterns/index|patterns]]
#leetcode
