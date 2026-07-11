# 1431. Kids With the Greatest Number of Candies (Easy) (<https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/>)

> Есть n детей с конфетами.
> Дан целочисленный массив candies, где candies[i] — количество конфет у i-го ребёнка, и целое число extraCandies — количество дополнительных конфет, которые есть у вас.
> Верните булев массив result длины n, где result[i] равно true, если после того как i-й ребёнок получит все extraCandies, у него будет наибольшее количество конфет среди всех детей, иначе — false.
> Учтите, что наибольшее количество конфет может быть у нескольких детей одновременно.
> Ограничения: n == candies.length 2 <= n <= 100 1 <= candies[i] <= 100 1 <= extraCandies <= 50

```ts
function kidsWithCandies(candies: number[], extraCandies: number): boolean[] {
  const max = Math.max(...candies)
  return candies.map((candy) => candy + extraCandies >= max)
}

// function kidsWithCandies(candies: number[], extraCandies: number): boolean[] {
//   const sortedCandies = [...candies].sort((a, b) => a - b)
//   const max = sortedCandies.at(-1)!
//   const result: boolean[] = []
//   for (let i = 0; i < candies.length; i++) {
//     if (candies[i] + extraCandies >= max) {
//       result.push(true)
//     }
//     else {
//       result.push(false)
//     }
//   }
//   return result
// }

// Local check:
console.log(kidsWithCandies([2, 3, 5, 1, 3], 3))
console.log(kidsWithCandies([4, 2, 1, 1, 2], 1))
console.log(kidsWithCandies([12, 1, 12], 10))
console.log(kidsWithCandies([1, 10, 10, 3], 1))
```

```md
Example 1:

    Input: candies = [2,3,5,1,3], extraCandies = 3
    Output: [true,true,true,false,true]
    Explanation: If you give all extraCandies to:
      Kid 1, they will have 2 + 3 = 5 candies, which is the greatest among the kids.
      Kid 2, they will have 3 + 3 = 6 candies, which is the greatest among the kids.
      Kid 3, they will have 5 + 3 = 8 candies, which is the greatest among the kids.
      Kid 4, they will have 1 + 3 = 4 candies, which is not the greatest among the kids.
      Kid 5, they will have 3 + 3 = 6 candies, which is the greatest among the kids.

Example 2:

    Input: candies = [4,2,1,1,2], extraCandies = 1
    Output: [true,false,false,false,false]

<!-- [[leetcode/array]] [[leetcode/Array/1365-how-many-numbers-are-smaller-than-the-current-number]] [[leetcode/Array/1441-build-an-array-with-stack-operations]] -->

    Explanation: There is only 1 extra candy.
      Kid 1 will always have the greatest number of candies, even if a different
      kid is given the extra candy.

Example 3:

    Input: candies = [12,1,12], extraCandies = 10
    Output: [true,false,true]
```

[[leetcode/Array/1365-how-many-numbers-are-smaller-than-the-current-number]]
[[leetcode/Array/1441-build-an-array-with-stack-operations]]
#leetcode
