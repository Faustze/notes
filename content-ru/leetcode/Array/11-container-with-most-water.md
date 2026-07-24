# 11. Контейнер с наибольшим количеством воды (Medium) (<https://leetcode.com/problems/container-with-most-water/>)

> Дан целочисленный массив height длины n.
> Проведены n вертикальных линий, такие что конечные точки i-й линии — это (i, 0) и (i, height[i]).
> Найдите две линии, которые вместе с осью x образуют контейнер, содержащий максимальное количество воды.
> Верните максимальное количество воды, которое может удержать контейнер.
> Обратите внимание, что наклонять контейнер нельзя.
> Ограничения: - n == height.length - 2 <= n <= 10^5 - 0 <= height[i] <= 10^4

```ts
function maxArea(height: number[]): number {
  let left = 0,
    right = height.length - 1
  let area = 0

  while (left < right) {
    const leftValue = height[left],
      rightValue = height[right]
    area = Math.max(area, Math.min(leftValue, rightValue) * (right - left))

    if (leftValue < rightValue) {
      left++
    } else {
      right--
    }
  }

  return area
}

// Локальная проверка:
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])) // 49
console.log(maxArea([1, 7, 2, 5, 4, 7, 3, 6])) // 36
console.log(maxArea([1, 1])) // 1
console.log(maxArea([2, 2, 2])) // 4
```

```md
Пример 1:

    Ввод: height = [1,8,6,2,5,4,8,3,7]
    Вывод: 49
    Объяснение: Вышеуказанные вертикальные линии представлены массивом [1,8,6,2,5,4,8,3,7].
    В этом случае максимальная площадь воды (синяя область), которую может удержать контейнер, равна 49.

Пример 2:

    Ввод: height = [1,1]
    Вывод: 1
```

#leetcode
