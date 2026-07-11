(https://hh.ru/applicant/skills/674/verification_methods?rank=2&kind=theory)

1) **How can you find out exactly which element was clicked as part of event delegation on the parent?**  
==-> using event.target==  
(other options: Through window.event.srcElement; Only by manually selecting a selector; via this inside the handler; via event.currentTarget;)  
  
2) **You need to implement an interface localization system. Each interface string should have several translations into different languages. Required functionality:**  
- Storing translations in Russian, English, and other languages  
- Fast lookup of a translation by key and language  
- Ability to update and add new translations  
==-> Create an object where the keys are languages, and the value is an object with string keys and translation values==  
(other options: Use an array where each element is a "key-string, translation" pair; Store everything in one huge JSON string and parse it regularly; Make a global variable for each language and write translations like: en_key: translation; Build a single array of all translations and search it by index;)  
  
3) **Which inheritance concept in JavaScript does the code below demonstrate?**  
```typescript
function A() {}
A.prototype.shared = 'value'
function B() {}
B.prototype = Object.create(A.prototype)
B.prototype.unique = 'another'
const b = new B()
```

==-> Manual prototype chain==  
(other options: Shallow inheritance; Object-level encapsulation; Property inheritance; Formal cloning;)  
  
4) **How can you change an object's prototype in JavaScript?**  
==-> Using Object.setPrototypeOf(obj, prototype)==  
(other options: The prototype is replaced automatically when the constructor is called; only with the help of classes; You need to call prototype.override(); The prototype cannot be changed after creation;)  
  
5) **What will happen when the code executes?**  
```typescript
function createCounter() {
  let count = 0;
  return {
    increment() {
      count++;
      return count;
    }
  };
}  
const counter = createCounter();
console.log(counter.increment());
``` 
==-> The increment method uses a closure to access count and increments it;==  
(other options: Each call to increment returns 1, because count is re-created and incremented by 1 each time; A global variable count is created along with an increment method in counter that increments count; The createCounter function returns nothing; count becomes inaccessible after the first iteration;)  
  
6) **Why can't an arrow function be used as a constructor (with the new operator)?**  
==-> It has no `[[Construct]]` and does not create its own this object;==  
(other options: It doesn't support the new keyword; It inherits the parent's prototype; It always returns undefined; It doesn't accept arguments;)  
  
7) **Which of the following expressions will evaluate to false?**  
==-> 4 = '4'==  
(other options: 'a' < 'z'; 5+2>3; true ! false; 10>2)  
  
8) **When is it appropriate to use setTimeout?**  
==->When you need to artificially shift a function's execution in time within the main queue;==  
(other options: When the called function forms a result based on an external flag; When you need to respond to a user event and save data; When the logic is built around iterative array transformations; When the structure implies multiple loops with predictable execution time;)  
  
9) **What will the expression output?**  
```typescript
let count = 5;
count = ++count + 6;
console.log(count)
```
==->12==  
  
10) **What happens to the original object if it is passed into a function and one of its properties is changed inside that function?**  
==->The original object also changes, because the object is passed by reference;==  
  
11) **A function is declared inside a for loop body via let fn = () => ...; What happens to the variable fn after the loop finishes?**  
==->If the function is declared inside the loop body using let, then the variable fn has block scope;==  
  
12) **Which of the statements is incorrect?**  
- A string can be mutated  
- The type of null is "object"  
- undefined is used when a value is not set  
==->A string can be mutated==

[[headhunter/index]]
[[headhunter/JavaScript-easy-level]]
#hh
