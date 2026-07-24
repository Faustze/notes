# 125. Валидный палиндром (Easy) (<https://leetcode.com/problems/valid-palindrome/>)

> Фраза является палиндромом, если после приведения всех заглавных букв к строчным и удаления всех не буквенно-цифровых символов она читается одинаково вперёд и назад.
> Буквенно-цифровые символы включают буквы и цифры.
> Дана строка s, верните true, если она является палиндромом, или false в противном случае.
> Ограничения: - 1 <= s.length <= 2 * 10^5 - s состоит только из печатных символов ASCII.

```ts
function isPalindrome(s: string): boolean {
  const lc = s.toLocaleLowerCase().replace(/[^a-zA-Z\d]/g, "");
  return lc === lc.split("").reverse().join("");
}

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

// Локальная проверка:
console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));
console.log(isPalindrome(" "));
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

[[leetcode/Two Pointers/index|two-pointers]]
[[leetcode/Two-Pointers/151-reverse-words-in-a-string]]
[[leetcode/RegExp/easy/125-Valid-Palindrome|та же задача через RegExp]]
#leetcode
