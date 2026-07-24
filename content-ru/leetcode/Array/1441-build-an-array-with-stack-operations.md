# 1441. Построение массива с помощью операций со стеком (Средний уровень) (<https://leetcode.com/problems/build-an-array-with-stack-operations/>)

> Вам дан целочисленный массив target и целое число n.
> У вас есть пустой стек с двумя следующими операциями: - "Push": добавляет целое число на вершину стека.
> - "Pop": удаляет целое число с вершины стека.
> Также у вас есть поток целых чисел в диапазоне [1, n].
> Используйте эти две операции со стеком, чтобы числа в стеке (от дна до вершины) стали равны target.
> Вы должны следовать следующим правилам: - Если поток целых чисел не пуст, возьмите следующее целое число из потока и добавьте его на вершину стека.
> - Если стек не пуст, удалите целое число с вершины стека.
> - Если в любой момент элементы в стеке (от дна до вершины) равны target, прекратите чтение новых чисел из потока и не выполняйте больше операций со стеком.
> Верните операции со стеком, необходимые для построения target по указанным правилам.
> Если существует несколько допустимых ответов, верните любой из них.
> Ограничения: - 1 <= target.length <= 100 - 1 <= n <= 100 - 1 <= target[i] <= n - target строго возрастающий.

```ts
function buildArray(target: number[], n: number): string[] {
  const operations: string[] = [];
  const stack = {
    items: [] as number[],
    push(value: number) {
      operations.push("Push")      
      this.items.push(value);
    },
    pop(): number | undefined {
      operations.push("Pop")
      return this.items.pop();
    }
  }

  let currentTargetIndex = 0;

  for (let i = 0; i < n; i++) {
    if (currentTargetIndex === target.length) {
      break;
    }
    stack.push(i + 1)
    if (target[currentTargetIndex] !== stack.items[currentTargetIndex]) {
      stack.pop();
    } else {
      currentTargetIndex += 1
    }
  }

  return operations
}

// Локальная проверка:
console.log(buildArray([1, 3], 3))
console.log(buildArray([1, 2, 3], 3))
console.log(buildArray([1, 2], 4))
console.log(buildArray([1,2,3], 3))
```

<!-- [[leetcode/array]] [[leetcode/Array/1431-kids-with-the-greatest-number-of-candies]] [[leetcode/Array/1470-shuffle-the-array]] -->
```md
Example 1:

    Input: target = [1,3], n = 3
    Output: ["Push","Push","Pop","Push"]
    Explanation: Initially the stack s is empty. The last element is the top of the stack.
    Read 1 from the stream and push it to the stack. s = [1].
    Read 2 from the stream and push it to the stack. s = [1,2].
    Pop the integer on the top of the stack. s = [1].
    Read 3 from the stream and push it to the stack. s = [1,3].

  Example 2:

    Input: target = [1,2,3], n = 3
    Output: ["Push","Push","Push"]
    Explanation: Initially the stack s is empty. The last element is the top of the stack.
    Read 1 from the stream and push it to the stack. s = [1].
    Read 2 from the stream and push it to the stack. s = [1,2].
    Read 3 from the stream and push it to the stack. s = [1,2,3].

  Example 3:

    Input: target = [1,2], n = 4
    Output: ["Push","Push"]
    Explanation: Initially the stack s is empty. The last element is the top of the stack.
    Read 1 from the stream and push it to the stack. s = [1].
    Read 2 from the stream and push it to the stack. s = [1,2].
    Since the stack (from the bottom to the top) is equal to target, we stop the stack operations.
    The answers that read integer 3 from the stream are not accepted.
```

[[leetcode/Array/1431-kids-with-the-greatest-number-of-candies]]
[[leetcode/Array/1470-shuffle-the-array]]
#leetcode
