# 392. Является ли подпоследовательностью (Easy) (<https://leetcode.com/problems/is-subsequence/>)

> Даны две строки s и t, верните true, если s является подпоследовательностью t, или false в противном случае.
> Подпоследовательность строки — это новая строка, образованная из исходной строки путём удаления некоторых (возможно, ни одного) символов без нарушения относительного порядка оставшихся символов.
> (то есть "ace" является подпоследовательностью "abcde", а "aec" — нет).
> Ограничения: - 0 <= s.length <= 100 - 0 <= t.length <= 10^4 - s и t состоят только из строчных английских букв.

```ts
function isSubsequence(s: string, t: string): boolean {
  let sIdx = 0
  for (let i = 0; i < t.length && sIdx < s.length; i++) {
    // без аллокации
    if (t.charCodeAt(i) === s.charCodeAt(sIdx)) {
      sIdx++
    }
  }

  return sIdx === s.length
}

// Local check:
console.log(isSubsequence("abc", "ahbgdc"))
console.log(isSubsequence("axc", "ahbgdc"))
```

```md
Example 1:
    Input: s = "abc", t = "ahbgdc"
    Output: true

  Example 2:
    Input: s = "axc", t = "ahbgdc"
    Output: false
```

[[leetcode/Two Pointers/index|two-pointers]]
[[leetcode/Two Pointers/345-reverse-vowels-of-a-string|345-reverse-vowels-of-a-string]]
[[leetcode/Two Pointers/844-backspace-string-compare|844-backspace-string-compare]]
#leetcode
