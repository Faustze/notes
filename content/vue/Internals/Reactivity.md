# Proxy, WeakMap, effect tracking под капотом

# Vue 3 Reactivity Internals

> Цель этого конспекта — понять, **как Vue 3 построил свою систему реактивности** и почему `Proxy`, `WeakMap`, `effect`, `track` и `trigger` работают вместе.

---
### QUICK REMiNDER

**Vue хранит WeakMap, где ключом является reactive Proxy-объект (state),**  
**а значением — Map, которая связывает свойства этого объекта с Set функций (effects), зависящих от этих свойств.**

- track() записывает, какой effect сейчас читает свойство  
- trigger() перезапускает все effect, которые читали это свойство  
- effect просто заново выполняется и перечитывает данные через Proxy

==Vue не управляет данными.==  
==Vue управляет реакцией на изменение данных.==

---
## Общая картина

```text
                state.count++

                      │
                      ▼
                Proxy.set()

                      │
                      ▼
                 trigger()

                      │
                      ▼
          Находим подписчиков (effects)

                      │
                      ▼
              effect() запускается

                      │
                      ▼
           render / computed / watch
```

Во Vue нет магии.

Есть всего несколько основных механизмов:

- Proxy
- WeakMap
- effect
- track
- trigger

Все остальные API (`ref`, `reactive`, `computed`, `watch`) строятся поверх них.

---

# 1. Proxy

## Что такое Proxy?

`Proxy` — это объект-обёртка, который позволяет перехватывать любые операции над объектом.

Например:

```js
const user = {
    name: "John"
}

const proxy = new Proxy(user, {
    get(target, key) {
        console.log("GET", key)
        return target[key]
    },

    set(target, key, value) {
        console.log("SET", key, value)

        target[key] = value

        return true
    }
})
```

Теперь

```js
proxy.name
```

выведет

```
GET name
```

А

```js
proxy.name = "Bob"
```

выведет

```
SET name Bob
```

---

## Что именно умеет Proxy?

Он умеет перехватывать практически всё.

```text
get()
```

Чтение

```js
state.count
```

---

```text
set()
```

Запись

```js
state.count++
```

---

```text
deleteProperty()
```

Удаление

```js
delete state.name
```

---

```text
has()
```

Проверка

```js
"name" in state
```

---

```text
ownKeys()
```

Перебор

```js
Object.keys(state)
```

---

Именно поэтому Vue 3 смог отказаться от `Object.defineProperty`.

---

# 2. Почему одного Proxy недостаточно

Допустим

```js
const state = reactive({
    count: 0
})
```

Хотим автоматически вызвать

```js
render()
```

после изменения.

Можно сделать

```js
set() {
    render()
}
```

Но проблема:

```
Изменился count
↓

render()

Изменился name
↓

render()

Изменился age
↓

render()
```

Даже если `render()` использует только `count`.

Получается огромное количество лишних обновлений.

Нужно понимать:

> Какая функция зависит от какого свойства.

---

# 3. Effect

Во Vue любая реактивная функция называется **Effect**.

Например

```js
effect(() => {

    console.log(state.count)

})
```

или

```js
effect(() => {

    render()

})
```

или

```js
computed(() => {

    state.count * 2

})
```

или

```js
watch(...)
```

Все они внутри используют один и тот же механизм.

---

# 4. activeEffect

Во время выполнения Vue запоминает

> Какая функция сейчас работает.

```js
let activeEffect = null
```

Далее

```js
function effect(fn) {

    activeEffect = fn

    fn()

    activeEffect = null

}
```

Когда запускается

```js
effect(() => {

    console.log(state.count)

})
```

то

```
activeEffect
```

указывает именно на эту функцию.

---

# 5. track()

Теперь происходит магия.

Каждый раз когда происходит

```js
state.count
```

Proxy ловит

```js
get()
```

```js
get(target, key) {

    track(target, key)

    return target[key]

}
```

---

Функция

```js
track()
```

говорит

> Сейчас выполняется effect.
>
> Значит эта функция использует это свойство.

---

Упрощённо

```js
function track(key) {

    if (!activeEffect) return

    deps[key].add(activeEffect)

}
```

Получается

```
effect
     │
     ▼
state.count

     │
     ▼

track()

     │
     ▼

count
↓

effect
```

Теперь Vue знает

```
count

↓

используется этим effect
```

---

# 6. trigger()

Теперь изменение.

Когда

```js
state.count++
```

Proxy вызывает

```js
set()
```

Далее

```js
trigger(target, key)
```

Упрощённо

```js
function trigger(key){

    deps[key].forEach(effect => {

        effect()

    })

}
```

Получается

```
state.count++

↓

Proxy.set()

↓

trigger()

↓

находим effects

↓

запускаем их
```

---

# 7. Почему нужен WeakMap

Если объектов несколько

```js
const user = reactive(...)
const settings = reactive(...)
const cart = reactive(...)
```

