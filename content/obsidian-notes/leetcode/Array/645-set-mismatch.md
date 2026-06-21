# 645. Set Mismatch (Easy) (<https://leetcode.com/problems/set-mismatch>)

> You have a set of integers `s`, which originally contains all the numbers from `1` to `n`.
> Unfortunately, due to some error, one of the numbers in `s` got duplicated to another number in the set, which results in repetition of one number and loss of another number.
> You are given an integer array nums representing the data status of this set after the error.
> Find the number that occurs twice and the number that is missing and return them in the form of an array.
> Constraints: - 2 <= nums.length <= 10^4 - 1 <= nums[i] <= 10^4

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
