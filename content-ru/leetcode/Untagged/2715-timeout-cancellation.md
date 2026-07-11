# 2715. Timeout Cancellation (Easy) (<https://leetcode.com/problems/timeout-cancellation/>)

> Дана функция fn, массив аргументов args и таймаут t в миллисекундах, верните функцию отмены cancelFn.
> После задержки в cancelTimeMs возвращённая функция отмены cancelFn будет вызвана: setTimeout(cancelFn, cancelTimeMs) Изначально выполнение fn должно быть отложено на t миллисекунд.
> Если cancelFn вызывается до истечения задержки t миллисекунд, она должна отменить отложенное выполнение fn.
> Иначе fn должна быть выполнена с args в качестве аргументов.
> Ограничения: - fn — функция - args — валидный JSON-массив - 1 <= args.length <= 10 - 20 <= t <= 1000 - 10 <= cancelTimeMs <= 1000

```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue }
type Fn = (...args: JSONValue[]) => void

function cancellable(fn: Fn, args: JSONValue[], t: number): Function {
  const timerId = setTimeout(() => fn(...args), t)
  return () => clearTimeout(timerId)
}

const result: any[] = []
const fn = (x: any) => x * 5
const args = [2]
const t = 20
const cancelTimeMs = 50
const start = performance.now()
function log(...argsArr: any[]) {
  const diff = Math.floor(performance.now() - start)
  result.push({ time: diff, returned: fn(...argsArr) })
}
const cancel = cancellable(log, args, t)
const maxT = Math.max(t, cancelTimeMs)
setTimeout(cancel, cancelTimeMs)
setTimeout(() => {
  console.log(result) // [{"time":20,"returned":10}]
}, maxT + 15)
```

```md
Example 1:

    Input: fn = (x) => x * 5, args = [2], t = 20
    Output: [{"time": 20, "returned": 10}]
    Explanation:
    const cancelTimeMs = 50;
    const cancelFn = cancellable((x) => x * 5, [2], 20);
    setTimeout(cancelFn, cancelTimeMs);

    The cancellation was scheduled to occur after a delay of cancelTimeMs (50ms),
    which happened after the execution of fn(2) at 20ms.

Example 2:

    Input: fn = (x) => x**2, args = [2], t = 100
    Output: []
    Explanation:
    const cancelTimeMs = 50;
    const cancelFn = cancellable((x) => x**2, [2], 100);
    setTimeout(cancelFn, cancelTimeMs);

    The cancellation was scheduled to occur after a delay of cancelTimeMs (50ms),
    which happened before the execution of fn(2) at 100ms, resulting in fn(2) never being called.

Example 3:

<!-- [[leetcode/untagged]] [[leetcode/untagged/2703-return-length-of-arguments-passed]] [[leetcode/untagged/2721-execute-asynchronous-functions-in-parallel]] -->

    Input: fn = (x1, x2) => x1 * x2, args = [2,4], t = 30
    Output: [{"time": 30, "returned": 8}]
    Explanation:
    const cancelTimeMs = 100;
    const cancelFn = cancellable((x1, x2) => x1 * x2, [2,4], 30);
    setTimeout(cancelFn, cancelTimeMs);

    The cancellation was scheduled to occur after a delay of cancelTimeMs (100ms),
    which happened after the execution of fn(2,4) at 30ms.
```

#leetcode
