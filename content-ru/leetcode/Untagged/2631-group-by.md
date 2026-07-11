# 2631. Group By (Medium) (<https://leetcode.com/problems/group-by/>)

> Напишите код, расширяющий все массивы так, чтобы можно было вызвать метод array.groupBy(fn) на любом массиве, и он вернёт сгруппированную версию массива.
> Сгруппированный массив — это объект, где каждый ключ — результат fn(arr[i]), а каждое значение — массив, содержащий все элементы исходного массива, которые дают этот ключ.
> Переданный колбэк fn принимает элемент массива и возвращает строковый ключ.
> Порядок элементов в каждом списке значений должен совпадать с порядком их появления в массиве.
> Порядок ключей может быть любым.
> Решите без использования функции _.groupBy из lodash.
> Ограничения: 0 <= array.length <= 10^5 fn возвращает строку

```ts
const result: Record<string, T[]> = {}

  for (const item of this) {
    const key = fn(item)

    if (key in result) {
      result[key].push(item)
    }
    else {
      result[key] = [item]
    }
  }

  return result
}

// Local check:
console.log([{ id: '1' }, { id: '1' }, { id: '2' }].groupBy(item => item.id))
console.log([[1, 2, 3], [1, 3, 5], [1, 5, 9]].groupBy(list => String(list[0])))
console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].groupBy(n => String(n > 5)))
```

```md
Example 1:

    Input:
    array = [
      {"id":"1"},
      {"id":"1"},
      {"id":"2"}
    ],
    fn = function (item) {
      return item.id;
    }
    Output:
    {
      "1": [{"id": "1"}, {"id": "1"}],
      "2": [{"id": "2"}]
    }
    Explanation:
    Output is from array.groupBy(fn).
    The selector function gets the "id" out of each item in the array.
    There are two objects with an "id" of 1. Both of those objects are put in
    the first array. There is one object with an "id" of 2. That object is put
    in the second array.

Example 2:

    Input:
    array = [
      [1, 2, 3],
      [1, 3, 5],

<!-- [[leetcode/untagged]] [[leetcode/untagged/2629-function-composition]] [[leetcode/untagged/2637-promise-time-limit]] -->

      [1, 5, 9]
    ]
    fn = function (list) {
      return String(list[0]);
    }
    Output:
    {
      "1": [[1, 2, 3], [1, 3, 5], [1, 5, 9]]
    }
    Explanation:
    The array can be of any type. In this case, the selector function defines
    the key as being the first element in the array. All the arrays have 1 as
    their first element so they are grouped together.

Example 3:

    Input:
    array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    fn = function (n) {
      return String(n > 5);
    }
    Output:
    {
      "true": [6, 7, 8, 9, 10],
      "false": [1, 2, 3, 4, 5]
    }
    Explanation:
    The selector function splits the array by whether each number is greater than 5.
```

#leetcode
