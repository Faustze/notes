# 2626. Массив: трансформация с помощью Reduce (Easy) (<https://leetcode.com/problems/array-reduce-transformation/>)

> Дан массив целых чисел nums, функция-редьюсер fn и начальное значение init. Верните итоговый результат, полученный выполнением функции fn для каждого элемента массива последовательно, передавая при этом возвращаемое значение вычисления для предыдущего элемента.
> Этот результат достигается следующими операциями: val = fn(init, nums[0]), val = fn(val, nums[1]), val = fn(val, nums[2]), ...
> пока не будут обработаны все элементы массива.
> Если длина массива равна 0, функция должна вернуть init.
> Решите задачу, не используя встроенный метод Array.reduce.
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

// Локальная проверка:
console.log(reduce([1, 2, 3, 4], (accum, curr) => accum + curr, 0)) // 10
console.log(reduce([1, 2, 3, 4], (accum, curr) => accum + curr * curr, 100)) // 130
console.log(reduce([], () => 0, 25)) // 25
```

```md
Пример 1:

    Вход:
    nums = [1,2,3,4]
    fn = function sum(accum, curr) { return accum + curr; }
    init = 0
    Выход: 10
    Объяснение:
    изначально значение init=0.
    (0) + nums[0] = 1
    (1) + nums[1] = 3
    (3) + nums[2] = 6
    (6) + nums[3] = 10
    Итоговый ответ — 10.

Пример 2:

    Вход:
    nums = [1,2,3,4]
    fn = function sum(accum, curr) { return accum + curr * curr; }
    init = 100
    Выход: 130
    Объяснение:
    изначально значение init=100.
    (100) + nums[0] * nums[0] = 101
    (101) + nums[1] * nums[1] = 105
    (105) + nums[2] * nums[2] = 114
    (114) + nums[3] * nums[3] = 130

<!-- [[leetcode/untagged]] [[leetcode/untagged/2623-memoize]] [[leetcode/untagged/2627-debounce]] -->

    Итоговый ответ — 130.

Пример 3:

    Вход:
    nums = []
    fn = function sum(accum, curr) { return 0; }
    init = 25
    Выход: 25
    Объяснение:
    Для пустых массивов ответ всегда равен init.
```

#leetcode
