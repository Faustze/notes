# 242. Valid Anagram (Easy) (<https://leetcode.com/problems/valid-anagram/>)

> Даны две строки s и t, верните true, если t является анаграммой s, и false в противном случае.
> Ограничения: 1 <= s.length, t.length <= 5 * 10^4 s и t состоят из строчных английских букв.
> Дополнительный вопрос: что если входные данные содержат Unicode-символы? Как адаптировать решение под такой случай?

```ts
function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false

    const mp: Map<string, number> = new Map();

    for (const ch of s) {
        mp.set(ch, (mp.get(ch) || 0) + 1)
    }

    for (const ch of t) {
        const curr = mp.get(ch)
        if (!curr) return false
        if (curr === 1) mp.delete(ch)
        else mp.set(ch, curr - 1)
    }

    return true
}

// Local check:
console.log(isAnagram("anagram", "nagaram")) // true
console.log(isAnagram("rat", "car")) // false
```

```md
Example 1:

    Input: s = "anagram", t = "nagaram"
    Output: true
    Explanation: "nagaram" is an anagram of "anagram".

  Example 2:

    Input: s = "rat", t = "car"
    Output: false
    Explanation: "car" is not an anagram of "rat".
```

[[leetcode/Hash Table/index|hash-table]]
[[leetcode/Array/49-group-anagrams|49 — группировка анаграмм]]
#leetcode
