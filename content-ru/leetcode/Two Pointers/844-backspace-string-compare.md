# 844. Backspace String Compare (Easy) (<https://leetcode.com/problems/backspace-string-compare/>)

> Даны две строки s и t. Верните true, если они окажутся равны при вводе в пустые текстовые редакторы.
> '#' означает символ backspace.
> Обратите внимание, что если применить backspace к пустому тексту, текст останется пустым.
> Ограничения: - 1 <= s.length, t.length <= 200 - s и t содержат только строчные буквы и символы '#'.
> Дополнительно: Можете ли вы решить эту задачу за O(n) времени и O(1) памяти?

```ts
function backspaceCompare(s: string, t: string): boolean {
  const process = (str: string) =>
    str
      .split("")
      .reduce<string[]>((stack, ch) => {
        ch === "#" ? stack.pop() : stack.push(ch);
        return stack;
      }, [])
      .join("");

  return process(s) === process(t);
}

// interview
function backspaceCompare2(s: string, t: string): boolean {
  let i = s.length - 1;
  let j = t.length - 1;
  let skipS = 0;
  let skipT = 0;

  while (i >= 0 || j >= 0) {
    while (i >= 0) {
      if (s[i] === "#") {
        skipS++;
        i--;
      } else if (skipS > 0) {
        skipS--;
        i--;
      } else break;
    }

    while (j >= 0) {
      if (t[j] === "#") {
        skipT++;
        j--;
      } else if (skipT > 0) {
        skipT--;
        j--;
      } else break;
    }

    if (s[i] !== t[j]) return false;
    i--;
    j--;
  }

  return true;
}

// Local check:
console.log(backspaceCompare("ab#c", "ad#c"));
console.log(backspaceCompare("ab##", "c#d#"));
console.log(backspaceCompare("a#c", "b"));
```

```md
Example 1:

    Input: s = "ab#c", t = "ad#c"
    Output: true
    Explanation: Both s and t become "ac".

  Example 2:

    Input: s = "ab##", t = "c#d#"
    Output: true
    Explanation: Both s and t become "".

  Example 3:

    Input: s = "a#c", t = "b"
    Output: false
    Explanation: s becomes "c" while t becomes "b".
```

[[leetcode/Two Pointers/index|two-pointers]]
[[leetcode/Two Pointers/392-is-subsequence|392-is-subsequence]]
#leetcode
