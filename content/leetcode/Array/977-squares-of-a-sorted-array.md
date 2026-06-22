# 977. Squares of a Sorted Array (Easy) (<https://leetcode.com/problems/squares-of-a-sorted-array/>)

  >Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.
> Constraints: - 1 <= nums.length <= 10^4 - -10^4 <= nums[i] <= 10^4 - nums is sorted in non-decreasing order.
> Follow up: Squaring each element and sorting the new array is very trivial, could you find an O(n) solution using a different approach?

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