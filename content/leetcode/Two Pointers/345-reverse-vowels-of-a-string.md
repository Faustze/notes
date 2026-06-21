# 345. Reverse Vowels of a String (Easy) (<https://leetcode.com/problems/reverse-vowels-of-a-string/>)

<<<<<<< HEAD:content/leetcode/Two Pointers/345-reverse-vowels-of-a-string.md
=======
<!-- [[leetcode/two-pointers]] [[leetcode/two-pointers/1768-merge-strings-alternately]] -->

>>>>>>> 6c9469eec57d3be0ae42f8972cb5d02841658ed0:content/obsidian-notes/leetcode/Two Pointers/345-reverse-vowels-of-a-string.md
> Given a string s, reverse only all the vowels in the string and return it.
> The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases, more than once.
> Constraints: 1 <= s.length <= 3 * 10^5 s consist of printable ASCII characters.

```ts
function reverseVowels(s: string): string {
  const chars = s.split('')
  const vowels = 'aeiouAEIOU'

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

  return chars.join('')
}

// Local check:
console.log(reverseVowels('IceCreAm'))
console.log(reverseVowels('leetcode'))
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
<<<<<<< HEAD:content/leetcode/Two Pointers/345-reverse-vowels-of-a-string.md

[[leetcode/two-pointers]]\n[[leetcode/two-pointers/1768-merge-strings-alternately]]
=======
>>>>>>> 6c9469eec57d3be0ae42f8972cb5d02841658ed0:content/obsidian-notes/leetcode/Two Pointers/345-reverse-vowels-of-a-string.md
