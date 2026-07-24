# 977. Squares of a Sorted Array (Easy) (<https://leetcode.com/problems/squares-of-a-sorted-array/>)

> Дан массив целых чисел nums, отсортированный по неубыванию. Верните массив квадратов каждого числа, отсортированный по неубыванию.
> Ограничения: - 1 <= nums.length <= 10^4 - -10^4 <= nums[i] <= 10^4 - nums отсортирован по неубыванию.
> Дополнительное задание: возвести каждый элемент в квадрат и отсортировать новый массив — тривиальное решение, сможете ли вы найти решение за O(n), используя другой подход?

```ts
function sortedSquares(nums: number[]): number[] {
  const result: number[] = new Array(nums.length);
  let left = 0;
  let right = nums.length - 1;
  let idx = nums.length - 1;

  while (left <= right) {
    const squaredLeft = nums[left] * nums[left];
    const squaredRight = nums[right] * nums[right];
    if (squaredLeft > squaredRight) {
      result[idx] = squaredLeft;
      left++;
    } else {
      result[idx] = squaredRight;
      right--;
    }
    idx--;
  }

  return result;
}

// Local check:
console.log(sortedSquares([-4, -1, 0, 3, 10]));
console.log(sortedSquares([-7, -3, 2, 3, 11]));
```

```md
Example 1:

    Input: nums = [-4,-1,0,3,10]
    Output: [0,1,9,16,100]
    Explanation: After squaring, the array becomes [16,1,0,9,100].
    After sorting, it becomes [0,1,9,16,100].

  Example 2:

    Input: nums = [-7,-3,2,3,11]
    Output: [4,9,9,49,121]
```

#leetcode
