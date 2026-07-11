# 268. Missing Number (Easy) (<https://leetcode.com/problems/missing-number/>)


> Дан массив nums, содержащий n различных чисел из диапазона [0, n], верните единственное число из диапазона, отсутствующее в массиве.

> Ограничения: n == nums.length 1 <= n <= 10^4 0 <= nums[i] <= n Все числа в nums уникальны.

> Дополнительно: сможете ли вы реализовать решение с O(1) дополнительной памяти и O(n) временем выполнения?

```ts
function missingNumber(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, num) => acc + num, 0);
  return expectedSum - actualSum;
}

// Local check:
console.log(missingNumber([3, 0, 1]));
console.log(missingNumber([0, 1]));
console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]));
```

```md
Example 1:
    Input: nums = [3,0,1]
    Output: 2
    Explanation: n = 3 since there are 3 numbers, so all numbers are in the range [0,3].
    2 is the missing number in the range since it does not appear in nums.

  Example 2:
    Input: nums = [0,1]
    Output: 2
    Explanation: n = 2 since there are 2 numbers, so all numbers are in the range [0,2].
    2 is the missing number in the range since it does not appear in nums.

  Example 3:
    Input: nums = [9,6,4,2,3,5,7,0,1]
    Output: 8
    Explanation: n = 9 since there are 9 numbers, so all numbers are in the range [0,9].
    8 is the missing number in the range since it does not appear in nums.
```

[[leetcode/Array/150-evaluate-reverse-polish-notation]]
[[leetcode/Array/283-move-zeroes]]
[[leetcode/Array/217-contains-duplicate|217 — то же set-семейство]]
#leetcode
