# 2724. Sort By (Easy) (<https://leetcode.com/problems/sort-by/>)

<!-- [[leetcode/untagged]] [[leetcode/untagged/2723-add-two-promises]] [[leetcode/untagged/2725-interval-cancellation]] -->

> Дан массив arr и функция fn, верните отсортированный массив sortedArr.
> Можно считать, что fn возвращает только числа, и эти числа определяют порядок сортировки sortedArr.
> sortedArr должен быть отсортирован по возрастанию значений fn.
> Можно считать, что fn никогда не вернёт одинаковые числа для разных элементов заданного массива.
> Ограничения: - arr — валидный JSON-массив - fn — функция, возвращающая число - 1 <= arr.length <= 5 * 10^5

```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue }
type Fn = (value: JSONValue) => number

function sortBy(arr: JSONValue[], fn: Fn): JSONValue[] {
  arr.sort((a, b) => fn(a) - fn(b))
  return arr
}

// Local check:
console.log(sortBy([5, 4, 1, 2, 3], (x) => x as number)) // [1, 2, 3, 4, 5]
console.log(sortBy([{ x: 1 }, { x: 0 }, { x: -1 }], (d) => (d as { x: number }).x)) // [{ x: -1 }, { x: 0 }, { x: 1 }]
console.log(
  sortBy(
    [
      [3, 4],
      [5, 2],
      [10, 1],
    ],
    (x) => (x as number[])[1],
  ),
) // [[10, 1], [5, 2], [3, 4]]
```

```md
Example 1:

    Input: arr = [5, 4, 1, 2, 3], fn = (x) => x
    Output: [1, 2, 3, 4, 5]
    Explanation:
    fn simply returns the number passed to it so the array is sorted in ascending order.

Example 2:

    Input: arr = [{"x": 1}, {"x": 0}, {"x": -1}], fn = (d) => d.x
    Output: [{"x": -1}, {"x": 0}, {"x": 1}]
    Explanation:
    fn returns the value for the "x" key. So the array is sorted based on that value.

Example 3:

    Input: arr = [[3, 4], [5, 2], [10, 1]], fn = (x) => x[1]
    Output: [[10, 1], [5, 2], [3, 4]]
    Explanation:
    arr is sorted in ascending order by number at index=1.
```

#leetcode
