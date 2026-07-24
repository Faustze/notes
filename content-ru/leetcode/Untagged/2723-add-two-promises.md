# 2723. Add Two Promises (Easy) (<https://leetcode.com/problems/add-two-promises/>)

<!-- [[leetcode/untagged]] [[leetcode/untagged/2721-execute-asynchronous-functions-in-parallel]] [[leetcode/untagged/2724-sort-by]] -->

> Даны два промиса promise1 и promise2, верните новый промис.
> promise1 и promise2 оба разрешатся числом.
> Возвращаемый промис должен разрешиться суммой двух чисел.
> Ограничения: - promise1 и promise2 — промисы, разрешающиеся числом

```ts
async function addTwoPromises(
  promise1: Promise<number>,
  promise2: Promise<number>,
): Promise<number> {
  return Promise.all([promise1, promise2]).then(([result1, result2]) => result1 + result2)
}

addTwoPromises(Promise.resolve(2), Promise.resolve(2)).then(console.log) // 4

addTwoPromises(Promise.resolve(2), Promise.resolve(5)).then(console.log) // 7

addTwoPromises(Promise.resolve(10), Promise.resolve(-12)).then(console.log) // -2
```

```md
Пример 1:

    Ввод:
    promise1 = new Promise(resolve => setTimeout(() => resolve(2), 20)),
    promise2 = new Promise(resolve => setTimeout(() => resolve(5), 60))
    Вывод: 7
    Объяснение:
    Два входных промиса разрешаются значениями 2 и 5 соответственно.
    Возвращаемый промис должен разрешиться значением 2 + 5 = 7.
    Время, за которое возвращаемый промис разрешается, в этой задаче не оценивается.

Пример 2:

    Ввод:
    promise1 = new Promise(resolve => setTimeout(() => resolve(10), 50)),
    promise2 = new Promise(resolve => setTimeout(() => resolve(-12), 30))
    Вывод: -2
    Объяснение:
    Два входных промиса разрешаются значениями 10 и -12 соответственно.
    Возвращаемый промис должен разрешиться значением 10 + -12 = -2.
```

#leetcode
