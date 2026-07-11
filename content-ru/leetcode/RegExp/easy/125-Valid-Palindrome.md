```md
# 125. Valid Palindrome (https://leetcode.com/problems/valid-palindrome/description/)

Фраза является **палиндромом**, если после приведения всех заглавных букв к строчным и удаления всех не буквенно-цифровых символов она читается одинаково слева направо и справа налево. Буквенно-цифровые символы включают буквы и цифры.

Дана строка `s`, верните `true` _если это **палиндром**, или_ `false` _в противном случае_.
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
//   const lc = s.toLowerCase().replace(/[^a-z0-9]/g, "");
//   let i = 0,
//     j = lc.length - 1;
//   while (i < j) {
//     if (lc[i] !== lc[j]) return false;
//     i++;
//     j--;
//   }
//   return true;
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

[[leetcode/RegExp/easy/index|regexp/easy]]
[[leetcode/RegExp/index|RegExp cheatsheet]]
[[leetcode/Two Pointers/125-valid-palindrome|та же задача через two pointers]]
