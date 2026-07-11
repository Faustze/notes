# 2620. Counter (?) (<https://leetcode.com/problems/counter>)

<!-- [[leetcode/untagged]] [[leetcode/untagged/2622-cache-with-time-limit]] -->

> Дано целое число n, верните функцию-счётчик.
> Эта функция-счётчик изначально возвращает n, а затем при каждом следующем вызове возвращает на 1 больше предыдущего значения (n, n + 1, n + 2 и т.д.).

```ts
function createCounter(n: number): () => number {
  return function () {
    return n++
  }
}
```

```md
Example 1:

    Input:
    n = 10
    ["call","call","call"]
    Output: [10,11,12]
    Explanation:
    counter() = 10 // The first time counter() is called, it returns n.
    counter() = 11 // Returns 1 more than the previous time.
    counter() = 12 // Returns 1 more than the previous time.

Example 2:

    Input:
    n = -2
    ["call","call","call","call","call"]
    Output: [-2,-1,0,1,2]
    Explanation: counter() initially returns -2. Then increases after each sebsequent call.
```

#leetcode
