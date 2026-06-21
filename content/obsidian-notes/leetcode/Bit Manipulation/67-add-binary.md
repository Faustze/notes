# 67. Add Binary (Easy) (<https://leetcode.com/problems/add-binary/>)

> Given two binary strings a and b, return their sum as a binary string.
> Constraints: - 1 <= a.length, b.length <= 10^4 - a and b consist only of '0' or '1' characters.
> - Each string does not contain leading zeros except for the zero itself.

```ts
function addBinary(a: string, b: string): string {
  const sum = BigInt("0b" + a) + BigInt("0b" + b);
  return sum.toString(2);
}

// Local check:
console.log(addBinary("11", "1")); // "100"
console.log(addBinary("1010", "1011")); // "10101"
```

```md
Example 1:

    Input: a = "11", b = "1"
    Output: "100"
    Explanation: 11 (binary) = 3, 1 (binary) = 1, 3 + 1 = 4 = 100 (binary)

  Example 2:

    Input: a = "1010", b = "1011"
    Output: "10101"
    Explanation: 1010 (binary) = 10, 1011 (binary) = 11, 10 + 11 = 21 = 10101 (binary)
```