Нельзя хранить зависимости так

```js
deps = {

    count: ...

}
```

Потому что

```
user.count

settings.count

cart.count
```

имеют одинаковое имя.

---

Поэтому Vue хранит всё так

```text
WeakMap

↓

Объект

↓

Map

↓

Свойство

↓

Set

↓

Effects
```

Именно это называется

```
targetMap
```

---

# 8. Структура targetMap

Во Vue примерно так

```js
const targetMap = new WeakMap()
```

Внутри

```text
WeakMap

│

├── state1

│      │

│      ▼

│      Map

│      │

│      ├── count

│      │      │

│      │      ▼

│      │    Set(effect1,effect2)

│      │

│      └── name

│             │

│             ▼

│          Set(effect3)

│

└── state2

       │

       ▼

      Map

         │

         └── title

                 │

                 ▼

             Set(effect4)
```

---

# 9. Почему WeakMap?

Почему не обычный Map?

Потому что

```js
const state = reactive(...)
```

может исчезнуть.

Например

```js
let state = reactive(...)

state = null
```

Если использовать

```js
Map
```

объект продолжит жить.

Получится утечка памяти.

---

WeakMap хранит ссылки **слабо**.

Если объект больше нигде не используется

```
state

↓

Garbage Collector

↓

удаляет объект

↓

WeakMap автоматически очищается
```

Именно поэтому Vue использует WeakMap.

---

# 10. Почему Map?

Map хранит свойства объекта.

```
count

name

age

title
```

То есть

```
Object

↓

Map

↓

property

↓

Set
```

---

# 11. Почему Set?

Почему не Array?

Представим

```js
effect(() => {

    console.log(state.count)

    console.log(state.count)

})
```

`track()` вызовется дважды.

Array

```
effect

effect
```

Set

```
effect
```

Без дубликатов.

Поэтому Vue использует Set.

---

# 12. Полная схема

```text
WeakMap

↓

Object

↓

Map

↓

Property

↓

Set

↓

Effects
```

В виде дерева

```text
WeakMap

│

├── state

│      │

│      ▼

│      Map

│      │

│      ├── count

│      │       │

│      │       ▼

│      │    Set

│      │      │

│      │      ├── render()

│      │      ├── computed()

│      │      └── watch()

│      │

│      └── name

│              │

│              ▼

│             Set

│                │

│                └── renderName()
```

---

# 13. Полный цикл реактивности

## Первый запуск

```
effect()

↓

activeEffect = effect

↓

render()

↓

state.count

↓

Proxy.get()

↓

track()

↓

count

↓

Set(effect)
```

---

## Изменение

```
state.count++

↓

Proxy.set()

↓

trigger()

↓

получаем Set(effect)

↓

effect()

↓

render()

↓

DOM обновляется
```

---

# 14. Где используются эти механизмы

## reactive()

Возвращает Proxy.

```js
const state = reactive({
    count: 0
})
```

---

## ref()

Тоже использует реактивность.

Только значение хранится внутри

```js
ref.value
```

---

## computed()

Это специальный effect.

Особенности:

- ленивый запуск
- кеширование
- повторный пересчёт только после trigger()

---

## watch()

Тоже effect.

Но вместо перерисовки вызывает callback.

```js
watch(

    () => state.count,

    (newValue, oldValue) => {

    }

)
```

---

# Главное, что нужно запомнить

```text
Proxy
```

Перехватывает операции над объектом.

---

```text
effect()
```

Регистрирует реактивную функцию.

---

```text
activeEffect
```

Хранит текущую выполняемую функцию.

---

```text
track()
```

Запоминает:

> Какой effect использует какое свойство.

---

```text
trigger()
```

Находит все эффекты, зависящие от свойства, и запускает их.

---

```text
WeakMap
```

Хранит зависимости для каждого реактивного объекта и автоматически очищается сборщиком мусора.

---

```text
Map
```

Хранит зависимости по ключам объекта.

---

```text
Set
```

Хранит уникальные `effect` без повторов.

---

# Финальная схема

```text
                    state.count

                         │
                         ▼

                    Proxy.get()

                         │
                         ▼

                      track()

                         │
                         ▼

activeEffect ─────────────┘

                         │

                    WeakMap

                         │

                     targetMap

                         │

                      Map(key)

                         │

                  count → Set(effect)

                         ▲
                         │

                    trigger()

                         ▲

                    Proxy.set()

                         ▲

                  state.count++
```

## Формула реактивности Vue

```text
Proxy
    ↓
track()
    ↓
WeakMap
    ↓
Map
    ↓
Set
    ↓
effect()
    ↓
trigger()
    ↓
Повторный запуск эффекта
```

> **Запомнить одну мысль:** Vue не "следит за объектами". Он **связывает конкретное свойство конкретного объекта с конкретными функциями (`effect`)**, а затем повторно запускает только те функции, которые действительно зависят от изменённого свойства.