# 496. Next Greater Element I (Easy) (<https://leetcode.com/problems/next-greater-element-i/>)

> Следующий больший элемент для некоторого элемента x в массиве — это первый больший элемент, находящийся справа от x в том же массиве.
> Даны два различных 0-индексированных целочисленных массива nums1 и nums2, где nums1 является подмножеством nums2.
> Для каждого 0 <= i < nums1.length найдите индекс j такой, что nums1[i] == nums2[j], и определите следующий больший элемент для nums2[j] в nums2.
> Если следующего большего элемента нет, ответом для этого запроса будет -1.
> Верните массив длины nums1.length такой, что ans[i] — это следующий больший элемент, как описано выше.
> Ограничения: - 1 <= nums1.length <= nums2.length <= 1000 - 0 <= nums1[i], nums2[i] <= 10^4 - Все целые числа в nums1 и nums2 уникальны.
>
> - Все целые числа из nums1 также присутствуют в nums2.
>   Дополнительный вопрос: Сможете ли вы найти решение с O(nums1.length + nums2.length)?

```ts
function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const stack: number[] = [] // LIFO; хранит числа, ещё не нашедшие next greater
  const nextGreaters: Record<number, number> = {} // где ключ — число из nums2, значение — его next greater element

  for (let i = 0; i < nums2.length; i++) {
    const curr = nums2[i]

    // При новом числе — пока оно больше вершины стека, выталкивай вершину и записывай в map map[вершина] = новое_число
    while (curr > stack[stack.length - 1] && stack.length > 0) {
      nextGreaters[stack.pop()!] = curr
    }

    stack.push(curr)
  }

  const result = []
  for (let i = 0; i < nums1.length; i++) {
    result.push(nextGreaters[nums1[i]] ?? -1)
  }

  return result
}

// Local check:
console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])) // [-1,3,-1]
console.log(nextGreaterElement([2, 4], [1, 2, 3, 4])) // [3,-1]
```

```md
Example 1:

    Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
    Output: [-1,3,-1]
    Explanation:
      4 is in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.
      1 is in nums2 = [1,3,4,2]. The next greater element is 3.
      2 is in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.

Example 2:

    Input: nums1 = [2,4], nums2 = [1,2,3,4]
    Output: [3,-1]
    Explanation:
      2 is in nums2 = [1,2,3,4]. The next greater element is 3.
      4 is in nums2 = [1,2,3,4]. There is no next greater element, so the answer is -1.
```

#leetcode
