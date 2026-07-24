# 238. Произведение массива, кроме самого себя (Medium) (<https://leetcode.com/problems/product-of-array-except-self/>)

> Дан целочисленный массив nums, верните массив answer такой, что answer[i] равен произведению всех элементов nums, кроме nums[i].
> Гарантируется, что произведение любого префикса или суффикса nums помещается в 32-битное целое число.
> Вы должны написать алгоритм, работающий за O(n) и без использования операции деления.
> Ограничения: - 2 <= nums.length <= 10^5 - -30 <= nums[i] <= 30 - Входные данные сгенерированы так, что answer[i] гарантированно помещается в 32-битное целое число.
> Дополнительно: Сможете ли вы решить задачу с O(1) дополнительной памяти? (Выходной массив не учитывается при анализе сложности по памяти.)

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
