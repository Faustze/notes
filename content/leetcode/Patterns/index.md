---
title: patterns
---
# LeetCode Patterns Cheatsheet (TypeScript)

---

## 1. Two Pointers

**Когда:** отсортированный массив, нужно O(n), ищем пару/подмассив.

```typescript
// Пример: сумма двух чисел = target
function twoSum(nums: number[], target: number): number[] {
  let i = 0, j = nums.length - 1;
  while (i < j) {
    const sum = nums[i] + nums[j];
    if (sum === target) return [i, j];
    else if (sum < target) i++;
    else j--;
  }
  return [];
}
```

---

## 2. Sliding Window

**Когда:** подмассив/подстрока фиксированной или переменной длины, нужен максимум/минимум/условие.

```typescript
// Пример: максимальная сумма подмассива длины k
function maxSum(nums: number[], k: number): number {
  let sum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let max = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    max = Math.max(max, sum);
  }
  return max;
}
```

---

## 3. Binary Search

**Когда:** отсортированный массив, нужно O(log n).

```typescript
function binarySearch(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

---

## 4. Prefix Sum

**Когда:** много запросов суммы диапазона [i, j].

```typescript
function buildPrefix(nums: number[]): number[] {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix.at(-1)! + n);
  return prefix;
}
// сумма [i, j] = prefix[j+1] - prefix[i]
```

---

## 5. HashMap / HashSet

**Когда:** нужно считать частоту, проверять наличие, находить дубликаты за O(1).

```typescript
// Пример: два числа дают target (неотсортированный массив)
function twoSumHash(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp)!, i];
    map.set(nums[i], i);
  }
  return [];
}
```

---

## 6. Monotonic Stack

**Когда:** "следующий больший/меньший элемент", диапазоны, температуры.

```typescript
// Пример: следующий больший элемент
function nextGreater(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = []; // хранит индексы
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack.at(-1)!]) {
      result[stack.pop()!] = nums[i];
    }
    stack.push(i);
  }
  return result;
}
```

---

## 7. BFS (обход в ширину)

**Когда:** кратчайший путь в графе/матрице, обход по уровням дерева.

```typescript
function bfs(graph: Map<number, number[]>, start: number): number[] {
  const visited = new Set([start]);
  const queue = [start];
  const order: number[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}
```

---

## 8. DFS (обход в глубину)

**Когда:** все пути, компоненты связности, комбинации/перестановки.

```typescript
function dfs(graph: Map<number, number[]>, node: number, visited = new Set<number>()): void {
  visited.add(node);
  for (const neighbor of graph.get(node) ?? []) {
    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);
  }
}
```

---

## 9. Backtracking

**Когда:** все комбинации/перестановки/подмножества с ограничениями.

```typescript
// Пример: все подмножества
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  function bt(start: number, current: number[]) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      bt(i + 1, current);
      current.pop(); // откат
    }
  }
  bt(0, []);
  return result;
}
```

---

## 10. Dynamic Programming

**Когда:** оптимальное решение строится из подзадач, есть перекрывающиеся состояния.

```typescript
// Пример: монеты (coin change)
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

---

## 11. Heap / Priority Queue

**Когда:** k-й наибольший/наименьший элемент, слияние k отсортированных списков.  
_(В JS нет встроенного heap — используй библиотеку или реализуй минимальную.)_

```typescript
// Мини-heap вручную (min-heap через массив)
class MinHeap {
  private h: number[] = [];
  push(val: number) {
    this.h.push(val);
    this.h.sort((a, b) => a - b); // упрощённо; для O(log n) — sift up
  }
  pop(): number { return this.h.shift()!; }
  peek(): number { return this.h[0]; }
  size(): number { return this.h.length; }
}
```

---

## 12. Fast & Slow Pointers (Floyd's)

**Когда:** цикл в связном списке, середина списка.

```typescript
// Пример: есть ли цикл
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

---

## Когда что использовать — быстрая шпаргалка

|Сигнал в задаче|Паттерн|
|---|---|
|Отсортированный массив + O(n)|Two Pointers|
|Подмассив/подстрока + max/min|Sliding Window|
|Отсортированный + O(log n)|Binary Search|
|Сумма диапазонов|Prefix Sum|
|Дубликаты, частота, O(1) поиск|HashMap/HashSet|
|Следующий больший/меньший|Monotonic Stack|
|Кратчайший путь, уровни|BFS|
|Все пути, компоненты|DFS|
|Все комбинации с откатом|Backtracking|
|Оптимум из подзадач|Dynamic Programming|
|k-й элемент, топ-k|Heap|
|Цикл в списке, середина|Fast & Slow Pointers|
[[leetcode/index]]

Примеры паттернов в заметках:
[[leetcode/Array/739-daily-temperatures|739 — monotonic stack]]
[[leetcode/Array/1475-final-prices-with-a-special-discount-in-a-shop|1475 — monotonic stack]]
[[leetcode/Array/643-maximum-average-subarray-i|643 — sliding window]]
[[leetcode/Hash Table/141-linked-list-cycle|141 — fast & slow pointers]]
[[leetcode/Linked List/876-middle-of-the-linked-list|876 — fast & slow pointers]]
[[leetcode/Two Pointers/125-valid-palindrome|125 — two pointers]]
#leetcode