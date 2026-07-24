# 2629. Композиция функций (Лёгкая) (<https://leetcode.com/problems/function-composition/>)

> Дан массив функций [f1, f2, f3, ..., fn], верните новую функцию fn, которая является композицией функций из массива.
> Композиция функций [f(x), g(x), h(x)] — это fn(x) = f(g(h(x))).
> Композиция пустого списка функций — это тождественная функция f(x) = x.
> Можно считать, что каждая функция в массиве принимает одно целое число и возвращает одно целое число.
> Ограничения: - -1000 <= x <= 1000 - 0 <= functions.length <= 1000 - все функции принимают и возвращают одно целое число

```ts
type Fn = (x: number) => number

function compose(functions: Fn[]): Fn {
  return function (x) {
    return functions.reduceRight((acc, fn) => fn(acc), x)
  }
}

const fn = compose([(x) => x + 1, (x) => 2 * x])
console.log(fn(4)) // 9
```

```md
Example 1:

    Input:
    functions = [x => x + 1, x => x * x, x => 2 * x]
    x = 4
    Output: 65
    Explanation:
    Evaluating from right to left ...
    Starting with x = 4.
    2 * 4 = 8
    8 * 8 = 64
    64 + 1 = 65

Example 2:

    Input:
    functions = [x => 10 * x, x => 10 * x, x => 10 * x]
    x = 1
    Output: 1000
    Explanation:
    Evaluating from right to left ...
    10 * 1 = 10

<!-- [[leetcode/untagged]] [[leetcode/untagged/2627-debounce]] [[leetcode/untagged/2631-group-by]] -->

    10 * 10 = 100
    10 * 100 = 1000

Example 3:

    Input:
    functions = []
    x = 42
    Output: 42
    Explanation:
    The composition of zero functions is the identity function.
```

#leetcode
