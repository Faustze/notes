# 2725. Отмена интервала (Easy) (<https://leetcode.com/problems/interval-cancellation/>)

> Дана функция fn, массив аргументов args и интервал времени t, нужно вернуть функцию отмены cancelFn.
> После задержки в cancelTimeMs миллисекунд возвращённая функция отмены cancelFn будет вызвана: setTimeout(cancelFn, cancelTimeMs). Функция fn должна быть вызвана с args немедленно, а затем повторно вызываться каждые t миллисекунд, пока в момент времени cancelTimeMs мс не будет вызвана cancelFn.
> Ограничения: - fn — функция - args — валидный JSON-массив - 1 <= args.length <= 10 - 30 <= t <= 100 - 10 <= cancelTimeMs <= 500

```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue }
type Fn = (...args: JSONValue[]) => void

function cancellable(fn: Fn, args: JSONValue[], t: number): Function {
  fn(...args)
  const timeoutId = setInterval(() => fn(...args), t)
  return () => clearInterval(timeoutId)
}

// Локальная проверка
const result: { time: number, returned: JSONValue }[] = []
const fn = (...values: JSONValue[]) => Number(values[0]) * 2
const args: JSONValue[] = [4]
const t = 35
const cancelTimeMs = 190
const start = performance.now()

function log(...argsArr: JSONValue[]) {
  const diff = Math.floor(performance.now() - start)
  result.push({ time: diff, returned: fn(...argsArr) })
}

const cancelFn = cancellable(log, args, t)
setTimeout(cancelFn, cancelTimeMs)
setTimeout(() => console.log(result), cancelTimeMs + t)
```

```md
Пример 1:

    Input: fn = (x) => x * 2, args = [4], t = 35
    Output:
    [
      { "time": 0, "returned": 8 },
      { "time": 35, "returned": 8 },
      { "time": 70, "returned": 8 },
      { "time": 105, "returned": 8 },
      { "time": 140, "returned": 8 },
      { "time": 175, "returned": 8 }
    ]
    Explanation:
    const cancelTimeMs = 190;
    const cancelFn = cancellable((x) => x * 2, [4], 35);
    setTimeout(cancelFn, cancelTimeMs);

    Every 35ms, fn(4) is called. Until t=190ms, then it is cancelled.
    1st fn call is at 0ms. fn(4) returns 8.
    2nd fn call is at 35ms. fn(4) returns 8.
    3rd fn call is at 70ms. fn(4) returns 8.
    4th fn call is at 105ms. fn(4) returns 8.
    5th fn call is at 140ms. fn(4) returns 8.
    6th fn call is at 175ms. fn(4) returns 8.
    Cancelled at 190ms.

  Пример 2:

<!-- [[leetcode/untagged]] [[leetcode/untagged/2724-sort-by]] [[leetcode/untagged/2726-calculator-with-method-chaining]] -->
    Input: fn = (x1, x2) => (x1 * x2), args = [2, 5], t = 30
    Output:
    [
      { "time": 0, "returned": 10 },
      { "time": 30, "returned": 10 },
      { "time": 60, "returned": 10 },
      { "time": 90, "returned": 10 },
      { "time": 120, "returned": 10 },
      { "time": 150, "returned": 10 }
    ]
    Explanation:
    const cancelTimeMs = 165;
    const cancelFn = cancellable((x1, x2) => (x1 * x2), [2, 5], 30);
    setTimeout(cancelFn, cancelTimeMs);

    Every 30ms, fn(2, 5) is called. Until t=165ms, then it is cancelled.
    1st fn call is at 0ms.
    2nd fn call is at 30ms.
    3rd fn call is at 60ms.
    4th fn call is at 90ms.
    5th fn call is at 120ms.
    6th fn call is at 150ms.
    Cancelled at 165ms.

  Пример 3:

    Input: fn = (x1, x2, x3) => (x1 + x2 + x3), args = [5, 1, 3], t = 50
    Output:
    [
      { "time": 0, "returned": 9 },
      { "time": 50, "returned": 9 },
      { "time": 100, "returned": 9 },
      { "time": 150, "returned": 9 }
    ]
    Explanation:
    const cancelTimeMs = 180;
    const cancelFn = cancellable((x1, x2, x3) => (x1 + x2 + x3), [5, 1, 3], 50);
    setTimeout(cancelFn, cancelTimeMs);

    Every 50ms, fn(5, 1, 3) is called. Until t=180ms, then it is cancelled.
    1st fn call is at 0ms.
    2nd fn call is at 50ms.
    3rd fn call is at 100ms.
    4th fn call is at 150ms.
    Cancelled at 180ms.
```

#leetcode
