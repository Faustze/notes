# 206. Reverse Linked List (Easy) (<https://leetcode.com/problems/reverse-linked-list/>)

> Given the head of a singly linked list, reverse the list, and return the reversed list.
> Constraints: - The number of nodes in the list is in the range [0, 5000].
>
> - -5000 <= Node.val <= 5000 Follow up: A linked list can be reversed either iteratively or recursively.
>   Could you implement both?

```ts
class ListNode {
  val: number
  next: ListNode | null
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val
    this.next = next === undefined ? null : next
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  if (head === null) return null

  let prev: ListNode | null = null
  let current: ListNode | null = head

  while (current !== null) {
    const next: ListNode | null = current.next // запоминаем следующий узел
    current.next = prev // разворачиваем ссылку
    prev = current // двигаем prev
    current = next // переходим дальше
  }

  return prev
}

// Local check:
const list1 = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))))
console.log(reverseList(list1)) // [5,4,3,2,1]

const list2 = new ListNode(1, new ListNode(2))
console.log(reverseList(list2)) // [2,1]

console.log(reverseList(null)) // []
```

```md
Example 1:

    Input: head = [1,2,3,4,5]
    Output: [5,4,3,2,1]

Example 2:

    Input: head = [1,2]
    Output: [2,1]

Example 3:

    Input: head = []
    Output: []
```

[[leetcode/Linked List/index|linked-list]]
[[leetcode/Linked List/876-middle-of-the-linked-list|876-middle-of-the-linked-list]]
#leetcode
