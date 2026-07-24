# 271. Кодирование и декодирование строк (Medium) (<https://neetcode.io/problems/string-encode-and-decode/question?list=neetcode150>)

> Разработайте алгоритм для кодирования списка строк в одну строку.
> Закодированная строка затем декодируется обратно в исходный список строк.
> Ограничения / Примечания: - Входные строки могут содержать любые символы.
>
> - Необходимо обеспечить однозначную обратимость кодирования.

```ts
class Codec {
  constructor() {}

  encode(strs: string[]): string {
    // [length] + "#" + [data]
    let encoded_string = ""
    for (const word of strs) {
      encoded_string += word.length + "#" + word
    }
    return encoded_string
  }

  decode(s: string): string[] {
    const decoded: string[] = []
    let idx = 0

    while (idx < s.length) {
      let length: string = ""
      while (idx < s.length && s[idx] !== "#") {
        length += s[idx]
        idx += 1
      }
      const numLength = Number(length)
      decoded.push(s.slice(idx + 1, idx + numLength + 1))
      idx += numLength + 1
    }
    return decoded
  }
}

// Local check:
const codec = new Codec()

console.log(codec.decode(codec.encode(["hello", "world"])))
console.log(codec.decode(codec.encode(["lint", "code", "love", "you"])))
console.log(codec.decode(codec.encode([""])))
```

```md
Пример 1:

    Вход: ["hello","world"]
    Выход: ["hello","world"]
    Объяснение:
      После кодирования и последующего декодирования мы получаем обратно исходный массив.

Пример 2:

    Вход: ["lint","code","love","you"]
    Выход: ["lint","code","love","you"]
```

#leetcode
