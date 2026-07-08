# ⚡ Vue 3 Reactivity (Proxy + track/trigger + effect)

## 💡 Главная идея

> Vue не отслеживает данные.  
> Vue связывает **(object + property) → (effect-функции)** и перезапускает их при изменении.

---
# 🧭 Общая схема

```text
state.count++
   ↓
Proxy.set()
   ↓
trigger()
   ↓
найти effects (Set)
   ↓
effect() заново выполняется
   ↓
render / computed / watch
```

---
# 🧠 1. Proxy — перехват доступа

Proxy перехватывает:

- `get()` → чтение
- `set()` → запись
- `deleteProperty()` → удаление
- `has()` → `in`
- `ownKeys()` → перебор

```js
state.count  // get()
state.count++ // set()
```

👉 Proxy = точка входа реактивности

---
# 🔥 2. effect — реактивная функция

```js
effect(() => {
  console.log(state.count)
})
```

👉 Любая реактивная логика = effect:

- render
- computed
- watch

---
# 🧩 3. activeEffect — “кто сейчас выполняется”

```js
let activeEffect = null
```

Во время выполнения:

```text
effect запускается
↓
activeEffect = этот effect
↓
внутри читаются state поля
```

---
# 🔗 4. track() — подписка

Вызывается при `get()`:

```js
state.count // Proxy.get → track()
```

```text
track():
activeEffect → записывается как подписчик
```

👉 смысл:

> “этот effect зависит от этого свойства”

---
# ⚡ 5. trigger() — обновление

Вызывается при `set()`:

```js
state.count = 1
```

```text
trigger():
найти Set(effect)
→ вызвать все effects
```

---
# 🧠 6. структура зависимостей

## 💥 Vue хранит:

```text
WeakMap
  ↓
object (state)
  ↓
Map
  ↓
property (count)
  ↓
Set(effect)
```

---
## 📦 Полная структура

```text
WeakMap
 └─ state
     └─ Map
         ├─ count → Set(effects)
         └─ name  → Set(effects)
```

---

# 🧩 Почему именно такие структуры

## WeakMap

- ключ = объект
- авто-очистка GC  
    👉 нет утечек памяти

---
## Map

- хранит свойства объекта

---
## Set

- хранит effects без дублей

---
# 🔁 Полный цикл реактивности

## 1. подписка

```text
effect()
→ activeEffect = fn
→ читается state.count
→ track()
→ записали fn в Set
```

---
## 2. изменение

```text
state.count++
→ Proxy.set()
→ trigger()
→ достали Set
→ вызвали effects
```

---
# 🧠 Итоговая схема

```text
READ:
state.count
  ↓
Proxy.get
  ↓
track()
  ↓
WeakMap → Map → Set → activeEffect

WRITE:
state.count++
  ↓
Proxy.set
  ↓
trigger()
  ↓
Set(effects)
  ↓
effect() rerun
```

---
# 💥 ОДНА ФОРМУЛА Vue Reactivity

```text
Proxy + effect + track + trigger
= автоматическая подписка и обновление UI
```

---
# 🧠 Суть в одной фразе

> Vue не “следит за данными” — он строит граф зависимостей между свойствами и функциями и перезапускает только затронутые части.

[[vue/index|vue]]
[[vue/Internals/Compiler|Compiler — кто генерирует реактивный код]]
#vue
