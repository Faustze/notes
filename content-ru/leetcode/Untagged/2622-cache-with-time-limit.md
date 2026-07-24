# 2622. Cache With Time Limit (Medium) (<https://leetcode.com/problems/cache-with-time-limit/>)

> Напишите класс, который позволяет получать и устанавливать пары ключ-значение, при этом с каждым ключом связано время до истечения срока действия.
> Класс имеет три публичных метода: set(key, value, duration): принимает целочисленный ключ, целочисленное значение и продолжительность в миллисекундах.
> По истечении этого времени ключ должен становиться недоступным.
> Метод должен возвращать true, если такой же неистёкший ключ уже существует, и false в противном случае.
> Если ключ уже существует, значение и продолжительность должны быть перезаписаны.
> get(key): если существует неистёкший ключ, метод должен вернуть связанное значение.
> В противном случае должно возвращаться -1.
> count(): возвращает количество неистёкших ключей.
> Ограничения: - 0 <= key, value <= 10^9 - 0 <= duration <= 1000 - 1 <= actions.length <= 100 - actions.length === values.length - actions.length === timeDelays.length - 0 <= timeDelays[i] <= 1450 - actions[i] является одним из "TimeLimitedCache", "set", "get" и "count" - Первое действие всегда "TimeLimitedCache" и должно быть выполнено немедленно

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


const timeLimitedCache = new TimeLimitedCache()
setTimeout(() => console.log(timeLimitedCache.set(1, 42, 50)), 0) // false
setTimeout(() => console.log(timeLimitedCache.set(1, 50, 100)), 40) // true
setTimeout(() => console.log(timeLimitedCache.get(1)), 50) // 50
setTimeout(() => console.log(timeLimitedCache.get(1)), 120)// 50
setTimeout(() => console.log(timeLimitedCache.get(1)), 200) // -1
setTimeout(() => console.log(timeLimitedCache.count()), 250) // 0
```

```md
Пример 1:

    Ввод:
    actions = ["TimeLimitedCache", "set", "get", "count", "get"]
    values = [[], [1, 42, 100], [1], [], [1]]
    timeDelays = [0, 0, 50, 50, 150]
    Вывод: [null, false, 42, 1, -1]
    Объяснение:
    В момент t=0 кэш создаётся.
    В момент t=0 добавляется пара ключ-значение (1: 42) с ограничением по времени 100мс.
    Значение не существует, поэтому возвращается false.
    В момент t=50 запрашивается ключ=1 и возвращается значение 42.
    В момент t=50 вызывается count() и в кэше есть один активный ключ.
    В момент t=100 ключ=1 истекает.
    В момент t=150 вызывается get(1), но возвращается -1, потому что кэш пуст.

  Пример 2:

    Ввод:
    actions = ["TimeLimitedCache", "set", "set", "get", "get", "get", "count"]
    values = [[], [1, 42, 50], [1, 50, 100], [1], [1], [1], []]
    timeDelays = [0, 0, 40, 50, 120, 200, 250]
    Вывод: [null, false, true, 50, 50, -1, 0]
    Объяснение:
    В момент t=0 кэш создаётся.
    В момент t=0 добавляется пара ключ-значение (1: 42) с ограничением по времени 50мс.
    Значение не существует, поэтому возвращается false.
<!-- [[leetcode/untagged]] [[leetcode/untagged/2620-counter]] [[leetcode/untagged/2623-memoize]] -->
    В момент t=40 добавляется пара ключ-значение (1: 50) с ограничением по времени 100мс.
    Неистёкшее значение уже существовало, поэтому возвращается true, а старое значение
    было перезаписано.
    В момент t=50 вызывается get(1), которое вернуло 50.
    В момент t=120 вызывается get(1), которое вернуло 50.
    В момент t=140 ключ=1 истекает.
    В момент t=200 вызывается get(1), но кэш пуст, поэтому возвращается -1.
    В момент t=250 count() возвращает 0, потому что кэш пуст.
```

#leetcode
