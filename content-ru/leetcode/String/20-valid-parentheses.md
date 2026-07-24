# 20. Valid Parentheses (Easy) (<https://leetcode.com/problems/valid-parentheses/>)

> Дана строка s, содержащая только символы '(', ')', '{', '}', '[' и ']', определите, является ли входная строка допустимой.
> Входная строка допустима, если: 1.
> Открывающие скобки должны закрываться скобками того же типа. 2.
> Открывающие скобки должны закрываться в правильном порядке. 3.
> Каждой закрывающей скобке соответствует открывающая скобка того же типа.
> Ограничения: - 1 <= s.length <= 10^4 - s состоит только из скобок '()[]{}'.

```ts
function isValid(s: string): boolean {}

// Local check:
console.log(isValid("()"))
console.log(isValid("()[]{}"))
console.log(isValid("(]"))
console.log(isValid("([])"))
console.log(isValid("([)]"))
```

```md
Example 1:

    Input: s = "()"
    Output: true

Example 2:

    Input: s = "()[]{}"
    Output: true

Example 3:

    Input: s = "(]"
    Output: false

Example 4:

    Input: s = "([])"
    Output: true

Example 5:

    Input: s = "([)]"
    Output: false
```

#leetcode
