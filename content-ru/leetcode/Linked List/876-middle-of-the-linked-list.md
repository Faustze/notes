# 876. Middle of the Linked List (Easy) (<https://leetcode.com/problems/middle-of-the-linked-list/>)

  > Дана голова head односвязного списка, верните средний узел связного списка.
> Если средних узлов два, верните второй из них.

```ts
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}
  
// Local check:
function toList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
  }
  return head;
}

function toArray(node: ListNode | null): number[] {
  const out: number[] = [];
  while (node !== null) {
    out.push(node.val);
    node = node.next;
  }
  return out;
}

console.log(toArray(middleNode(toList([1, 2, 3, 4, 5]))));
console.log(toArray(middleNode(toList([1, 2, 3, 4, 5, 6]))));
```

```md
Example 1:
    Input: head = [1,2,3,4,5]
    Output: [3,4,5]
    Explanation: The middle node of the list is node 3.
Example 2:
    Input: head = [1,2,3,4,5,6]
    Output: [4,5,6]
    Explanation: Since the list has two middle nodes with values 3 and 4, we return the second one.
```

[[leetcode/Linked List/index|linked-list]]
[[leetcode/Hash Table/141-linked-list-cycle|141 — тот же fast & slow pointer]]
[[leetcode/Patterns/index|patterns]]
#leetcode
