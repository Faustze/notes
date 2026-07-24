# 2721. Выполнение асинхронных функций параллельно (Medium) (<https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/>)

> Дан массив асинхронных функций functions, верните новый promise.
> Каждая функция в массиве не принимает аргументов и возвращает promise.
> Все promise'ы должны выполняться параллельно.
> Promise разрешается: - когда все promise'ы, возвращённые из functions, успешно разрешились.
>
> - Разрешённое значение должно быть массивом всех разрешённых значений в том же порядке, в каком они были в functions.
> - Он должен разрешаться, когда все асинхронные функции завершили выполнение параллельно.
>   Promise отклоняется: - когда любой promise, возвращённый из functions, был отклонён.
> - Он должен отклоняться с причиной первого отклонения.
>   Пожалуйста, решите без использования встроенной функции Promise.all.
>   Ограничения: - functions — массив функций, возвращающих promise'ы - 1 <= functions.length <= 10

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
Пример 1:

    Ввод:
    functions = [
      () => new Promise(resolve => setTimeout(() => resolve(5), 200))
    ]
    Вывод: {"t": 200, "resolved": [5]}

<!-- [[leetcode/untagged]] [[leetcode/untagged/2715-timeout-cancellation]] [[leetcode/untagged/2723-add-two-promises]] -->

    Объяснение:
    promiseAll(functions).then(console.log) // [5]
    Единственная функция разрешилась на 200мс со значением 5.

Пример 2:

    Ввод:
    functions = [
      () => new Promise(resolve => setTimeout(() => resolve(1), 200)),
      () => new Promise((resolve, reject) => setTimeout(() => reject("Error"), 100))
    ]
    Вывод: {"t": 100, "rejected": "Error"}
    Объяснение:
    Поскольку один из promise'ов отклонился, возвращённый promise также
    отклонился с той же ошибкой в то же время.

Пример 3:

    Ввод:
    functions = [
      () => new Promise(resolve => setTimeout(() => resolve(4), 50)),
      () => new Promise(resolve => setTimeout(() => resolve(10), 150)),
      () => new Promise(resolve => setTimeout(() => resolve(16), 100))
    ]
    Вывод: {"t": 150, "resolved": [4, 10, 16]}
    Объяснение:
    Все promise'ы разрешились со значением. Возвращённый promise разрешился,
    когда разрешился последний promise.
```

#leetcode
