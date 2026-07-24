# 704. Двоичный поиск (Лёгкий уровень) (<https://leetcode.com/problems/binary-search/>)

> Дан отсортированный по возрастанию массив целых чисел nums и целое число target, напишите функцию для поиска target в nums.
> Если target существует, верните его индекс.
> В противном случае верните -1.
> Вы должны написать алгоритм со сложностью выполнения O(log n).
> Ограничения: - 1 <= nums.length <= 10^4 - -10^4 < nums[i], target < 10^4 - Все целые числа в nums уникальны.
>
> - nums отсортирован по возрастанию.

```ts
function search(nums: number[], target: number): number {
  let left = 0,
    right = nums.length - 1
  let middle = Math.floor((left + right) / 2)

  while (right >= left) {
    if (target > nums[middle]) {
      left = middle + 1
    } else if (target < nums[middle]) {
      right = middle - 1
    } else {
      return middle
    }
    middle = Math.floor((left + right) / 2)
  }

  return -1
}

// Локальная проверка:
console.log(search([-1, 0, 3, 5, 9, 12], 9)) // 4
console.log(search([-1, 0, 3, 5, 9, 12], 2)) // -1
console.log(search([-1, 0, 3, 5, 9, 12], 12)) // 5
```

```md
Пример 1:

    Ввод: nums = [-1,0,3,5,9,12], target = 9
    Вывод: 4
    Объяснение: 9 существует в nums и его индекс равен 4

Пример 2:

    Ввод: nums = [-1,0,3,5,9,12], target = 2
    Вывод: -1
    Объяснение: 2 не существует в nums, поэтому возвращаем -1
```

#leetcode
