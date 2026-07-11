#lcpatterns/slow-fast-pointer
# 283. Move Zeroes (Easy) (<https://leetcode.com/problems/move-zeroes/>)

> Дан целочисленный массив nums, переместите все нули в конец массива, сохраняя относительный порядок ненулевых элементов.
> Учтите, что делать это нужно на месте, без создания копии массива.
> Ограничения: 1 <= nums.length <= 10^4 -2^31 <= nums[i] <= 2^31 - 1 Дополнительно: сможете ли вы минимизировать количество операций?

```ts
function moveZeroes(nums: number[]): void {
  let left = 0;
  let right = left;
  while (right !== nums.length) {
    if (nums[right] !== 0) {
      if (right !== left) {
        const temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
      }
      right++;
      left++;
    } else {
      right++;
    }
  }
}

// Local check:
console.log(moveZeroes([0, 1, 0, 3, 12]));
console.log(moveZeroes([0]));
console.log(moveZeroes([0, 1, 2, 3, 0]));
```

```md
Example 1:
    Input: nums = [0,1,0,3,12]
    Output: [1,3,12,0,0]
Example 2:
    Input: nums = [0]
    Output: [0]
```

[[leetcode/Array/268-missing-number]]
[[leetcode/Array/448-find-all-numbers-disappeared-in-an-array]]
#leetcode
