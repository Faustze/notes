# 643. Maximum Average Subarray I (Easy) (<https://leetcode.com/problems/maximum-average-subarray-i/>)

> Дан целочисленный массив nums из n элементов и целое число k.
> Найдите непрерывный подмассив длины k с максимальным средним значением и верните это значение.
> Любой ответ с погрешностью вычисления менее 10^-5 будет принят.
> Ограничения: - n == nums.length - 1 <= k <= n <= 10^5 - -10^4 <= nums[i] <= 10^4

```ts
function findMaxAverage(nums: number[], k: number): number {
  let maxSum = nums.slice(0, k).reduce((acc, cur) => acc + cur, 0)
  let curSum = maxSum

  for (let i = 0; i < nums.length - k; i++) {
    curSum = curSum - nums[i] + nums[i + k]
    maxSum = curSum > maxSum ? curSum : maxSum
  }

  return maxSum / k
}

console.log(findMaxAverage([1, 12, -5, -6, 50, 3], 4)) // 12.75
console.log(findMaxAverage([5], 1)) // 5.0
```

```md
Example 1:
Input: nums = [1,12,-5,-6,50,3], k = 4
Output: 12.75
Explanation: Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75
Example 2:
Input: nums = [5], k = 1
Output: 5.00000
```

[[leetcode/Array/index|array]]
[[leetcode/Patterns/index|patterns — sliding window]]
#leetcode
