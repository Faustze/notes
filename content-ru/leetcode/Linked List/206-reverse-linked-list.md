# 206. Reverse Linked List (Easy) (<https://leetcode.com/problems/reverse-linked-list/>)

  >Дана голова head односвязного списка, разверните список и верните развёрнутый список.
> Ограничения: - количество узлов в списке находится в диапазоне [0, 5000].
> - -5000 <= Node.val <= 5000 Дополнительно: связный список можно развернуть итеративно или рекурсивно.
> Сможете ли вы реализовать оба варианта?

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
	let current = head
	
	while (current !== null) {
		const next = current.next // запоминаем следующий узел
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
