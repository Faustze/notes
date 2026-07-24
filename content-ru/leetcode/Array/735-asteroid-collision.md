# 735. Столкновение астероидов (Medium) (<https://leetcode.com/problems/asteroid-collision/>)

> Нам дан массив astероids, содержащий целые числа, представляющие астероиды в ряд.
> Индексы астероида в массиве представляют их относительное положение в пространстве.
> Для каждого астероида абсолютное значение представляет его размер, а знак — направление (положительное означает вправо, отрицательное — влево).
> Все астероиды двигаются с одинаковой скоростью.
> Определите состояние астероидов после всех столкновений.
> Если два астероида встречаются, меньший взрывается.
> Если оба одинакового размера, взрываются оба.
> Два астероида, движущихся в одном направлении, никогда не встретятся.
> Ограничения: - 2 <= asteroids.length <= 10^4 - -1000 <= asteroids[i] <= 1000 - asteroids[i] != 0

```ts
function asteroidCollision(asteroids: number[]): number[] {
  const stack: number[] = []

  for (let i = 0; i < asteroids.length; i++) {
    const curr = asteroids[i]
    if (stack.length === 0 || (stack.at(-1)! > 0 && curr > 0)) {
      stack.push(curr)
      continue
    }

    if (stack.at(-1)! < 0 && curr > 0) {
      stack.push(curr)
      continue
    }

    let currAlive = true
    while (stack.at(-1)! > 0 && curr < 0) {
      if (Math.abs(curr) > Math.abs(stack.at(-1)!)) {
        stack.pop()
      } else if (Math.abs(curr) < Math.abs(stack.at(-1)!)) {
        currAlive = false
        break
      } else {
        currAlive = false
        stack.pop()
        break
      }
    }

    if (currAlive) {
      stack.push(curr)
    }
  }

  return stack
}

// Локальная проверка:
console.log(asteroidCollision([10, -2]))
console.log(asteroidCollision([5, 10, -5]))
console.log(asteroidCollision([8, -8]))
console.log(asteroidCollision([10, 2, -5]))
console.log(asteroidCollision([3, 5, -6, 2, -1, 4]))
```

```md
Пример 1:

    Вход: asteroids = [5,10,-5]
    Выход: [5,10]
    Объяснение: 10 и -5 сталкиваются, в результате остаётся 10. 5 и 10 никогда не сталкиваются.

Пример 2:

    Вход: asteroids = [8,-8]
    Выход: []
    Объяснение: 8 и -8 сталкиваются, взрывая друг друга.

Пример 3:

    Вход: asteroids = [10,2,-5]
    Выход: [10]
    Объяснение: 2 и -5 сталкиваются, в результате остаётся -5. 10 и -5 сталкиваются, в результате остаётся 10.

Пример 4:

    Вход: asteroids = [3,5,-6,2,-1,4]
    Выход: [-6,2,4]
    Объяснение: астероид -6 взрывает астероиды 3 и 5, а затем продолжает лететь влево.
    С другой стороны, астероид 2 уничтожает -1. Поскольку 2 и 4 оба движутся вправо, они никогда не сталкиваются.
```

#leetcode
