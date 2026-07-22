# 11. Container With Most Water (Medium) (<https://leetcode.com/problems/container-with-most-water/>)

> You are given an integer array height of length n.
> There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).
> Find two lines that together with the x-axis form a container, such that the container contains the most water.
> Return the maximum amount of water a container can store.
> Notice that you may not slant the container.
> Constraints: - n == height.length - 2 <= n <= 10^5 - 0 <= height[i] <= 10^4

```ts
function maxArea(height: number[]): number {
  let left = 0,
    right = height.length - 1;
  let area = 0;

  while (left < right) {
    const leftValue = height[left],
      rightValue = height[right];
    area = Math.max(area, Math.min(leftValue, rightValue) * (right - left));

    if (leftValue < rightValue) {
      left++;
    } else {
      right--;
    }
  }

  return area;
}

// Local check:
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 7, 2, 5, 4, 7, 3, 6])); // 36
console.log(maxArea([1, 1])); // 1
console.log(maxArea([2, 2, 2])); // 4
```

```md
Example 1:

    Input: height = [1,8,6,2,5,4,8,3,7]
    Output: 49
    Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7].
    In this case, the max area of water (blue section) the container can contain is 49.

  Example 2:

    Input: height = [1,1]
    Output: 1
```

#leetcode
