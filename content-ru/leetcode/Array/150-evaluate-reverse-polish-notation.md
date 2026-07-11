# 150. Evaluate Reverse Polish Notation (Medium) (<https://leetcode.com/problems/evaluate-reverse-polish-notation>)

> Дан массив строк tokens, представляющий арифметическое выражение в обратной польской записи.
> Вычислите выражение.
> Верните целое число — значение выражения.
> Учтите, что: • Допустимые операторы: '+', '-', '*' и '/'.
> • Каждый операнд может быть числом или другим выражением.
> • Деление двух целых чисел всегда округляется в сторону нуля.
> • Деления на ноль не будет.
> • Входные данные представляют собой корректное арифметическое выражение в обратной польской записи.
> • Ответ и все промежуточные вычисления можно представить 32-битным целым числом.

```ts
const ops: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => Math.trunc(a / b),
}
function evalRPN(tokens: string[]): number {
  const stack: number[] = []

  for (const token of tokens) {
    if (token in ops) {
      const right = stack.pop()!
      const left = stack.pop()!
      stack.push(ops[token](left, right))
    }
    else {
      stack.push(Number(token))
    }
  }

  return stack[0]
}

// Local check:
console.log(evalRPN(['2', '1', '+', '3', '*'])) // 9
console.log(evalRPN(['4', '13', '5', '/', '+'])) // 6
console.log(evalRPN(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'])) // 22
```

```md
Example 1:

    Input: tokens = ["2","1","+","3","*"]
    Output: 9
    Explanation: ((2 + 1) * 3) = 9

  Example 2:

    Input: tokens = ["4","13","5","/","+"]
    Output: 6
    Explanation: (4 + (13 / 5)) = 6

  Example 3:

    Input: tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
    Output: 22
    Explanation: ((10 * (6 / ((9 + 3) * -11))) + 17) + 5
    = ((10 * (6 / (12 * -11))) + 17) + 5
    = ((10 * (6 / -132)) + 17) + 5
    = ((10 * 0) + 17) + 5
    = (0 + 17) + 5
    = 17 + 5
    = 22
```

[[leetcode/Array/1475-final-prices-with-a-special-discount-in-a-shop]]
[[leetcode/Array/268-missing-number]]
#leetcode
