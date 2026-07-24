# 2623. Memoize (Medium) (<https://leetcode.com/problems/memoize>)

> Дана функция fn, верните мемоизированную версию этой функции.
> Мемоизированная функция — это функция, которая никогда не будет вызвана дважды с одинаковыми входными данными.
> Вместо этого она будет возвращать закэшированное значение.
> Можно считать, что есть 3 возможные входные функции: sum, fib и factorial.
> sum принимает два целых числа a и b и возвращает a + b.
> Предположим, что если значение уже закэшировано для аргументов (b, a), где a != b, оно не может быть использовано для аргументов (a, b).
> Например, если аргументы (3, 2) и (2, 3), должны быть сделаны два отдельных вызова.
> fib принимает одно целое число n и возвращает 1, если n <= 1, иначе fib(n - 1) + fib(n - 2).
> factorial принимает одно целое число n и возвращает 1, если n <= 1, иначе factorial(n - 1)n.

```ts
type Fn = (...params: number[]) => number

function memoize(fn: Fn): Fn {
  const cache = new Map<string, number>()

  return function (...args) {
    const key = JSON.stringify(args)

    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }

    return cache.get(key)!
  }
}

let callCount = 0
const memoizedFn = memoize((a, b) => {
  callCount += 1
  return a + b
})
console.log(memoizedFn(2, 3)) // 5
console.log(memoizedFn(2, 3)) // 5
console.log(callCount) // 1
```

```md
Example 1:

    Input:
    fnName = "sum"
    actions = ["call","call","getCallCount","call","getCallCount"]
    values = [[2,2],[2,2],[],[1,2],[]]
    Output: [4,4,1,3,2]
    Explanation:
    const sum = (a, b) => a + b;
    const memoizedSum = memoize(sum);
    memoizedSum(2, 2); // "call" - returns 4. sum() was called as (2, 2) was not seen before.
    memoizedSum(2, 2); // "call" - returns 4. However sum() was not called because the same inputs were seen before.
    // "getCallCount" - total call count: 1
    memoizedSum(1, 2); // "call" - returns 3. sum() was called as (1, 2) was not seen before.
    // "getCallCount" - total call count: 2

Example 2:

    Input:
    fnName = "factorial"
    actions = ["call","call","call","getCallCount","call","getCallCount"]
    values = [[2],[3],[2],[],[3],[]]

<!-- [[leetcode/untagged]] [[leetcode/untagged/2622-cache-with-time-limit]] [[leetcode/untagged/2626-array-reduce-transformation]] -->

    Output: [2,6,2,2,6,2]
    Explanation:
    const factorial = (n) => (n <= 1) ? 1 : (nfactorial(n - 1));
    const memoFactorial = memoize(factorial);
    memoFactorial(2); // "call" - returns 2.
    memoFactorial(3); // "call" - returns 6.
    memoFactorial(2); // "call" - returns 2. However factorial was not called because 2 was seen before.
    // "getCallCount" - total call count: 2
    memoFactorial(3); // "call" - returns 6. However factorial was not called because 3 was seen before.
    // "getCallCount" - total call count: 2

Example 3:

    Input:
    fnName = "fib"
    actions = ["call","getCallCount"]
    values = [[5],[]]
    Output: [8,1]
    Explanation:
    fib(5) = 8 // "call"
    // "getCallCount" - total call count: 1
```

#leetcode
