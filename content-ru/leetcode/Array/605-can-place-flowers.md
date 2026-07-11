# 605. Can Place Flowers (Easy) (<https://leetcode.com/problems/can-place-flowers/>)

> У вас есть длинная клумба, часть участков которой засажена, а часть — нет.
> Однако цветы нельзя сажать на соседних участках.
> Дан целочисленный массив flowerbed из 0 и 1, где 0 означает пустой участок, а 1 — занятый, и целое число n; верните true, если можно посадить n новых цветов на клумбе, не нарушая правило "без соседних цветов", и false в противном случае.
> Ограничения: 1 <= flowerbed.length <= 2 * 10^4 flowerbed[i] равно 0 или 1.
> В flowerbed нет двух соседних цветов.
> 0 <= n <= flowerbed.length

```ts
function canPlaceFlowers(flowerbed: number[], n: number): boolean {
  let cnt = 0

  for (let i = 0; i < flowerbed.length; i++) {
    const left = flowerbed[i - 1] ?? 0
    const right = flowerbed[i + 1] ?? 0

    if (flowerbed[i] === 0 && left === 0 && right === 0) {
      flowerbed[i] = 1
      cnt++
    }
  }

  return cnt >= n
}

// Local check:
console.log(canPlaceFlowers([1, 0, 0, 0, 1], 1))
console.log(canPlaceFlowers([1, 0, 0, 0, 1], 2))
console.log(canPlaceFlowers([1, 0, 0, 0, 0, 1], 2)) // false
console.log(canPlaceFlowers([1, 0, 1, 0, 1, 0, 1], 1)) // false
console.log(canPlaceFlowers([0, 0, 1, 0, 1], 1)) // true
```

```md
Example 1:

    Input: flowerbed = [1,0,0,0,1], n = 1
    Output: true

Example 2:

    Input: flowerbed = [1,0,0,0,1], n = 2
    Output: false
```

[[leetcode/Array/485-max-consecutive-ones]]
[[leetcode/Array/636-exclusive-time-of-functions]]
#leetcode
