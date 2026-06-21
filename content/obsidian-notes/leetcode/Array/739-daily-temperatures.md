# 739. Daily Temperatures (Medium) (<https://leetcode.com/problems/daily-temperatures/>)

> Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the i-th day to get a warmer temperature.
> If there is no future day for which this is possible, keep answer[i] == 0 instead.
> git@github.com:Faustze/frontend-study-lab.git Constraints: - 1 <= temperatures.length <= 10^5 - 30 <= temperatures[i] <= 100

```ts
function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer: number[] = new Array(n).fill(0); // по умолчанию 0
  const stack: number[] = []; // храним ИНДЕКСЫ

  for (let i = 0; i < n; i++) {
    // Пока стек не пуст И текущая температура ВЫШЕ температуры на верхушке
    while (stack.length > 0 && temperatures[i] > temperatures[stack.at(-1)!]) {
      const topIdx = stack.pop()!;
      answer[topIdx] = i - topIdx; // расстояние между индексами
    }
    stack.push(i);
  }

  return answer;
}

// Local check:
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // [1,1,4,2,1,1,0,0]
console.log(dailyTemperatures([30, 40, 50, 60])); // [1,1,1,0]
console.log(dailyTemperatures([30, 60, 90])); // [1,1,0]
```

```md
Example 1:

    Input: temperatures = [73,74,75,71,69,72,76,73]
    Output: [1,1,4,2,1,1,0,0]
    Explanation:
    Day 0 (73): next warmer is day 1 (74) -> wait 1 day
    Day 1 (74): next warmer is day 2 (75) -> wait 1 day
    Day 2 (75): next warmer is day 6 (76) -> wait 4 days
    Day 3 (71): next warmer is day 5 (72) -> wait 2 days
    Day 4 (69): next warmer is day 5 (72) -> wait 1 day
    Day 5 (72): next warmer is day 6 (76) -> wait 1 day
    Day 6 (76): no warmer day -> 0
    Day 7 (73): no warmer day -> 0

  Example 2:

    Input: temperatures = [30,40,50,60]
    Output: [1,1,1,0]

  Example 3:

    Input: temperatures = [30,60,90]
    Output: [1,1,0]
```
