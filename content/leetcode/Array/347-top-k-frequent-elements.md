# 347. Top K Frequent Elements (Medium) (<https://leetcode.com/problems/top-k-frequent-elements/>)

> Given an integer array nums and an integer k, return the k most frequent elements.
> You may return the answer in any order.
> Constraints: - 1 <= nums.length <= 10^5 - -10^4 <= nums[i] <= 10^4 - k is in the range [1, the number of unique elements in the array] - It is guaranteed that the answer is unique

```ts
function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>()

  for (const num of nums) {
    freq.set(num, (freq.get(num) ?? 0) + 1)
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1]) // сортируем по частоте
    .slice(0, k)
    .map(([num]) => num)
}

// Local check:
console.log(topKFrequent([1,1,1,2,2,3], 2))
console.log(topKFrequent([7,7], 1))
console.log(topKFrequent([1], 1))
console.log(topKFrequent([1,2,1,2,1,2,3,1,3,2], 2))
```

```md
Example 1:

    Input: nums = [1,1,1,2,2,3], k = 2
    Output: [1,2]
    Explanation: The values 1 and 2 appear most frequently.

  Example 2:

    Input: nums = [1], k = 1
    Output: [1]

  Example 3:

    Input: nums = [1,2,1,2,1,2,3,1,3,2], k = 2
    Output: [1,2]
```

[[leetcode/Array/index|array]]
#leetcode
