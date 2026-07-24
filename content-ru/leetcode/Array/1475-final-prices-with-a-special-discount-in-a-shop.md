# 1475. Итоговые цены с особой скидкой в магазине (Easy) (<https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/>)

> Дан целочисленный массив prices, где prices[i] — цена i-го товара в магазине.
> В магазине действует особая скидка на товары.
> Если вы покупаете i-й товар, вы получите скидку, равную prices[j], где j — минимальный индекс такой, что j > i и prices[j] <= prices[i].
> В противном случае вы не получите никакой скидки.
> Верните целочисленный массив answer, где answer[i] — итоговая цена, которую вы заплатите за i-й товар магазина с учётом особой скидки.
> Ограничения: 1 <= prices.length <= 500 1 <= prices[i] <= 1000

```ts
function finalPrices(prices: number[]): number[] {
  const discounted: number[] = [];
  const stack: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    discounted[i] = prices[i];

    // i является скидкой для тех в стеке, чья цена >= prices[i]
    while (stack.length > 0 && prices[stack.at(-1)!] >= prices[i]) {
      const topIdx = stack.pop()!;
      discounted[topIdx] -= prices[i];
    }
    stack.push(i);
  }
  return discounted;
}

/* v2 */
function finalPrices2(prices: number[]): number[] {
  const answer: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      if (j > i && prices[j] <= prices[i]) {
        answer.push(prices[i] - prices[j]);
        break;
      }
    }
    if (answer.length < i + 1 || answer.length === 0) {
      answer.push(prices[i]);
    }
  }
  return answer;
}

// Локальная проверка:
console.log(finalPrices([8, 4, 6, 2, 3]));
console.log(finalPrices([1, 2, 3, 4, 5]));
console.log(finalPrices([10, 1, 1, 6]));
<!-- [[leetcode/array]] [[leetcode/Array/1470-shuffle-the-array]] [[leetcode/Array/150-evaluate-reverse-polish-notation]] -->
```

```md
Example 1:

    Input: prices = [8,4,6,2,3]
    Output: [4,2,4,2,3]
    Explanation:
      For item 0 with price[0]=8 you will receive a discount equivalent to prices[1]=4,
      therefore, the final price you will pay is 8 - 4 = 4.
      For item 1 with price[1]=4 you will receive a discount equivalent to prices[3]=2,
      therefore, the final price you will pay is 4 - 2 = 2.
      For item 2 with price[2]=6 you will receive a discount equivalent to prices[3]=2,
      therefore, the final price you will pay is 6 - 2 = 4.
      For items 3 and 4 you will not receive any discount at all.

  Example 2:

    Input: prices = [1,2,3,4,5]
    Output: [1,2,3,4,5]
    Explanation: In this case, for all items, you will not receive any discount at all.

  Example 3:

    Input: prices = [10,1,1,6]
    Output: [9,0,1,6]
```

[[leetcode/Array/1470-shuffle-the-array]]
[[leetcode/Array/150-evaluate-reverse-polish-notation]]
[[leetcode/Array/739-daily-temperatures|739 — тот же monotonic stack]]
[[leetcode/Patterns/index|patterns]]
#leetcode
