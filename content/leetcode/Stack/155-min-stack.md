# 155. Min Stack (Medium) (<https://leetcode.com/problems/min-stack/>)

> Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
> Implement the MinStack class: - MinStack() initializes the stack object.
> - void push(int value) pushes the element value onto the stack.
> - void pop() removes the element on the top of the stack.
> - int top() gets the top element of the stack.
> - int getMin() retrieves the minimum element in the stack.
> Constraints: - -2^31 <= val <= 2^31 - 1 - Methods pop, top and getMin operations will always be called on non-empty stacks.
> - At most 3 * 10^4 calls will be made to push, pop, top, and getMin.
> You must implement a solution with O(1) time complexity for each function.

```ts
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  constructor() {}

  push(val: number): void {
    this.stack.push(val);
    const currentMin =
      this.minStack.length === 0 ? Infinity : this.minStack.at(-1)!;
    this.minStack.push(Math.min(val, currentMin));
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack.at(-1);
  }

  getMin(): number {
    return this.minStack.at(-1);
  }
}


// Local check:
const minStack = new MinStack();
minStack.push(1);
minStack.push(2);
minStack.push(0);
console.log(minStack.getMin());
minStack.pop();
console.log(minStack.top());
console.log(minStack.getMin());
```

```md
Example 1:

    Input
    ["MinStack", "push", 1, "push", 2, "push", 0, "getMin", "pop", "top", "getMin"]

    Output
    [null,null,null,null,0,null,2,1]

    Explanation
```

#leetcode
