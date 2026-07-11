# 345. Reverse Vowels of a String (Easy) (<https://leetcode.com/problems/reverse-vowels-of-a-string/>)

> Дана строка s, разверните только гласные в строке и верните её.
> Гласные — это 'a', 'e', 'i', 'o' и 'u', они могут встречаться и в нижнем, и в верхнем регистре, а также многократно.
> Ограничения: 1 <= s.length <= 3 * 10^5 s состоит из печатаемых символов ASCII.

```ts
function reverseVowels(s: string): string {
  const chars = s.split("")
  const vowels = "aeiouAEIOU"

  for (let left = 0, right = chars.length - 1; left < right;) {
    if (!vowels.includes(chars[left])) {
      left++
      continue
    }

    if (!vowels.includes(chars[right])) {
      right--
      continue
    }

    const temp = chars[left]
    chars[left] = chars[right]
    chars[right] = temp

    left++
    right--
  }

  return chars.join("")
}

// Local check:
console.log(reverseVowels("IceCreAm"))
console.log(reverseVowels("leetcode"))
```

```md
Example 1:

    Input: s = "IceCreAm"
    Output: "AceCreIm"
    Explanation: The vowels in s are ['I', 'e', 'e', 'A']. On reversing the
    vowels, s becomes "AceCreIm".

Example 2:

    Input: s = "leetcode"
    Output: "leotcede"
```

[[leetcode/Two Pointers/index|two-pointers]]
[[leetcode/Two-Pointers/1768-merge-strings-alternately]]
[[leetcode/Two Pointers/392-is-subsequence|392-is-subsequence]]
#leetcode
