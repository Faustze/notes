# 844. Backspace String Compare (Easy) (<https://leetcode.com/problems/backspace-string-compare/>)

> Given two strings s and t, return true if they are equal when both are typed into empty text editors.
> '#' means a backspace character.
> Note that after backspacing an empty text, the text will continue empty.
> Constraints: - 1 <= s.length, t.length <= 200 - s and t only contain lowercase letters and '#' characters.
> Follow up: Can you solve it in O(n) time and O(1) space?

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