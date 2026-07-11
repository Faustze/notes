# 2723. Add Two Promises (Easy) (<https://leetcode.com/problems/add-two-promises/>)

<!-- [[leetcode/untagged]] [[leetcode/untagged/2721-execute-asynchronous-functions-in-parallel]] [[leetcode/untagged/2724-sort-by]] -->

> Даны два promise, promise1 и promise2, верните новый promise.
> promise1 и promise2 оба резолвятся числом.
> Возвращённый promise должен резолвиться суммой двух чисел.
> Ограничения: - promise1 и promise2 — это promise, резолвящиеся числом

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
