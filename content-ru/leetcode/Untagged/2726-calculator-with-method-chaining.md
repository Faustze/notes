# 2726. Calculator with Method Chaining (Easy) (<https://leetcode.com/problems/calculator-with-method-chaining/>)

> Спроектируйте класс Calculator.
> Класс должен предоставлять математические операции сложения, вычитания, умножения, деления и возведения в степень.
> Он также должен позволять выполнять последовательные операции с помощью method chaining.
> Конструктор класса Calculator должен принимать число, которое служит начальным значением result.
> Ваш класс Calculator должен иметь следующие методы: - add: прибавляет переданное число value к result и возвращает обновлённый Calculator.
> - subtract: вычитает переданное число value из result и возвращает обновлённый Calculator.
> - multiply: умножает result на переданное число value и возвращает обновлённый Calculator.
> - divide: делит result на переданное число value и возвращает обновлённый Calculator.
> Если переданное значение равно 0, должна быть выброшена ошибка "Division by zero is not allowed".
> - power: возводит result в степень переданного числа value и возвращает обновлённый Calculator.
> - getResult: возвращает result.
> Решения с точностью 10^-5 от настоящего результата считаются верными.
> Ограничения: - actions — валидный JSON-массив строк - values — валидный JSON-массив чисел - 2 <= actions.length <= 2 * 10^4 - 1 <= values.length <= 2 * 10^4 - 1 - actions[i] — одно из "Calculator", "add", "subtract", "multiply", "divide", "power", "getResult" - Первое действие всегда "Calculator" - Последнее действие всегда "getResult"

```ts
class Calculator {
  value: number

  constructor(value: number) {
    this.value = value
  }

  add(value: number): Calculator {
    this.value += value
    return this
  }

  subtract(value: number): Calculator {
    this.value -= value
    return this
  }

  multiply(value: number): Calculator {
    this.value *= value
    return this
  }

  divide(value: number): Calculator {
    if (value === 0)
      throw new Error('Division by zero is not allowed')
    this.value /= value
    return this
  }

  power(value: number): Calculator {
    this.value **= value
    return this
  }

  getResult(): number {
    return this.value
  }
}

//  Local check:

console.log(new Calculator(10).add(5).subtract(7).getResult()) // 8
console.log(new Calculator(2).multiply(5).power(2).getResult()) // 100
```

```md
Example 1:

    Input:
    actions = ["Calculator", "add", "subtract", "getResult"],
    values = [10, 5, 7]

<!-- [[leetcode/untagged]] [[leetcode/untagged/2725-interval-cancellation]] -->
    Output: 8
    Explanation:
    new Calculator(10).add(5).subtract(7).getResult() // 10 + 5 - 7 = 8

  Example 2:

    Input:
    actions = ["Calculator", "multiply", "power", "getResult"],
    values = [2, 5, 2]
    Output: 100
    Explanation:
    new Calculator(2).multiply(5).power(2).getResult() // (2 * 5) ^ 2 = 100

  Example 3:

    Input:
    actions = ["Calculator", "divide", "getResult"],
    values = [20, 0]
    Output: "Division by zero is not allowed"
    Explanation:
    new Calculator(20).divide(0).getResult() // 20 / 0

    The error should be thrown because we cannot divide by zero.
```

#leetcode
