# 2666. Allow One Function Call (?) (<https://leetcode.com/problems/allow-one-function-call>)

<!-- [[leetcode/untagged]] [[leetcode/untagged/2665-counter2]] [[leetcode/untagged/2677-chunk-array]] -->

> Дана функция fn, верните новую функцию, идентичную исходной, но гарантирующую, что fn будет вызвана не более одного раза.
> При первом вызове возвращённой функции она должна вернуть тот же результат, что и fn.
> При каждом последующем вызове она должна возвращать undefined.

```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue }
type OnceFn = (...args: JSONValue[]) => JSONValue | undefined

function once(fn: Function): OnceFn {
  let called = false

  return function (...args: JSONValue[]): JSONValue | undefined {
    if (called) return undefined

    called = true
    return fn(...args)
  }
}
```

```md
Example 1:

Input: fn = (a,b,c) => (a + b + c), calls = [[1,2,3],[2,3,6]]
  Output: [{"calls":1,"value":6}]
  Explanation:
  const onceFn = once(fn);
  onceFn(1, 2, 3); // 6
  onceFn(2, 3, 6); // undefined, fn was not called

Example 2:

Input: fn = (a,b,c) => (a * b * c), calls = [[5,7,4],[2,3,6],[4,6,8]]
  Output: [{"calls":1,"value":140}]
  Explanation:
  const onceFn = once(fn);
  onceFn(5, 7, 4); // 140
  onceFn(2, 3, 6); // undefined, fn was not called
  onceFn(4, 6, 8); // undefined, fn was not called
```

#leetcode
