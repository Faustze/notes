# 🔥 Vue Compiler Pipeline (финальная чистая версия для повторения)

## 💡 Главная идея Vue 3

> Vue компилирует `template` в `render()` функцию,  
> которая в runtime создаёт **VNode**,  
> а затем renderer превращает их в DOM через **patch**.
# 🧭 Полная цепочка

```text
TEMPLATE (строка)
   ↓
PARSE
   ↓
Template AST
   ↓
TRANSFORM
   ↓
Optimized AST (with directives resolved + flags)
   ↓
CODEGEN
   ↓
render function (JS code)
   ↓
RUNTIME EXECUTION
   ↓
render(ctx)
   ↓
h() / createVNode()
   ↓
VNode tree
   ↓
patch()
   ↓
Real DOM
```

---

# ⚠️ КЛЮЧЕВОЕ РАЗДЕЛЕНИЕ (самое важное)

## 🟡 COMPILER (build time)

Работает **до выполнения приложения**

### Делает:

- parse → AST
- transform → оптимизация AST
- codegen → JS код

👉 Результат: **строка JS (render function)**

---
## 🔵 RUNTIME (browser time)

Работает **во время выполнения**

### Делает:

- вызывает `render()`
- вызывает `h()` / `createVNode()`
- создаёт VNode
- вызывает `patch()`

👉 Результат: **DOM**

---

# 🧠 ВАЖНОЕ ИСПРАВЛЕНИЕ (про h)

Ты раньше почти правильно сформулировал, но фиксируем точно:

## ❌ Неверно:

> h() выполняется после render

## ✅ Правильно:

> h() выполняется **внутри render во время его выполнения**

```text
render(ctx)
   ↓
h()
   ↓
VNode
```

---
# 🔧 1. PARSE

👉 превращает строку в AST

```text
<div>{{ msg }}</div>
```

→

```js
AST tree (Element / Text / Interpolation)
```

---
# 🔧 2. TRANSFORM (самый “умный” этап)

👉 превращает “HTML AST” в “JS-ready AST”

### Делает:

### ✔ v-if

→ conditional expression

### ✔ v-for

→ renderList()

### ✔ v-model

→ props + event bindings

### ✔ static nodes

→ hoisting

### ✔ patchFlags

→ метки динамики

---
### 💡 Главная идея transform:

> превращает “структуру шаблона” в “структуру будущего JS-кода”

---
# 🔧 3. CODEGEN

👉 AST → JS render function

```js
return function render(_ctx) {
  return createElementVNode('div', null, _ctx.msg)
}
```

---
# ⚡ Важная деталь

👉 здесь **ещё нет VNode**

Есть только:

> JS код, который создаст VNode позже

---
# 🔵 4. RUNTIME: render()

```js
render(ctx)
```

👉 выполняется как обычная JS функция

---
# 🔥 5. h() / createVNode()

```js
h('div', ctx.msg)
```

👉 создаёт:

```js
VNode = { type, props, children }
```

---
# 💥 ВАЖНО

> VNode создаётся ТОЛЬКО в runtime

---
# 🔷 6. PATCH (diffing engine)

```text
old VNode
   vs
new VNode
```

👉 результат:

- обновить текст
- изменить props
- добавить/удалить DOM
- переместить nodes (v-for + key)

---
# 🧠 Оптимизации (очень важно, но чуть уточняем)

## ✔ Hoisting

```js
const _hoisted_1 = createVNode(...)
```

👉 static nodes НЕ пересоздаются

---
## ✔ Patch Flags

👉 бинарные флаги:

- TEXT
- CLASS
- PROPS
- FULL

👉 позволяют skip diff

---
## ✔ Block Tree

👉 runtime хранит только dynamicChildren

```text
не весь DOM tree
а только "что может измениться"
```

---
# ⚠️ ВАЖНОЕ УТОЧНЕНИЕ ПРО dynamicChildren

👉 Vue НЕ “игнорирует статическое дерево при diff”

Он:

> вообще НЕ сравнивает статические узлы

---
# 🔥 Супер-короткая формула Vue

```text
template
 → AST
 → optimized AST
 → render function
 → VNode tree
 → patch
 → DOM
```

---
# 🧠 Самое важное понимание (ядро Vue)

## Vue = 2 мира

### 🟡 Compiler

> “Я превращаю шаблон в код”

### 🔵 Runtime

> “Я выполняю код и обновляю UI”

---
# 💥 Финальный инсайт

> VNode — это не промежуточный шаг между compiler и DOM  
> VNode — это **runtime-формат описания UI**

[[vue/index|vue]]
[[vue/Internals/Reactivity|Reactivity — куда компилятор передаёт эстафету]]
#vue
