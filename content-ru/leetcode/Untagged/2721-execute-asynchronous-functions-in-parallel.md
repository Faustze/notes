# 2721. Execute Asynchronous Functions in Parallel (Medium) (<https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/>)

> Дан массив асинхронных функций functions, верните новый promise.
> Каждая функция массива не принимает аргументов и возвращает promise.
> Все promise должны выполняться параллельно.
> Итоговый promise резолвится: - Когда все promise, возвращённые functions, были успешно зарезолвены.
>
> - Значением резолва должен быть массив всех зарезолвленных значений в том же порядке, в котором они были в functions.
> - Он должен резолвиться, когда все асинхронные функции завершили выполнение параллельно.
>   Итоговый promise реджектится: - Когда любой из promise, возвращённых functions, был реджекнут.
> - Он должен реджектиться с причиной первого реджекта.
>   Решите без использования встроенной функции Promise.all.
>   Ограничения: - functions — массив функций, возвращающих promise - 1 <= functions.length <= 10

```ts
type Fn<T> = () => Promise<T>

function promiseAll<T>(functions: Fn<T>[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = []
    let completed = 0

    functions.map(async (fn, i) => {
      await fn()
        .then((res) => {
          results[i] = res
          completed++
        })
        .catch((err) => {
          reject(err)
        })

      if (completed === functions.length) resolve(results)
    })
  })
}

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

const promise = promiseAll([() => new Promise((res) => res(42))])
promise.then(console.log)
```

```md
Example 1:

    Input:
    functions = [
      () => new Promise(resolve => setTimeout(() => resolve(5), 200))
    ]
    Output: {"t": 200, "resolved": [5]}

<!-- [[leetcode/untagged]] [[leetcode/untagged/2715-timeout-cancellation]] [[leetcode/untagged/2723-add-two-promises]] -->

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

#leetcode
