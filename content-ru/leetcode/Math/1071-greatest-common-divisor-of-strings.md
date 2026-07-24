# 1071. Наибольший общий делитель строк (Easy) (<https://leetcode.com/problems/greatest-common-divisor-of-strings/>)

> Для двух строк s и t говорят, что "t делит s" тогда и только тогда, когда s = t + t + ...
> + t (то есть t конкатенируется сама с собой один или более раз).
> Даны две строки str1 и str2, верните наибольшую строку x такую, что x делит и str1, и str2.
> Ограничения: 1 <= str1.length, str2.length <= 1000 str1 и str2 состоят из заглавных букв английского алфавита.

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

[[leetcode/String/index|string]]
#leetcode
