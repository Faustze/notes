# 125. Valid Palindrome (Easy) (<https://leetcode.com/problems/valid-palindrome/>)

<<<<<<< HEAD:content/leetcode/Two Pointers/125-valid-palindrome.md
=======
<!-- [[leetcode/two-pointers]] [[leetcode/two-pointers/151-reverse-words-in-a-string]] -->

>>>>>>> 6c9469eec57d3be0ae42f8972cb5d02841658ed0:content/obsidian-notes/leetcode/Two Pointers/125-valid-palindrome.md
> A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.
> Alphanumeric characters include letters and numbers.
> Given a string s, return true if it is a palindrome, or false otherwise.
> Constraints: - 1 <= s.length <= 2 * 10^5 - s consists only of printable ASCII characters.

```ts
function isPalindrome(s: string): boolean {
  const lc = s.toLocaleLowerCase().replace(/[^a-zA-Z\d]/g, "");
  return lc === lc.split("").reverse().join("");
}
```

```md
Example 1:

    Input: s = "A man, a plan, a canal: Panama"
    Output: true
    Explanation: "amanaplanacanalpanama" is a palindrome.

  Example 2:

    Input: s = "race a car"
    Output: false
    Explanation: "raceacar" is not a palindrome.

  Example 3:

    Input: s = " "
    Output: true
    Explanation: s is an empty string "" after removing non-alphanumeric characters.
    Since an empty string reads the same forward and backward, it is a palindrome.
```
<<<<<<< HEAD:content/leetcode/Two Pointers/125-valid-palindrome.md

[[leetcode/two-pointers]]
[[leetcode/two-pointers/151-reverse-words-in-a-string]]
=======
>>>>>>> 6c9469eec57d3be0ae42f8972cb5d02841658ed0:content/obsidian-notes/leetcode/Two Pointers/125-valid-palindrome.md
