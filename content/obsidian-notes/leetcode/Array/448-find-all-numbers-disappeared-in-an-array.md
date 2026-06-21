# 448. Find All Numbers Disappeared in an Array (Easy) (<https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array>)

> Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.
> Constraints: - n == nums.length - 1 <= n <= 10^5 - 1 <= nums[i] <= n Follow up: Could you do it without extra space and in O(n) runtime? You may assume the returned list does not count as extra space.

```ts
function findDisappearedNumbers(nums: number[]): number[] {
  const n = nums.length
  const s = new Set<number>()

  // Шаг 1: собираем все уникальные числа из массива
  for (let i = 0; i < n; i++) {
    s.add(nums[i])
  }

  // Шаг 2: перебираем числа от 1 до n
  const result: number[] = []
  for (let i = 1; i <= n; i++) {
    // Шаг 3: если число отсутствует в Set — добавляем в результат
    if (!s.has(i)) {
      result.push(i)
    }
  }

  return result
}

// Local check:
console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1]))
console.log(findDisappearedNumbers([1, 1]))
```

```md
Example 1:

    Input: nums = [4,3,2,7,8,2,3,1]
    Output: [5,6]

  Example 2:

    Input: nums = [1,1]
    Output: [2]
```
