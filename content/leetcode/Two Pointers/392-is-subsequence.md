# 392. Is Subsequence (Easy) (<https://leetcode.com/problems/is-subsequence/>)

> Given two strings s and t, return true if s is a subsequence of t, or false otherwise.
> A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters.
> (i.e., "ace" is a subsequence of "abcde" while "aec" is not).
> Constraints: - 0 <= s.length <= 100 - 0 <= t.length <= 10^4 - s and t consist only of lowercase English letters.

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
