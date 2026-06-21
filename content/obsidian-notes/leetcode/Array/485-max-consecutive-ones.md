# 485. Max Consecutive Ones (Easy) (<https://leetcode.com/problems/max-consecutive-ones/>)

> Given a binary array nums, return the maximum number of consecutive 1's in the array.
> Constraints: 1 <= nums.length <= 10^5 nums[i] is either 0 or 1.

```ts
function findMaxConsecutiveOnes(nums: number[]): number {
  let cnt = 0
  let maxCnt = 0
  for (const n of nums) {
    if (n === 1) {
      cnt += 1
      if (cnt > maxCnt)
        maxCnt = cnt
    }
    else {
      cnt = 0
    }
  }
  return maxCnt
}

// Local check:
console.log(findMaxConsecutiveOnes([1, 1, 0, 1, 1, 1]))
console.log(findMaxConsecutiveOnes([1, 0, 1, 1, 0, 1]))
```

```md
Example 1:

    Input: nums = [1,1,0,1,1,1]
    Output: 3
    Explanation: The first two digits or the last three digits are consecutive 1s.
    The maximum number of consecutive 1s is 3.

  Example 2:

    Input: nums = [1,0,1,1,0,1]
    Output: 2
```
