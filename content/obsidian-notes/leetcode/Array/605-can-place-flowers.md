# 605. Can Place Flowers (Easy) (<https://leetcode.com/problems/can-place-flowers/>)

> You have a long flowerbed in which some of the plots are planted, and some are not.
> However, flowers cannot be planted in adjacent plots.
> Given an integer array flowerbed containing 0's and 1's, where 0 means empty and 1 means not empty, and an integer n, return true if n new flowers can be planted in the flowerbed without violating the no-adjacent-flowers rule and false otherwise.
> Constraints: 1 <= flowerbed.length <= 2 * 10^4 flowerbed[i] is 0 or 1.
> There are no two adjacent flowers in flowerbed.
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
