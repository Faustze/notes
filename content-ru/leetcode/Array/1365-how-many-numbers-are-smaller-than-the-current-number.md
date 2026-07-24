# 1365. Сколько чисел меньше текущего числа (Easy) (<https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number>)

> Дан массив nums, для каждого nums[i] найдите, сколько чисел в массиве меньше него.
> То есть для каждого nums[i] нужно посчитать количество допустимых j, таких что j != i и nums[j] < nums[i].
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

// Локальная проверка:
console.log(smallerNumbersThanCurrent([8, 1, 2, 2, 3]))
console.log(smallerNumbersThanCurrent([6, 5, 4, 8]))
console.log(smallerNumbersThanCurrent([7, 7, 7, 7]))
```

```md
Пример 1:

    Вход: nums = [8,1,2,2,3]
    Выход: [4,0,1,1,3]
    Пояснение:
      Для nums[0]=8 существует четыре числа меньше него (1, 2, 2 и 3).
      Для nums[1]=1 не существует ни одного числа меньше него.
      Для nums[2]=2 существует одно число меньше него (1).
      Для nums[3]=2 существует одно число меньше него (1).
      Для nums[4]=3 существует три числа меньше него (1, 2 и 2).

  Пример 2:

    Вход: nums = [6,5,4,8]
    Выход: [2,1,0,3]

  Пример 3:

    Вход: nums = [7,7,7,7]
    Выход: [0,0,0,0]
```

[[leetcode/Array/1431-kids-with-the-greatest-number-of-candies]]
#leetcode
