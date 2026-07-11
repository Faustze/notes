# 2629. Function Composition (Easy) (<https://leetcode.com/problems/function-composition/>)

> Дан массив функций [f1, f2, f3, ..., fn], верните новую функцию fn — композицию этого массива функций.
> Композиция [f(x), g(x), h(x)] — это fn(x) = f(g(h(x))).
> Композиция пустого списка функций — это функция-идентичность f(x) = x.
> Можно считать, что каждая функция массива принимает одно целое число на вход и возвращает одно целое число.
> Ограничения: - -1000 <= x <= 1000 - 0 <= functions.length <= 1000 - все функции принимают и возвращают одно целое число

```ts
function f(x) = x.

  You may assume each function in the array accepts one integer as input and
  returns one integer as output.

  Constraints:
  - -1000 <= x <= 1000
  - 0 <= functions.length <= 1000
  - all functions accept and return a single integer
*/

type Fn = (x: number) => number

function compose(functions: Fn[]): Fn {
  return function (x) {
    return functions.reduceRight((acc, fn) => fn(acc), x)
  }
}

const fn = compose([x => x + 1, x => 2 * x])
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
