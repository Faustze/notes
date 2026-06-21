# 1071. Greatest Common Divisor of Strings (Easy) (<https://leetcode.com/problems/greatest-common-divisor-of-strings/>)

> For two strings s and t, we say "t divides s" if and only if s = t + t + ...
> + t (i.e., t is concatenated with itself one or more times).
> Given two strings str1 and str2, return the largest string x such that x divides both str1 and str2.
> Constraints: 1 <= str1.length, str2.length <= 1000 str1 and str2 consist of English uppercase letters.

```ts
function gcdOfStrings(str1: string, str2: string): string {
  if (str1 + str2 !== str2 + str1)
    return ''
  return str1.slice(0, gcd(str1.length, str2.length))
}

// Алгоритм Евклида
function gcd(a: number, b: number) {
  if (b === 0) {
    return a
  }
  return gcd(b, a % b)
}

// Local check:
console.log(gcdOfStrings('ABCABC', 'ABC'))
console.log(gcdOfStrings('ABABAB', 'ABAB'))
console.log(gcdOfStrings('LEET', 'CODE'))
```

```md
Example 1:

    Input: str1 = "ABCABC", str2 = "ABC"
    Output: "ABC"

  Example 2:

    Input: str1 = "ABABAB", str2 = "ABAB"
    Output: "AB"

  Example 3:

    Input: str1 = "LEET", str2 = "CODE"
    Output: ""
```
