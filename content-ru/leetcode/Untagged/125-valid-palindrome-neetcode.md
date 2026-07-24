# 125. Валидный палиндром (Easy) (<https://leetcode.com/problems/valid-palindrome/>)

> Фраза является палиндромом, если после преобразования всех заглавных букв в строчные и удаления всех неалфавитно-цифровых символов она читается одинаково вперёд и назад.
> Алфавитно-цифровые символы включают буквы и цифры.
> Дана строка s, верните true, если это палиндром, или false в противном случае.
> Ограничения: - 1 <= s.length <= 2 * 10^5 - s состоит только из печатаемых ASCII-символов.

```ts
function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "")
  let left = 0,
    right = cleaned.length - 1

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false
    left++
    right--
  }

  return true
}

// Локальная проверка:
console.log(isPalindrome("Was it a car or a cat I saw?")) // true
console.log(isPalindrome("tab a cat")) // false
console.log(isPalindrome(" ")) // true
console.log(isPalindrome("No lemon, no melon")) // true
```

```md
Пример 1:

    Ввод: s = "A man, a plan, a canal: Panama"
    Вывод: true
    Объяснение: "amanaplanacanalpanama" — палиндром.

Пример 2:

    Ввод: s = "race a car"
    Вывод: false
    Объяснение: "raceacar" не является палиндромом.

Пример 3:

    Ввод: s = " "
    Вывод: true
    Объяснение: Пустая строка является палиндромом.
```

#leetcode
