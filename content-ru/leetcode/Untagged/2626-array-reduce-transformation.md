# 2626. Array Reduce Transformation (Easy) (<https://leetcode.com/problems/array-reduce-transformation/>)

> Дан целочисленный массив nums, функция-редьюсер fn и начальное значение init, верните итоговый результат, полученный последовательным выполнением функции fn на каждом элементе массива, передавая на вход возвращённое значение вычисления на предыдущем элементе.
> Результат достигается следующими операциями: val = fn(init, nums[0]), val = fn(val, nums[1]), val = fn(val, nums[2]), ...
> пока не будут обработаны все элементы массива.
> Если длина массива равна 0, функция должна вернуть init.
> Решите без использования встроенного метода Array.reduce.
> Ограничения: - 0 <= nums.length <= 1000 - 0 <= nums[i] <= 1000 - 0 <= init <= 1000

```ts
type Fn = (accum: number, curr: number) => number

function reduce(nums: number[], fn: Fn, init: number): number {
  let acc: number = init
  for (let i = 0; i < nums.length; i++) {
    acc = fn(acc, nums[i])
  }
  return acc
}

// Local check:
console.log(reduce([1, 2, 3, 4], (accum, curr) => accum + curr, 0)) // 10
console.log(reduce([1, 2, 3, 4], (accum, curr) => accum + curr * curr, 100)) // 130
console.log(reduce([], () => 0, 25)) // 25
```

```md
Example 1:

    Input:
    nums = [1,2,3,4]
    fn = function sum(accum, curr) { return accum + curr; }
    init = 0
    Output: 10
    Explanation:
    initially, the value is init=0.
    (0) + nums[0] = 1
    (1) + nums[1] = 3
    (3) + nums[2] = 6
    (6) + nums[3] = 10
    The final answer is 10.

  Example 2:

    Input:
    nums = [1,2,3,4]
    fn = function sum(accum, curr) { return accum + curr * curr; }
    init = 100
    Output: 130
    Explanation:
    initially, the value is init=100.
    (100) + nums[0] * nums[0] = 101
    (101) + nums[1] * nums[1] = 105
    (105) + nums[2] * nums[2] = 114
    (114) + nums[3] * nums[3] = 130

<!-- [[leetcode/untagged]] [[leetcode/untagged/2623-memoize]] [[leetcode/untagged/2627-debounce]] -->
    The final answer is 130.

  Example 3:

    Input:
    nums = []
    fn = function sum(accum, curr) { return 0; }
    init = 25
    Output: 25
    Explanation:
    For empty arrays, the answer is always init.
```
#leetcode
