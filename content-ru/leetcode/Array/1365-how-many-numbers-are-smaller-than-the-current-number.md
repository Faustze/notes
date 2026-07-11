# 1365. How Many Numbers Are Smaller Than the Current Number (Easy) (<https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number>)

> Дан массив nums; для каждого nums[i] нужно найти, сколько чисел в массиве меньше него.
> То есть для каждого nums[i] нужно посчитать количество валидных j, таких что j != i и nums[j] < nums[i].
> Верните ответ в виде массива.
> Ограничения: - 2 <= nums.length <= 500 - 0 <= nums[i] <= 100

```ts
function smallerNumbersThanCurrent(nums: number[]): number[] {
  const sorted = [...nums].sort((a, b) => a - b)
  const firstIndex = new Map<number, number>()

  for (let i = 0; i < sorted.length; i++) {
    if (!firstIndex.has(sorted[i])) {
      firstIndex.set(sorted[i], i)
    }
  }

  return nums.map(n => firstIndex.get(n)!)
}

// Local check:
console.log(smallerNumbersThanCurrent([8, 1, 2, 2, 3]))
console.log(smallerNumbersThanCurrent([6, 5, 4, 8]))
console.log(smallerNumbersThanCurrent([7, 7, 7, 7]))
```

```md
Example 1:

    Input: nums = [8,1,2,2,3]
    Output: [4,0,1,1,3]
    Explanation:
      For nums[0]=8 there exist four smaller numbers than it (1, 2, 2 and 3).
      For nums[1]=1 does not exist any smaller number than it.
      For nums[2]=2 there exist one smaller number than it (1).
      For nums[3]=2 there exist one smaller number than it (1).
      For nums[4]=3 there exist three smaller numbers than it (1, 2 and 2).

  Example 2:

    Input: nums = [6,5,4,8]
    Output: [2,1,0,3]

  Example 3:

    Input: nums = [7,7,7,7]
    Output: [0,0,0,0]
```

[[leetcode/Array/1431-kids-with-the-greatest-number-of-candies]]
#leetcode
