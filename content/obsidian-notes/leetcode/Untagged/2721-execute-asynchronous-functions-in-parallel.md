# 2721. Execute Asynchronous Functions in Parallel (Medium) (<https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/>)

> Given an array of asynchronous functions functions, return a new promise.
> Each function in the array accepts no arguments and returns a promise.
> All the promises should be executed in parallel.
> The promise resolves: - When all promises returned from functions were resolved successfully.
> - The resolved value should be an array of all resolved values in the same order as they were in functions.
> - It should resolve when all asynchronous functions have completed execution in parallel.
> The promise rejects: - When any promise returned from functions was rejected.
> - It should reject with the reason of the first rejection.
> Please solve it without using the built-in Promise.all function.
> Constraints: - functions is an array of functions that returns promises - 1 <= functions.length <= 10

```ts
type Fn<T> = () => Promise<T>

function promiseAll<T>(functions: Fn<T>[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = []
    let completed = 0

    functions.map(async (fn, i) => {
      await fn().then((res) => {
        results[i] = res
        completed++
      }).catch((err) => {
        reject(err)
      })

      if (completed === functions.length)
        resolve(results)
    })
  })
};

// for (let i = 0; i < functions.length; i++) {
//   functions[i]()
//     .then((res) => {
//       results[i] = res
//       completed++

//       if (completed === functions.length) {
//         resolve(results)
//       }
//     })
//     .catch((err) => {
//       reject(err)
//     })
// }

const promise = promiseAll([() => new Promise(res => res(42))])
promise.then(console.log)
```

```md
Example 1:

    Input:
    functions = [
      () => new Promise(resolve => setTimeout(() => resolve(5), 200))
    ]
    Output: {"t": 200, "resolved": [5]}
    Explanation:
    promiseAll(functions).then(console.log) // [5]
    The single function was resolved at 200ms with a value of 5.

  Example 2:

    Input:
    functions = [
      () => new Promise(resolve => setTimeout(() => resolve(1), 200)),
      () => new Promise((resolve, reject) => setTimeout(() => reject("Error"), 100))
    ]
    Output: {"t": 100, "rejected": "Error"}
    Explanation:
    Since one of the promises rejected, the returned promise also rejected with
    the same error at the same time.

  Example 3:

    Input:
    functions = [
      () => new Promise(resolve => setTimeout(() => resolve(4), 50)),
      () => new Promise(resolve => setTimeout(() => resolve(10), 150)),
      () => new Promise(resolve => setTimeout(() => resolve(16), 100))
    ]
    Output: {"t": 150, "resolved": [4, 10, 16]}
    Explanation:
    All promises resolved with a value. The returned promise resolved when the
    last promise resolved.
```
