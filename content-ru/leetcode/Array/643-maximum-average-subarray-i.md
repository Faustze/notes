# 643. Maximum Average Subarray I (Easy) (<https://leetcode.com/problems/maximum-average-subarray-i/>)

> Дан массив целых чисел nums, состоящий из n элементов, и целое число k.
> Найдите непрерывный подмассив длиной, равной k, у которого максимальное среднее значение, и верните это значение.
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
Пример 1:
Ввод: nums = [1,12,-5,-6,50,3], k = 4
Вывод: 12.75
Объяснение: Максимальное среднее равно (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75

Пример 2:
Ввод: nums = [5], k = 1
Вывод: 5.00000
```

[[leetcode/Array/index|array]]
[[leetcode/Patterns/index|patterns — sliding window]]
#leetcode
