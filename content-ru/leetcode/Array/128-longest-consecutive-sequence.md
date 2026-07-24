# 128. Longest Consecutive Sequence (?) (<https://leetcode.com/problems/longest-consecutive-sequence/>)

> 128.
> Longest Consecutive Sequence (https://leetcode.com/problems/longest-consecutive-sequence/) Дан неотсортированный массив целых чисел nums, верните длину самой длинной последовательности идущих подряд элементов.
> Необходимо написать алгоритм, работающий за O(n).

```ts
function longestConsecutive(nums: number[]): number {
  let maxCnt = 0, cnt = 1
  const st = new Set<number>(nums)

  for (let i = 0; i < nums.length; i++) {
    if (st.has(nums[i] - 1)) continue
    for (let j = 1; j < nums.length + 1; j++) {
      // является ли число началом последовательности?
      if (st.has(nums[i] + j)) {
        cnt += 1
      } else {
        break
      }
    }
    maxCnt = cnt > maxCnt ? cnt : maxCnt
    cnt = 1
  }
  return maxCnt
};

// O(n^2) brute force
// function longestConsecutive(nums: number[]): number {
//   let maxCnt = 0,
//     cnt = 1
//   for (let i = 0; i < nums.length; i++) {
//     for (let j = 1; j < nums.length - 1; j++) {
//       if (nums.includes(nums[i] + j)) {
//         cnt += 1
//       } else {
//         break
//       }
//     }
//     maxCnt = cnt > maxCnt ? cnt : maxCnt
//     cnt = 1
//   }
//   return maxCnt
// };

// Local check:
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])) // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])) // 9
console.log(longestConsecutive([1, 0, 1, 2])) // 3
```

```md
Example 1:

    Input: nums = [100,4,200,1,3,2]
    Output: 4
    Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.

  Example 2:

    Input: nums = [0,3,7,2,5,8,4,6,0,1]
    Output: 9

  Example 3:
    Input: nums = [1,0,1,2]
    Output: 3
```

#leetcode
