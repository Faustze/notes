# 2693. Call Function with Custom Context (Medium) (<https://leetcode.com/problems/call-function-with-custom-context/>)

> Enhance all functions to have the callPolyfill method.
> The method accepts an object obj as its first parameter and any number of additional arguments.
> The obj becomes the this context for the function.
> The additional arguments are passed to the function that the callPolyfill method belongs on.
> Please solve it without using the built-in Function.call method.
> Constraints: - typeof args[0] == "object" and args[0] != null - 1 <= args.length <= 100 - 2 <= JSON.stringify(args[0]).length <= 10^5

```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue }

interface Function {
  callPolyfill: (context: Record<string, JSONValue>, ...args: JSONValue[]) => JSONValue
}
```

```md
Example 1:

    Input:
    fn = function add(b) {
      return this.a + b;
    }
    args = [{ "a": 5 }, 7]
    Output: 12
    Explanation:
    fn.callPolyfill({ "a": 5 }, 7); // 12
    callPolyfill sets the "this" context to { "a": 5 }. 7 is passed as an
    argument.

  Example 2:

    Input:
    fn = function tax(price, taxRate) {
      return `The cost of the ${this.item} is ${price * taxRate}`;
    }
    args = [{ "item": "burger" }, 10, 1.1]
    Output: "The cost of the burger is 11"
    Explanation:
    callPolyfill sets the "this" context to { "item": "burger" }. 10 and 1.1
    are passed as additional arguments.
```
