# 636. Exclusive Time of Functions (Medium) (<https://leetcode.com/problems/exclusive-time-of-functions/>)

> On a single-threaded CPU, we execute a program containing n functions.
> Each function has a unique ID between 0 and n - 1.
> Function calls are stored in a call stack: when a function call starts, its ID is pushed onto the stack, and when a function call ends, its ID is popped off the stack.
> The function whose ID is at the top of the stack is the current function being executed.
> Each time a function starts or ends, we write a log with the ID, whether it started or ended, and the timestamp.
> You are given a list logs, where logs[i] represents the ith log message formatted as a string "{function_id}:{"start" | "end"}:{timestamp}".
> For example, "0:start:3" means a function call with function ID 0 started at the beginning of timestamp 3, and "1:end:2" means a function call with function ID 1 ended at the end of timestamp 2.
> Note that a function can be called multiple times, possibly recursively.
> A function's exclusive time is the sum of execution times for all function calls in the program.
> For example, if a function is called twice, one call executing for 2 time units and another call executing for 1 time unit, the exclusive time is 2 + 1 = 3.
> Return the exclusive time of each function in an array, where the value at the ith index represents the exclusive time for the function with ID i.
> Constraints: - 1 <= n <= 100 - 2 <= logs.length <= 500 - 0 <= function_id < n - 0 <= timestamp <= 10^9 - No two start events will happen at the same timestamp.
> - No two end events will happen at the same timestamp.
> - Each function has an "end" log for each "start" log.

```ts
function starts or ends, we write a log with the ID, whether it started or ended, and the timestamp.

  You are given a list logs, where logs[i] represents the ith log message formatted as a string
  "{function_id}:{"start" | "end"}:{timestamp}". For example, "0:start:3" means a function call
  with function ID 0 started at the beginning of timestamp 3, and "1:end:2" means a function call
  with function ID 1 ended at the end of timestamp 2. Note that a function can be called multiple
  times, possibly recursively.

  A function's exclusive time is the sum of execution times for all function calls in the program.
  For example, if a function is called twice, one call executing for 2 time units and another call
  executing for 1 time unit, the exclusive time is 2 + 1 = 3.

  Return the exclusive time of each function in an array, where the value at the ith index
  represents the exclusive time for the function with ID i.

  Constraints:
  - 1 <= n <= 100
  - 2 <= logs.length <= 500
  - 0 <= function_id < n
  - 0 <= timestamp <= 10^9
  - No two start events will happen at the same timestamp.
  - No two end events will happen at the same timestamp.
  - Each function has an "end" log for each "start" log.
*/

function exclusiveTime(n: number, logs: string[]): number[] {
  // Стек хранит ID функций, которые сейчас "в работе" (ещё не завершились).
  // Вершина стека — текущая выполняемая функция.
  const stack: number[] = []

  // result[i] — суммарное эксклюзивное время функции с ID = i.
  // Эксклюзивное = только своё время, без времени дочерних вызовов.
  const result: number[] = Array.from({ length: n }, () => 0)

  // prevTs — timestamp предыдущего лога. Нужен, чтобы считать длительность
  // между двумя соседними событиями.
  let prevTs = 0

  for (let i = 0; i < logs.length; i++) {
    // Парсим лог: "function_id:start_or_end:timestamp"
    const [idStr, op, tsStr] = logs[i].split(':')
    const id = Number(idStr)
    const ts = Number(tsStr)

    if (op === 'start') {
      // Новая функция стартует → старая функция (на вершине стека) ЗАМИРАЕТ.
      // Время от prevTs до ts принадлежит замороженной функции.
      if (stack.length > 0) {
        result[stack[stack.length - 1]] += ts - prevTs
      }
      // Кладём новую функцию на стек — теперь она текущая.
      stack.push(id)
      // Запоминаем timestamp этого события для следующей итерации.
      prevTs = ts
    }
    else {
      // Функция завершается. Она работала от prevTs до ts ВКЛЮЧИТЕЛЬНО.
      // +1 потому что "end:5" означает конец единицы 5 (единица 5 полностью отработана).
      result[id] += ts - prevTs + 1
      // Снимаем завершённую функцию со стека.
      stack.pop()
      // prevTs = ts + 1, а не ts, потому что единица ts уже полностью учтена этим end.
      // Следующее событие начинается с ts + 1. Если оставить prevTs = ts, то при двух
      // подряд end для одной функции (например "0:end:6" → "0:end:7") получим 7 - 6 + 1 = 2 вместо 1.
      prevTs = ts + 1
    }
  }

  return result
}

// Local check:
console.log(exclusiveTime(2, ['0:start:0', '1:start:2', '1:end:5', '0:end:6']))
console.log(exclusiveTime(1, ['0:start:0', '0:start:2', '0:end:5', '0:start:6', '0:end:6', '0:end:7']))
console.log(exclusiveTime(2, ['0:start:0', '0:start:2', '0:end:5', '1:start:6', '1:end:6', '0:end:7']))

// Альтернативное решение
type Status = 'start' | 'end'

interface Log {
  id: number
  status: Status
  timestamp: number
}

interface Call {
  id: number
  start: number
  childrenDuration: number
}

function exclusiveTime2(n: number, logs: string[]): number[] {
  const durations: number[] = Array.from({ length: n }, () => 0)
  const calls: Call[] = []

  for (let i = 0; i < logs.length; i++) {
    const log = parseLog(logs[i]!)
    const call = calls.at(-1)

    if (call && call.id === log.id && log.status === 'end') {
      const totalDuration = log.timestamp - call.start + 1
      const selfDuration = totalDuration - call.childrenDuration

      const parentCall = calls.at(-2)
      if (parentCall) {
        parentCall.childrenDuration += totalDuration
      }

      durations[log.id]! += selfDuration

      calls.pop()
    }
    else {
      calls.push({
        id: log.id,
        start: log.timestamp,
        childrenDuration: 0,
      })
    }
  }

  return durations
}

function parseLog(log: string): Log {
  const logData = log.split(':') as [string, string, string]
  const id = Number(logData[0])
  const status = logData[1] as Status
  const timestamp = Number(logData[2])

  return { id, status, timestamp }
}

console.log(exclusiveTime2(2, ['0:start:0', '1:start:2', '1:end:5', '0:end:6']))
console.log(exclusiveTime2(1, ['0:start:0', '0:start:2', '0:end:5', '0:start:6', '0:end:6', '0:end:7']))
console.log(exclusiveTime2(2, ['0:start:0', '0:start:2', '0:end:5', '1:start:6', '1:end:6', '0:end:7']))
```

