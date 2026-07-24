# 2724. Сортировка по (Easy) (<https://leetcode.com/problems/sort-by/>)

<!-- [[leetcode/untagged]] [[leetcode/untagged/2723-add-two-promises]] [[leetcode/untagged/2725-interval-cancellation]] -->
> Дан массив arr и функция fn, верните отсортированный массив sortedArr.
> Можно считать, что fn возвращает только числа, и эти числа определяют порядок сортировки sortedArr.
> sortedArr должен быть отсортирован по возрастанию значений, возвращаемых fn.
> Можно считать, что fn никогда не вернёт одинаковые числа для разных элементов массива.
> Ограничения: - arr — валидный JSON-массив - fn — функция, возвращающая число - 1 <= arr.length <= 5 * 10^5

```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue }
type Fn = (value: JSONValue) => number

function sortBy(arr: JSONValue[], fn: Fn): JSONValue[] {
  arr.sort((a, b) => fn(a) - fn(b))
  return arr
}

// Local check:
console.log(sortBy([5, 4, 1, 2, 3], x => x as number)) // [1, 2, 3, 4, 5]
console.log(sortBy([{ x: 1 }, { x: 0 }, { x: -1 }], d => (d as { x: number }).x)) // [{ x: -1 }, { x: 0 }, { x: 1 }]
console.log(sortBy([[3, 4], [5, 2], [10, 1]], x => (x as number[])[1])) // [[10, 1], [5, 2], [3, 4]]
```

```md
Пример 1:

    Вход: arr = [5, 4, 1, 2, 3], fn = (x) => x
    Выход: [1, 2, 3, 4, 5]
    Объяснение:
    fn просто возвращает переданное ей число, поэтому массив сортируется по возрастанию.

  Пример 2:

    Вход: arr = [{"x": 1}, {"x": 0}, {"x": -1}], fn = (d) => d.x
    Выход: [{"x": -1}, {"x": 0}, {"x": 1}]
    Объяснение:
    fn возвращает значение ключа "x". Поэтому массив сортируется по этому значению.

  Пример 3:

    Вход: arr = [[3, 4], [5, 2], [10, 1]], fn = (x) => x[1]
    Выход: [[10, 1], [5, 2], [3, 4]]
    Объяснение:
    arr сортируется по возрастанию значения по индексу=1.
```

#leetcode
