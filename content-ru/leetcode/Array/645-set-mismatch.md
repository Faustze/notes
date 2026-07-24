# 645. Set Mismatch (Easy) (<https://leetcode.com/problems/set-mismatch>)

> У вас есть множество целых чисел `s`, которое изначально содержит все числа от `1` до `n`.
> К сожалению, из-за некоторой ошибки одно из чисел в `s` продублировалось вместо другого числа множества, что привело к повторению одного числа и потере другого.
> Вам дан массив целых чисел nums, представляющий состояние данных этого множества после ошибки.
> Найдите число, которое встречается дважды, и число, которое отсутствует, и верните их в виде массива.
> Ограничения: - 2 <= nums.length <= 10^4 - 1 <= nums[i] <= 10^4

```ts
function findErrorNums(nums: number[]): number[] {
  let dupSum = 0
  let actualSum = 0
  // This is the formula for the sum of an arithmetic progression
  const expectedSum = (nums.length * (nums.length + 1)) / 2
  const seen = new Set<number>()

  for (const n of nums) {
    if (seen.has(n))
      dupSum = n
    seen.add(n)
    actualSum += n
  }

  const missing = expectedSum - (actualSum - dupSum)
  return [dupSum, missing]
}

// Local check:
console.log(findErrorNums([1, 2, 2, 4]))
console.log(findErrorNums([1, 1]))
```

```md
Example 1:

    Input: nums = [1,2,2,4]
    Output: [2,3]
    Explanation: The number 2 appears twice and the number 3 is missing.

  Example 2:

    Input: nums = [1,1]
    Output: [1,2]
    Explanation: The number 1 appears twice and the number 2 is missing.
```

[[leetcode/Array/636-exclusive-time-of-functions]]
[[leetcode/Array/739-daily-temperatures]]
[[leetcode/Array/217-contains-duplicate|217 — то же set-семейство]]
#leetcode
