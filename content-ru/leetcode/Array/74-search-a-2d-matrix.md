# 74. Поиск в двумерной матрице (Medium) (<https://leetcode.com/problems/search-a-2d-matrix/>)

> Дан двумерный целочисленный массив matrix размером m x n и целое число target. Определите, содержится ли target в матрице.
> Ограничения на матрицу: - Каждая строка отсортирована в неубывающем порядке - Первый элемент каждой строки больше последнего элемента предыдущей строки. Верните true, если target найден, и false в противном случае.
> Задача: добиться временной сложности O(log(m * n)).
> Ограничения: - 1 <= m, n <= 100 - -10000 <= matrix[i][j], target <= 10000

```ts
function searchMatrix(matrix: number[][], target: number): boolean {
  let lo = 0,
    n = matrix[0].length,
    hi = matrix.length * n - 1

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2),
      row = Math.floor(mid / n),
      col = mid % n,
      curr = matrix[row][col]
    if (curr === target) return true
    else if (curr > target) {
      hi = mid - 1
    } else {
      lo = mid + 1
    }
  }
  return false
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
)
console.log(
  searchMatrix(
    [
      [1, 2, 4, 8],
      [10, 11, 12, 13],
      [14, 20, 30, 40],
    ],
    15,
  ),
)
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