```md
Example 1:

    Input: n = 2, logs = ["0:start:0","1:start:2","1:end:5","0:end:6"]
    Output: [3,4]
    Explanation:
    Function 0 starts at the beginning of time 0, then it executes 2 units of time
    and reaches the end of time 1.
    Function 1 starts at the beginning of time 2, executes for 4 units of time,
    and ends at the end of time 5.
    Function 0 resumes execution at the beginning of time 6 and executes for 1 unit of time.
    So function 0 spends 2 + 1 = 3 units of total time executing, and function 1 spends
    4 units of total time executing.

  Example 2:

    Input: n = 1, logs = ["0:start:0","0:start:2","0:end:5","0:start:6","0:end:6","0:end:7"]
    Output: [8]
    Explanation:
    Function 0 starts at the beginning of time 0, executes for 2 units of time, and
    recursively calls itself.
    Function 0 (recursive call) starts at the beginning of time 2 and executes for 4 units of time.
    Function 0 (initial call) resumes execution then immediately calls itself again.
    Function 0 (2nd recursive call) starts at the beginning of time 6 and executes for 1 unit of time.
    Function 0 (initial call) resumes execution at the beginning of time 7 and executes for 1 unit of time.
    So function 0 spends 2 + 4 + 1 + 1 = 8 units of total time executing.

  Example 3:

    Input: n = 2, logs = ["0:start:0","0:start:2","0:end:5","1:start:6","1:end:6","0:end:7"]
    Output: [7,1]
    Explanation:
    Function 0 starts at the beginning of time 0, executes for 2 units of time, and
    recursively calls itself.
    Function 0 (recursive call) starts at the beginning of time 2 and executes for 4 units of time.
    Function 0 (initial call) resumes execution then immediately calls function 1.
    Function 1 starts at the beginning of time 6, executes 1 unit of time, and ends at the end of time 6.
    Function 0 resumes execution at the beginning of time 7 and executes for 1 unit of time.
    So function 0 spends 2 + 4 + 1 = 7 units of total time executing, and function 1 spends
    1 unit of total time executing.
```
