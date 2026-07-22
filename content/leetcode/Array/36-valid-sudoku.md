# 36. Valid Sudoku (Medium) (<https://leetcode.com/problems/valid-sudoku/>)

> Determine if a 9 x 9 Sudoku board is valid.
> Only the filled cells need to be validated according to the following rules: 1.
> Each row must contain the digits 1-9 without repetition.
> 2.
> Each column must contain the digits 1-9 without repetition.
> 3.
> Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.
> Note: - A Sudoku board (partially filled) could be valid but is not necessarily solvable.
> - Only the filled cells need to be validated according to the mentioned rules.
> Constraints: - board.length == 9 - board[i].length == 9 - board[i][j] is a digit 1-9 or '.'.

```ts
function isValidSudoku(board: string[][]): boolean {
  const rowSet = new Set<string>();
  const colSets: Set<string>[] = Array.from(
    { length: 9 },
    () => new Set<string>(),
  );
  const squareSets: Set<string>[] = Array.from(
    { length: 9 },
    () => new Set<string>(),
  );

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === ".") continue;
      // column
      if (colSets[j].has(board[i][j])) return false;
      colSets[j].add(board[i][j]);
      // row
      if (rowSet.has(board[i][j])) return false;
      rowSet.add(board[i][j]);
      // square
      const squareIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      if (squareSets[squareIndex].has(board[i][j])) return false;
      squareSets[squareIndex].add(board[i][j]);
    }
    rowSet.clear();
  }
  return true;
}

// Local check:
console.log(
  isValidSudoku([
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"],
  ]),
); // true

console.log(
  isValidSudoku([
    ["8", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"],
  ]),
); // false
```

```md
Example 1:

    Input: board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
    Output: true

  Example 2:

    Input: board = [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
    Output: false
    Explanation: Same as Example 1, except with the 5 in the top left corner being modified to 8. Since there are two 8's in the top left 3x3 sub-box, it is invalid.
```

#leetcode
