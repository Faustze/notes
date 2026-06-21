```md
# 125. Valid Palindrome (https://leetcode.com/problems/valid-palindrome/description/)

A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` _if it is a **palindrome**, or_ `false` _otherwise_.
```

```typescript
function isPalindrome(s: string): boolean {
  const lc = s.toLocaleLowerCase().replace(/[^a-zA-Z\d]/g, "");
  return lc === lc.split("").reverse().join("");
}

/**
 * without reverse
 */
// function isPalindrome(s: string): boolean {
//   const lc = s.toLowerCase().replace(/[^a-z0-9]/g, "");
//   let i = 0,
//     j = lc.length - 1;
//   while (i < j) {
//     if (lc[i] !== lc[j]) return false;
//     i++;
//     j--;
//   }
//   return true;
// }
  
// Local check:
console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));
console.log(isPalindrome(" "));
```

```md
Example 1:

Input: s = "A man, a plan, a canal: Panama"
Output:** true
**Explanation:** "amanaplanacanalpanama" is a palindrome.

**Example 2:**

**Input:** s = "race a car"
**Output:** false
**Explanation:** "raceacar" is not a palindrome.

**Example 3:**

**Input:** s = " "
**Output:** true
**Explanation:** s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.
```

<!-- [[leetcode/regexp/easy]] [[leetcode/regexp/RegExp-cheatsheet]] -->