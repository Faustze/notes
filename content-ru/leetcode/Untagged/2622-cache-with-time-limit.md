# 2622. Cache With Time Limit (Medium) (<https://leetcode.com/problems/cache-with-time-limit/>)

> Напишите класс, позволяющий получать и устанавливать пары ключ-значение, при этом с каждым ключом связано время до истечения срока действия.
> У класса есть три публичных метода: set(key, value, duration): принимает целочисленный ключ key, целочисленное значение value и длительность duration в миллисекундах.
> После истечения duration ключ должен стать недоступным.
> Метод должен вернуть true, если такой же неистёкший ключ уже существует, иначе false.
> Если ключ уже существует, и значение, и длительность должны быть перезаписаны.
> get(key): если неистёкший ключ существует, метод должен вернуть связанное значение.
> Иначе он должен вернуть -1.
> count(): возвращает количество неистёкших ключей.
> Ограничения: - 0 <= key, value <= 10^9 - 0 <= duration <= 1000 - 1 <= actions.length <= 100 - actions.length === values.length - actions.length === timeDelays.length - 0 <= timeDelays[i] <= 1450 - actions[i] — одно из "TimeLimitedCache", "set", "get", "count" - Первое действие всегда "TimeLimitedCache" и должно выполниться немедленно

```ts
class TimeLimitedCache {
  cache: Map<number, { value: number, timerId: ReturnType<typeof setTimeout> }>

  constructor() {
    this.cache = new Map()
  }

  set(key: number, value: number, duration: number): boolean {
    const exist = this.cache.get(key)

    if (exist) {
      clearTimeout(exist.timerId)
    }

    const timerId = setTimeout(() => {
      this.cache.delete(key)
    }, duration)
    this.cache.set(key, { value, timerId })
    return !!exist
  }

  get(key: number): number {
    return this.cache.get(key)?.value ?? -1
  }

  count(): number {
    return this.cache.size
  }
}
```

```md
Example 1:

    Input:
    actions = ["TimeLimitedCache", "set", "get", "count", "get"]
    values = [[], [1, 42, 100], [1], [], [1]]
    timeDelays = [0, 0, 50, 50, 150]
    Output: [null, false, 42, 1, -1]
    Explanation:
    At t=0, the cache is constructed.
    At t=0, a key-value pair (1: 42) is added with a time limit of 100ms.
    The value doesn't exist so false is returned.
    At t=50, key=1 is requested and the value of 42 is returned.
    At t=50, count() is called and there is one active key in the cache.
    At t=100, key=1 expires.
    At t=150, get(1) is called but -1 is returned because the cache is empty.

  Example 2:

    Input:
    actions = ["TimeLimitedCache", "set", "set", "get", "get", "get", "count"]
    values = [[], [1, 42, 50], [1, 50, 100], [1], [1], [1], []]
    timeDelays = [0, 0, 40, 50, 120, 200, 250]
    Output: [null, false, true, 50, 50, -1, 0]
    Explanation:
    At t=0, the cache is constructed.
    At t=0, a key-value pair (1: 42) is added with a time limit of 50ms.
    The value doesn't exist so false is returned.

<!-- [[leetcode/untagged]] [[leetcode/untagged/2620-counter]] [[leetcode/untagged/2623-memoize]] -->
    At t=40, a key-value pair (1: 50) is added with a time limit of 100ms.
    A non-expired value already existed so true is returned and the old value
    was overwritten.
    At t=50, get(1) is called which returned 50.
    At t=120, get(1) is called which returned 50.
    At t=140, key=1 expires.
    At t=200, get(1) is called but the cache is empty so -1 is returned.
    At t=250, count() returns 0 because the cache is empty.
```
#leetcode
