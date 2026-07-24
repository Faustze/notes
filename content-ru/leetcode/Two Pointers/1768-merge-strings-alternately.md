# 1768. Слияние строк через одну (Лёгкая) (<https://leetcode.com/problems/merge-strings-alternately/>)

> Даны две строки word1 и word2.
> Объедините строки, добавляя буквы в чередующемся порядке, начиная с word1.
> Если одна строка длиннее другой, добавьте оставшиеся буквы в конец объединённой строки.
> Верните объединённую строку.
> Ограничения: 1 <= word1.length, word2.length <= 100 word1 и word2 состоят из строчных английских букв.

```ts
function mergeAlternately(word1: string, word2: string): string {
  const result: string[] = []
  for (let i = 0; i < Math.max(word1.length, word2.length); i++) {
    if (i < word1.length)
      result.push(word1[i])
    if (i < word2.length)
      result.push(word2[i])
  }
  return result.join('')
}

// Локальная проверка:
console.log(mergeAlternately('abc', 'pqr'))
console.log(mergeAlternately('ab', 'pqrs'))
console.log(mergeAlternately('abcd', 'pq'))
```

```md
Пример 1:

    Ввод: word1 = "abc", word2 = "pqr"
    Вывод: "apbqcr"
    Объяснение: Объединённая строка формируется так:
      word1:  a   b   c
      word2:    p   q   r
      merged: a p b q c r

  Пример 2:

    Ввод: word1 = "ab", word2 = "pqrs"
    Вывод: "apbqrs"
    Объяснение: Обратите внимание, что так как word2 длиннее, "rs" добавляется в конец.
      word1:  a   b
      word2:    p   q   r   s
      merged: a p b q   r   s

  Пример 3:

    Ввод: word1 = "abcd", word2 = "pq"
    Вывод: "apbqcd"
    Объяснение: Обратите внимание, что так как word1 длиннее, "cd" добавляется в конец.
      word1:  a   b   c   d
      word2:    p   q
      merged: a p b q c   d
```

[[leetcode/Two Pointers/index|two-pointers]]
[[leetcode/Two-Pointers/151-reverse-words-in-a-string]]
[[leetcode/Two-Pointers/345-reverse-vowels-of-a-string]]
#leetcode
