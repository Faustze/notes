(https://hh.ru/applicant/skills/674/verification_methods?rank=1&kind=theory)

1) **What is the data type of the variable let empty = []?**  
==-> array==  

2) **Which option incorrectly describes the global scope in** JavaScript?  
==-> Global variables can be declared inside a function==  

3) **What does typeof null return?**  
==-> "object"==  

4) **What does typeof "5" return?**  
==-> "string"==  

5) **You are developing an application that processes user input. You need to:**  
- Execute the code at least once before checking the condition.  
- Keep asking the user for data until they enter a valid value.  
- Handle a dynamically changing condition.  
Which flow control statement is best to use?  
==-> do-while==  

5) **Which statement about functions and their scope is true for this code?**  
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
 
==-> second will return 200==  

7) **What will the code output?**  
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
 
==-> 1 and 2;==  

8) **What will the code output?**  
```typescript
console.log([] + []);
```
==-> ""==  

9) **Which array method is used to create a new array by applying a function to each element of the source array?**  
==-> map==  

10) **What will the code output?**  
```typescript
console.log(0 == false);
```
==-> true==

[[headhunter/index]]
[[headhunter/JavaScript-middle-level]]
#hh
