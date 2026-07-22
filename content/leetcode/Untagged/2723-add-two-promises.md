# 2723. Add Two Promises (Easy) (<https://leetcode.com/problems/add-two-promises/>)

<!-- [[leetcode/untagged]] [[leetcode/untagged/2721-execute-asynchronous-functions-in-parallel]] [[leetcode/untagged/2724-sort-by]] -->
> Given two promises promise1 and promise2, return a new promise.
> promise1 and promise2 will both resolve with a number.
> The returned promise should resolve with the sum of the two numbers.
> Constraints: - promise1 and promise2 are promises that resolve with a number

```ts
async function addTwoPromises(
  promise1: Promise<number>,
  promise2: Promise<number>,
): Promise<number> {
  return Promise.all([promise1, promise2]).then(([result1, result2]) => result1 + result2)
}

addTwoPromises(Promise.resolve(2), Promise.resolve(2))
  .then(console.log) // 4

addTwoPromises(Promise.resolve(2), Promise.resolve(5))
  .then(console.log) // 7

addTwoPromises(Promise.resolve(10), Promise.resolve(-12))
  .then(console.log) // -2
```

```md
Example 1:

    Input:
    promise1 = new Promise(resolve => setTimeout(() => resolve(2), 20)),
    promise2 = new Promise(resolve => setTimeout(() => resolve(5), 60))
    Output: 7
    Explanation:
    The two input promises resolve with the values of 2 and 5 respectively.
    The returned promise should resolve with a value of 2 + 5 = 7.
    The time the returned promise resolves is not judged for this problem.

  Example 2:

    Input:
    promise1 = new Promise(resolve => setTimeout(() => resolve(10), 50)),
    promise2 = new Promise(resolve => setTimeout(() => resolve(-12), 30))
    Output: -2
    Explanation:
    The two input promises resolve with the values of 10 and -12 respectively.
    The returned promise should resolve with a value of 10 + -12 = -2.
```

#leetcode
