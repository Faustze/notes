# 2715. Отмена таймаута (Easy) (<https://leetcode.com/problems/timeout-cancellation/>)

> Дана функция fn, массив аргументов args и таймаут t в миллисекундах, необходимо вернуть функцию отмены cancelFn.
> После задержки в cancelTimeMs миллисекунд будет вызвана возвращённая функция отмены cancelFn: setTimeout(cancelFn, cancelTimeMs) Изначально выполнение fn должно быть отложено на t миллисекунд.
> Если cancelFn будет вызвана до истечения задержки в t миллисекунд, она должна отменить отложенное выполнение fn.
> В противном случае fn должна быть вызвана с аргументами args.
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
Пример 1:

    Ввод: fn = (x) => x * 5, args = [2], t = 20
    Вывод: [{"time": 20, "returned": 10}]
    Объяснение:
    const cancelTimeMs = 50;
    const cancelFn = cancellable((x) => x * 5, [2], 20);
    setTimeout(cancelFn, cancelTimeMs);

    Отмена была запланирована после задержки cancelTimeMs (50 мс),
    что произошло после выполнения fn(2) в момент 20 мс.

  Пример 2:

    Ввод: fn = (x) => x**2, args = [2], t = 100
    Вывод: []
    Объяснение:
    const cancelTimeMs = 50;
    const cancelFn = cancellable((x) => x**2, [2], 100);
    setTimeout(cancelFn, cancelTimeMs);

    Отмена была запланирована после задержки cancelTimeMs (50 мс),
    что произошло до выполнения fn(2) в момент 100 мс, в результате fn(2) так и не была вызвана.

  Пример 3:

<!-- [[leetcode/untagged]] [[leetcode/untagged/2703-return-length-of-arguments-passed]] [[leetcode/untagged/2721-execute-asynchronous-functions-in-parallel]] -->
    Ввод: fn = (x1, x2) => x1 * x2, args = [2,4], t = 30
    Вывод: [{"time": 30, "returned": 8}]
    Объяснение:
    const cancelTimeMs = 100;
    const cancelFn = cancellable((x1, x2) => x1 * x2, [2,4], 30);
    setTimeout(cancelFn, cancelTimeMs);

    Отмена была запланирована после задержки cancelTimeMs (100 мс),
    что произошло после выполнения fn(2,4) в момент 30 мс.
```

#leetcode
