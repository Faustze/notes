# 704. Бинарный поиск (Easy) (<https://leetcode.com/problems/binary-search/>)

> Дан массив целых чисел nums, отсортированный по возрастанию, и целое число target. Напишите функцию, которая ищет target в nums.
> Если target существует, верните его индекс.
> В противном случае верните -1.
> Алгоритм должен иметь временную сложность O(log n).
> Ограничения: - 1 <= nums.length <= 10^4 - -10^4 < nums[i], target < 10^4 - Все целые числа в nums уникальны.
>
> - nums отсортирован по возрастанию.

```ts
function search(nums: number[], target: number): number {
  let left = 0,
    right = nums.length - 1
  let middle = Math.floor((left + right) / 2)

  while (right >= left) {
    if (target > nums[middle]) {
      left = middle + 1
    } else if (target < nums[middle]) {
      right = middle - 1
    } else {
      return middle
    }
    middle = Math.floor((left + right) / 2)
  }

  return -1
}

// Local check:
console.log(search([-1, 0, 3, 5, 9, 12], 9)) // 4
console.log(search([-1, 0, 3, 5, 9, 12], 2)) // -1
console.log(search([-1, 0, 3, 5, 9, 12], 12)) // 5
```

```md
Example 1:

    Input: nums = [-1,0,3,5,9,12], target = 9
    Output: 4
    Explanation: 9 exists in nums and its index is 4

Example 2:

    Input: nums = [-1,0,3,5,9,12], target = 2
    Output: -1
    Explanation: 2 does not exist in nums so return -1
```

#leetcode
