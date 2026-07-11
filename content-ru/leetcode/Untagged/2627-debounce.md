# 2627. Debounce (Medium) (<https://leetcode.com/problems/debounce/>)

> Дана функция fn и время t в миллисекундах, верните debounce-версию этой функции.
> Debounce-функция — это функция, выполнение которой откладывается на t миллисекунд и отменяется, если она вызывается снова в течение этого окна времени.
> Debounce-функция также должна принимать переданные параметры.
> Например, если t = 50мс, и функция была вызвана в 30мс, 60мс и 100мс, первые 2 вызова функции будут отменены, а 3-й вызов выполнится в 150мс.
> Решите без использования функции _.debounce() из lodash.
> Ограничения: - 0 <= t <= 1000 - 1 <= calls.length <= 10 - 0 <= calls[i].t <= 1000 - 0 <= calls[i].inputs.length <= 10

```ts
type F = (...args: number[]) => void

function debounce(fn: F, t: number): F {
  let timer: ReturnType<typeof setTimeout>

  return function (...args) {
    clearTimeout(timer)

    timer = setTimeout(() => {
      fn(...args)
    }, t)
  }
}

const log = debounce(console.log, 100)
log("Hello") // cancelled
console.log("1")
log("Hello") // cancelled
console.log("2")
log("Hello") // Logged at t=100ms
```

```md
Example 1:

    Input:
    t = 50
    calls = [
      { "t": 50, inputs: [1] },
      { "t": 75, inputs: [2] }
    ]
    Output: [{ "t": 125, inputs: [2] }]
    Explanation:
    The 1st call is cancelled by the 2nd call because the 2nd call occurred
    before 100ms. The 2nd call is delayed by 50ms and executed at 125ms.
    The inputs were (2).

Example 2:

    Input:
    t = 20
    calls = [
      { "t": 50, inputs: [1] },
      { "t": 100, inputs: [2] }
    ]
    Output: [{ "t": 70, inputs: [1] }, { "t": 120, inputs: [2] }]
    Explanation:
    The 1st call is delayed until 70ms. The inputs were (1).
    The 2nd call is delayed until 120ms. The inputs were (2).

Example 3:

<!-- [[leetcode/untagged]] [[leetcode/untagged/2626-array-reduce-transformation]] [[leetcode/untagged/2629-function-composition]] -->

    Input:
    t = 150
    calls = [
      { "t": 50, inputs: [1, 2] },
      { "t": 300, inputs: [3, 4] },
      { "t": 300, inputs: [5, 6] }
    ]
    Output: [{ "t": 200, inputs: [1, 2] }, { "t": 450, inputs: [5, 6] }]
    Explanation:
    The 1st call is delayed by 150ms and ran at 200ms. The inputs were (1, 2).
    The 2nd call is cancelled by the 3rd call.
    The 3rd call is delayed by 150ms and ran at 450ms. The inputs were (5, 6).
```

#leetcode
