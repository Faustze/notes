# 151. Reverse Words in a String (Medium) (<https://leetcode.com/problems/reverse-words-in-a-string/>)

> Дана входная строка s, разверните порядок слов.
> Слово определяется как последовательность непробельных символов.
> Слова в s разделены хотя бы одним пробелом.
> Верните строку из слов в обратном порядке, соединённых одним пробелом.
> Учтите, что s может содержать ведущие или замыкающие пробелы или несколько пробелов между словами.
> Возвращаемая строка должна содержать ровно один пробел между словами.
> Не добавляйте лишних пробелов.
> Ограничения: - 1 <= s.length <= 10^4 - s содержит английские буквы (заглавные и строчные), цифры и пробелы ' '.
> - В s есть хотя бы одно слово.
> Дополнительно: если тип данных строки в вашем языке изменяемый, сможете ли вы решить это на месте с O(1) дополнительной памяти?

```ts
function reverseWords(s: string): string {
  return s.trim().split(/\s+/).reverse().join(" ");
}

// Local check:
console.log(reverseWords("the sky is blue"));
console.log(reverseWords("  hello world  "));
console.log(reverseWords("a good   example"));
```

```md
Example 1:

    Input: s = "the sky is blue"
    Output: "blue is sky the"

  Example 2:

    Input: s = "  hello world  "
    Output: "world hello"
    Explanation: Your reversed string should not contain leading or trailing spaces.

  Example 3:

    Input: s = "a good   example"
    Output: "example good a"
    Explanation: You need to reduce multiple spaces between two words to a single space in the reversed string.
```

[[leetcode/Two Pointers/index|two-pointers]]
[[leetcode/Two-Pointers/125-valid-palindrome]]
[[leetcode/Two-Pointers/1768-merge-strings-alternately]]
#leetcode
