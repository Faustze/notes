# 345. Reverse Vowels of a String (Easy) (<https://leetcode.com/problems/reverse-vowels-of-a-string/>)

> Дана строка s, нужно перевернуть в ней только гласные буквы и вернуть результат.
> Гласные — это 'a', 'e', 'i', 'o' и 'u', они могут встречаться как в нижнем, так и в верхнем регистре, и более одного раза.
> Ограничения: 1 <= s.length <= 3 * 10^5, s состоит из печатаемых ASCII-символов.

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

// Локальная проверка:
console.log(reverseVowels('IceCreAm'))
console.log(reverseVowels('leetcode'))
```

```md
Пример 1:

    Вход: s = "IceCreAm"
    Выход: "AceCreIm"
    Объяснение: гласные в s — ['I', 'e', 'e', 'A']. После переворота
    гласных s становится "AceCreIm".

  Пример 2:

    Вход: s = "leetcode"
    Выход: "leotcede"
```

[[leetcode/Two Pointers/index|two-pointers]]
[[leetcode/Two-Pointers/1768-merge-strings-alternately]]
[[leetcode/Two Pointers/392-is-subsequence|392-is-subsequence]]
#leetcode
