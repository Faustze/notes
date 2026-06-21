# 2703. Return Length of Arguments Passed (Easy) (<https://leetcode.com/problems/return-length-of-arguments-passed/>)

> Write a function argumentsLength that returns the count of arguments passed to it.
> Constraints: - args is a valid JSON array - 0 <= args.length <= 100

```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue }

function argumentsLength(...args: JSONValue[]): number {
  if (Array.isArray(args)) {
    return args.length
  }
  return 1
}

console.log(argumentsLength(1, 2, 3)) // 3
console.log(argumentsLength(5)) // 1
console.log(argumentsLength({}, null, '3')) // 3
```

```md
Example 1:

    Input: args = [5]
    Output: 1
    Explanation:
    argumentsLength(5); // 1

    One value was passed to the function so it should return 1.

  Example 2:

    Input: args = [{}, null, "3"]
    Output: 3
    Explanation:
    argumentsLength({}, null, "3"); // 3

    Three values were passed to the function so it should return 3.
```
