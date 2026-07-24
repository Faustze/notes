# 448. Find All Numbers Disappeared in an Array (Easy) (<https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array>)

> Дан массив nums из n целых чисел, где nums[i] находится в диапазоне [1, n]. Верните массив всех целых чисел из диапазона [1, n], которые не встречаются в nums.
> Ограничения: - n == nums.length - 1 <= n <= 10^5 - 1 <= nums[i] <= n Дополнительно: сможете ли вы решить задачу без дополнительной памяти и за O(n) времени выполнения? Считайте, что возвращаемый список не учитывается как дополнительная память.

```ts
function findDisappearedNumbers(nums: number[]): number[] {
  const n = nums.length
  const s = new Set<number>()

  // Шаг 1: собираем все уникальные числа из массива
  for (let i = 0; i < n; i++) {
    s.add(nums[i])
  }

  // Шаг 2: перебираем числа от 1 до n
  const result: number[] = []
  for (let i = 1; i <= n; i++) {
    // Шаг 3: если число отсутствует в Set — добавляем в результат
    if (!s.has(i)) {
      result.push(i)
    }
  }

  return result
}

// Local check:
console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1]))
console.log(findDisappearedNumbers([1, 1]))
```

```md
Пример 1:

    Ввод: nums = [4,3,2,7,8,2,3,1]
    Вывод: [5,6]

  Пример 2:

    Ввод: nums = [1,1]
    Вывод: [2]
```

[[leetcode/Array/283-move-zeroes]]
[[leetcode/Array/485-max-consecutive-ones]]
#leetcode
