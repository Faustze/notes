# 74. Search a 2D Matrix (Medium) (<https://leetcode.com/problems/search-a-2d-matrix/>)

> Given an m x n 2D integer array matrix and an integer target, determine whether target exists in the matrix.
> Constraints on the matrix: - Each row is sorted in non-decreasing order - The first element of each row exceeds the last element of the previous row Return true if target is found, false otherwise.
> Challenge: achieve O(log(m * n)) time complexity.
> Constraints: - 1 <= m, n <= 100 - -10000 <= matrix[i][j], target <= 10000

```ts
function searchMatrix(matrix: number[][], target: number): boolean {
  let lo = 0,
    n = matrix[0].length,
    hi = matrix.length * n - 1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2),
      row = Math.floor(mid / n),
      col = mid % n,
      curr = matrix[row][col];
    if (curr === target) return true;
    else if (curr > target) {
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return false;
}

// Local check:
console.log(
  searchMatrix(
    [
      [1, 2, 4, 8],
      [10, 11, 12, 13],
      [14, 20, 30, 40],
    ],
    10,
  ),
);
console.log(
  searchMatrix(
    [
      [1, 2, 4, 8],
      [10, 11, 12, 13],
      [14, 20, 30, 40],
    ],
    15,
  ),
);
```

```md
Example 1:

    Input: matrix = [[1,2,4,8],[10,11,12,13],[14,20,30,40]], target = 10
    Output: true

  Example 2:

    Input: matrix = [[1,2,4,8],[10,11,12,13],[14,20,30,40]], target = 15
    Output: false
```
#leetcode
