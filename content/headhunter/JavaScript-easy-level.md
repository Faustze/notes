(https://hh.ru/applicant/skills/674/verification_methods?rank=1&kind=theory)

1) **Какой тип данных у переменной let empty = []?**  
==-> array==  

2) **Какой вариант неправильно описывает глобальную область видимости в** JavaScript?  
==-> Глобальные переменные можно объявить внутри функции==  

3) **Что вернет typeof null?**  
==-> "object"==  

4) **Что вернёт typeof "5"?**  
==-> "string"==  

5) **Вы разрабатываете приложение, которое обрабатывает пользовательский ввод. Вам необходимо:**  
- Выполнять код хотя бы один раз перед проверкой условия.  
- Запрашивать у пользователя данные, пока он не введет корректное значение.  
- Обрабатывать динамически изменяющееся условие.  
Какой оператор управления потоком лучше всего использовать?  
==-> do-while==  

5) **Какой утверждение верно о функциях в их области видимости в этом коде?**  
```typescript
let value = 100;
function first() {
  let value = 200;
  function second() {
    return value;
  }
  return second();
}
```
 
==-> second вернет 200==  

7) **Что выведет код?**  
```typescript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    console.log(count);
  }
}
const counter = createCounter();
counter();
counter();

```
 
==-> 1 и 2;==  

8) **Что выведет код?**  
```typescript
console.log([] + []);
```
==-> ""==  

9) **Какой метод массива используется для создания нового массива, применяя функцию к каждому элементу исходного массива?**  
==-> map==  

10) **Что выведет код ?**  
```typescript
console.log(0 == false);
```
==-> true==

[[public/headhunter/index]]
[[headhunter/javascript-middle-level]]