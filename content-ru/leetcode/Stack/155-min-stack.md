# 155. Min Stack (Medium) (<https://leetcode.com/problems/min-stack/>)

> Спроектируйте стек, который поддерживает push, pop, top и получение минимального элемента за константное время.
> Реализуйте класс MinStack: - MinStack() инициализирует объект стека.
>
> - void push(int value) добавляет элемент value на вершину стека.
> - void pop() удаляет элемент с вершины стека.
> - int top() возвращает элемент на вершине стека.
> - int getMin() возвращает минимальный элемент в стеке.
>   Ограничения: - -2^31 <= val <= 2^31 - 1 - Операции pop, top и getMin всегда будут вызываться на непустых стеках.
> - Будет сделано не более 3 * 10^4 вызовов push, pop, top и getMin.
>   Вы должны реализовать решение с временной сложностью O(1) для каждой функции.

```ts
class MinStack {
  private stack: number[] = []
  private minStack: number[] = []

  constructor() {}

  push(val: number): void {
    this.stack.push(val)
    const currentMin = this.minStack.length === 0 ? Infinity : this.minStack.at(-1)!
    this.minStack.push(Math.min(val, currentMin))
  }

  pop(): void {
    this.stack.pop()
    this.minStack.pop()
  }

  top(): number {
    return this.stack.at(-1)
  }

  getMin(): number {
    return this.minStack.at(-1)
  }
}

// Локальная проверка:
const minStack = new MinStack()
minStack.push(1)
minStack.push(2)
minStack.push(0)
console.log(minStack.getMin())
minStack.pop()
console.log(minStack.top())
console.log(minStack.getMin())
```

```md
Пример 1:

    Ввод
    ["MinStack", "push", 1, "push", 2, "push", 0, "getMin", "pop", "top", "getMin"]

    Вывод
    [null,null,null,null,0,null,2,1]

    Объяснение
```

#leetcode
