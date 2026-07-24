# 1431. Kids With the Greatest Number of Candies (Easy) (<https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/>)

> Есть n детей с конфетами.
> Вам дан целочисленный массив candies, где candies[i] обозначает количество конфет у i-го ребёнка, и целое число extraCandies, обозначающее количество дополнительных конфет, которые у вас есть.
> Верните булев массив result длины n, где result[i] равно true, если после того, как i-му ребёнку отдадут все extraCandies, у него будет наибольшее количество конфет среди всех детей, или false в противном случае.
> Обратите внимание, что несколько детей могут иметь наибольшее количество конфет.
> Ограничения: n == candies.length 2 <= n <= 100 1 <= candies[i] <= 100 1 <= extraCandies <= 50

```ts
function kidsWithCandies(candies: number[], extraCandies: number): boolean[] {
  const max = Math.max(...candies)
  return candies.map((candy) => candy + extraCandies >= max)
}

// function kidsWithCandies(candies: number[], extraCandies: number): boolean[] {
//   const sortedCandies = [...candies].sort((a, b) => a - b)
//   const max = sortedCandies.at(-1)!
//   const result: boolean[] = []
//   for (let i = 0; i < candies.length; i++) {
//     if (candies[i] + extraCandies >= max) {
//       result.push(true)
//     }
//     else {
//       result.push(false)
//     }
//   }
//   return result
// }

// Локальная проверка:
console.log(kidsWithCandies([2, 3, 5, 1, 3], 3))
console.log(kidsWithCandies([4, 2, 1, 1, 2], 1))
console.log(kidsWithCandies([12, 1, 12], 10))
console.log(kidsWithCandies([1, 10, 10, 3], 1))
```

```md
Пример 1:

    Вход: candies = [2,3,5,1,3], extraCandies = 3
    Выход: [true,true,true,false,true]
    Объяснение: Если отдать все extraCandies:
      Ребёнку 1, у него будет 2 + 3 = 5 конфет, что является наибольшим числом среди детей.
      Ребёнку 2, у него будет 3 + 3 = 6 конфет, что является наибольшим числом среди детей.
      Ребёнку 3, у него будет 5 + 3 = 8 конфет, что является наибольшим числом среди детей.
      Ребёнку 4, у него будет 1 + 3 = 4 конфеты, что не является наибольшим числом среди детей.
      Ребёнку 5, у него будет 3 + 3 = 6 конфет, что является наибольшим числом среди детей.

Пример 2:

    Вход: candies = [4,2,1,1,2], extraCandies = 1
    Выход: [true,false,false,false,false]

<!-- [[leetcode/array]] [[leetcode/Array/1365-how-many-numbers-are-smaller-than-the-current-number]] [[leetcode/Array/1441-build-an-array-with-stack-operations]] -->

    Объяснение: Есть только 1 дополнительная конфета.
      У ребёнка 1 всегда будет наибольшее количество конфет, даже если
      дополнительную конфету отдать другому ребёнку.

Пример 3:

    Вход: candies = [12,1,12], extraCandies = 10
    Выход: [true,false,true]
```

[[leetcode/Array/1365-how-many-numbers-are-smaller-than-the-current-number]]
[[leetcode/Array/1441-build-an-array-with-stack-operations]]
#leetcode
