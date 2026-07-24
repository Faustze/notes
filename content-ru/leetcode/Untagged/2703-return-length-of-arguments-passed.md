# 2703. Верните количество переданных аргументов (Легко) (<https://leetcode.com/problems/return-length-of-arguments-passed/>)

<!-- [[leetcode/untagged]] [[leetcode/untagged/2693-call-function-with-custom-context]] [[leetcode/untagged/2715-timeout-cancellation]] -->

> Напишите функцию argumentsLength, которая возвращает количество переданных ей аргументов.
> Ограничения: - args является валидным JSON-массивом - 0 <= args.length <= 100

```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue }

function argumentsLength(...args: JSONValue[]): number {
  if (Array.isArray(args)) {
    return args.length
  }
  return 1
}

console.log(argumentsLength(1, 2, 3)) // 3
console.log(argumentsLength(5)) // 1
console.log(argumentsLength({}, null, "3")) // 3
```

```md
Пример 1:

    Ввод: args = [5]
    Вывод: 1
    Объяснение:
    argumentsLength(5); // 1

    В функцию было передано одно значение, поэтому она должна вернуть 1.

Пример 2:

    Ввод: args = [{}, null, "3"]
    Вывод: 3
    Объяснение:
    argumentsLength({}, null, "3"); // 3

    В функцию было передано три значения, поэтому она должна вернуть 3.
```

#leetcode
