# 125. Valid Palindrome (Easy) (<https://leetcode.com/problems/valid-palindrome/>)

> A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.
> Alphanumeric characters include letters and numbers.
> Given a string s, return true if it is a palindrome, or false otherwise.
> Constraints: - 1 <= s.length <= 2 * 10^5 - s consists only of printable ASCII characters.

```ts
function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}

// Local check:
console.log(isPalindrome("Was it a car or a cat I saw?")) // true
console.log(isPalindrome("tab a cat")) // false
console.log(isPalindrome(" ")) // true
console.log(isPalindrome("No lemon, no melon")) // true
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
    Explanation: An empty string is a palindrome.
```

#leetcode
