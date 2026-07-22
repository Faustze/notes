# 238. Product of Array Except Self (Medium) (<https://leetcode.com/problems/product-of-array-except-self/>)

> Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].
> The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.
> You must write an algorithm that runs in O(n) time and without using the division operation.
> Constraints: - 2 <= nums.length <= 10^5 - -30 <= nums[i] <= 30 - The input is generated such that answer[i] is guaranteed to fit in a 32-bit integer.
> Follow up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)

```ts
function productExceptSelf(nums: number[]): number[] {
  let leftProduct = 1,
    rightProduct = 1;
  const answer: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    answer.push(leftProduct);
    leftProduct *= nums[i];
  }

  for (let i = nums.length - 1; i > -1; i--) {
    answer[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return answer;
}

// Local check:
console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // [0, 0, 9, 0, 0]
```

```md
Example 1:
    Input: nums = [1,2,3,4]
    Output: [24,12,8,6]
    Explanation:
    - answer[0] = 2 * 3 * 4 = 24
    - answer[1] = 1 * 3 * 4 = 12
    - answer[2] = 1 * 2 * 4 = 8
    - answer[3] = 1 * 2 * 3 = 6

  Example 2:
    Input: nums = [-1,1,0,-3,3]
    Output: [0,0,9,0,0]
    Explanation:
    - answer[0] = 1 * 0 * -3 * 3 = 0
    - answer[1] = -1 * 0 * -3 * 3 = 0
    - answer[2] = -1 * 1 * -3 * 3 = 9
    - answer[3] = -1 * 1 * 0 * 3 = 0
    - answer[4] = -1 * 1 * 0 * -3 = 0
```

#leetcode
