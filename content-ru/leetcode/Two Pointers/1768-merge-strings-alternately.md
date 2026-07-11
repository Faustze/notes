# 1768. Merge Strings Alternately (Easy) (<https://leetcode.com/problems/merge-strings-alternately/>)

> Даны две строки word1 и word2.
> Слейте строки, добавляя буквы в чередующемся порядке, начиная с word1.
> Если одна строка длиннее другой, добавьте оставшиеся буквы в конец итоговой строки.
> Верните итоговую строку.
> Ограничения: 1 <= word1.length, word2.length <= 100 word1 и word2 состоят из строчных латинских букв.

```ts
function mergeAlternately(word1: string, word2: string): string {
  const result: string[] = []
  for (let i = 0; i < Math.max(word1.length, word2.length); i++) {
    if (i < word1.length) result.push(word1[i])
    if (i < word2.length) result.push(word2[i])
  }
  return result.join("")
}

// Local check:
console.log(mergeAlternately("abc", "pqr"))
console.log(mergeAlternately("ab", "pqrs"))
console.log(mergeAlternately("abcd", "pq"))
```

```md
Example 1:

    Input: word1 = "abc", word2 = "pqr"
    Output: "apbqcr"
    Explanation: The merged string will be merged as so:
      word1:  a   b   c
      word2:    p   q   r
      merged: a p b q c r

Example 2:

    Input: word1 = "ab", word2 = "pqrs"
    Output: "apbqrs"
    Explanation: Notice that as word2 is longer, "rs" is appended to the end.
      word1:  a   b
      word2:    p   q   r   s
      merged: a p b q   r   s

Example 3:

    Input: word1 = "abcd", word2 = "pq"
    Output: "apbqcd"
    Explanation: Notice that as word1 is longer, "cd" is appended to the end.
      word1:  a   b   c   d
      word2:    p   q
      merged: a p b q c   d
```

[[leetcode/Two Pointers/index|two-pointers]]
[[leetcode/Two-Pointers/151-reverse-words-in-a-string]]
[[leetcode/Two-Pointers/345-reverse-vowels-of-a-string]]
#leetcode
