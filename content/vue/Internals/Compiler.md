# 🔥 Vue Compiler Pipeline (clean version for review)

## 💡 Core idea of Vue 3

> Vue compiles a `template` into a `render()` function,
> which at runtime creates **VNodes**,
> and then the renderer turns them into DOM via **patch**.

# 🧭 The full chain

```text
TEMPLATE (string)
   ↓
PARSE
   ↓
Template AST
   ↓
TRANSFORM
   ↓
Optimized AST (directives resolved + patch flags)
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

# ⚠️ THE KEY SPLIT (most important thing to remember)

## 🟡 COMPILER (build time)

Runs **before the application executes** (usually via a bundler plugin — `@vue/compiler-sfc`, `vue-loader`, `unplugin-vue`).

### What it does:

- parse → AST
- transform → optimize the AST
- codegen → generate JS code

👉 Result: **a JS string (the render function source)**

Vue ships three compiler packages, each with a different job:

- `compiler-core` — platform-agnostic parse/transform/codegen logic
- `compiler-dom` — adds DOM-specific transforms (`v-html`, `v-model` on inputs, event modifiers, `v-show`)
- `compiler-sfc` — compiles `.vue` Single File Components (splits `<template>`, `<script>`/`<script setup>`, `<style>`, handles scoped CSS and `<script setup>` macros like `defineProps`/`defineEmits`)

---
## 🔵 RUNTIME (browser time)

Runs **while the app is executing**.

### What it does:

- calls `render()`
- calls `h()` / `createVNode()`
- creates VNodes
- calls `patch()`

👉 Result: **DOM**

---

# 🧠 IMPORTANT CORRECTION (about `h`)

Common mistake:

## ❌ Wrong:

> `h()` runs after `render`

## ✅ Correct:

> `h()` runs **inside `render`, during its execution**

```text
render(ctx)
   ↓
h()
   ↓
VNode
```

---
# 🔧 1. PARSE

👉 turns the template string into an AST

```text
<div>{{ msg }}</div>
```

→

```js
AST tree (Element / Text / Interpolation)
```

The parser is a small state machine that walks the template character by character and produces nodes such as `ELEMENT`, `TEXT`, `INTERPOLATION`, `COMMENT`, and `ATTRIBUTE`/`DIRECTIVE`.

---
# 🔧 2. TRANSFORM (the "smartest" stage)

👉 turns the "HTML AST" into a "JS-ready AST"

### What it does:

### ✔ v-if

→ conditional expression (`condition ? vnode1 : vnode2`)

### ✔ v-for

→ `renderList()`

### ✔ v-model

→ props + event bindings (e.g. `:value` + `@input`, or `:modelValue` + `@update:modelValue` for components)

### ✔ static nodes

→ hoisting

### ✔ patchFlags

→ dynamic-content markers

---
### 💡 Core idea of transform:

> it converts "template structure" into "future JS-code structure"

Transforms run as a set of **node transform** and **directive transform** plugins (`transformElement`, `transformText`, `vOn`, `vBind`, `vFor`, `vIf`, …), each visiting the AST and mutating/annotating nodes (this is conceptually similar to a Babel plugin pipeline).

---
# 🔧 3. CODEGEN

👉 AST → JS render function

```js
return function render(_ctx) {
  return createElementVNode('div', null, _ctx.msg)
}
```

---
# ⚡ Important detail

👉 there is **no VNode yet** at this stage

There is only:

> JS code that will create a VNode later

---
# 🔵 4. RUNTIME: render()

```js
render(ctx)
```

👉 executes just like a regular JS function

---
# 🔥 5. h() / createVNode()

```js
h('div', ctx.msg)
```

👉 creates:

```js
VNode = { type, props, children }
```

`h()` is just a thin, developer-friendly wrapper around `createVNode()` — it normalizes arguments (children/props can be omitted or reordered) before calling `createVNode` directly.

---
# 💥 IMPORTANT

> A VNode is created ONLY at runtime

---
# 🔷 6. PATCH (the diffing engine)

```text
old VNode
   vs
new VNode
```

👉 result:

- update text
- change props
- add/remove DOM nodes
- move nodes (v-for + key)

The diff algorithm patches children with a two-ended (head/tail) comparison, then falls back to a **longest increasing subsequence (LIS)** algorithm to minimize DOM moves for keyed lists — this is what makes `:key` on `v-for` so important.

---
# 🧠 Optimizations (very important, worth knowing precisely)

## ✔ Hoisting

```js
const _hoisted_1 = createVNode(...)
```

👉 static nodes are **not** recreated on every render — they're created once, outside the render function, and reused by reference.

---
## ✔ Patch Flags

👉 binary flags attached to a VNode telling the runtime exactly what can change, so diffing can skip everything else:

| Flag | Meaning |
|---|---|
| `TEXT` | dynamic text content |
| `CLASS` | dynamic `class` binding |
| `STYLE` | dynamic `style` binding |
| `PROPS` | dynamic props (with a known, static key list) |
| `FULL_PROPS` | dynamic props with dynamic keys — full diff needed |
| `HYDRATE_EVENTS` | has event listeners that need hydration |
| `STABLE_FRAGMENT` | fragment whose children order doesn't change |
| `KEYED_FRAGMENT` | fragment with keyed children (e.g. `v-for` with `:key`) |
| `UNKEYED_FRAGMENT` | fragment with unkeyed children |
| `NEED_PATCH` | non-prop patches needed (e.g. refs, hooks) |
| `DYNAMIC_SLOTS` | slots content can change dynamically |
| `BAIL` | optimization gave up — do a full diff |

👉 they let the runtime **skip** the parts of the diff that provably cannot have changed.

---
## ✔ Block Tree

👉 the runtime only tracks `dynamicChildren`

```text
not the whole DOM tree,
only "what could possibly change"
```

A **block** is a VNode that collects all of its descendant dynamic VNodes into a flat `dynamicChildren` array during creation (`openBlock()` / `closeBlock()`). At patch time, Vue iterates that flat array directly instead of walking the full tree recursively — this is the core trick behind Vue 3's speedup over Vue 2's full-tree virtual DOM diff.

---
# ⚠️ IMPORTANT CLARIFICATION ABOUT dynamicChildren

👉 Vue does **not** "ignore the static tree during diffing"

It:

> does not compare static nodes **at all** — they're skipped entirely, not just cheaply diffed

---
# 🔥 Vue's short formula

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
# 🧠 The single most important insight (Vue's core)

## Vue = 2 worlds

### 🟡 Compiler

> "I turn a template into code"

### 🔵 Runtime

> "I execute code and update the UI"

---
# 💥 Final insight

> A VNode is not an intermediate step between compiler and DOM —
> a VNode **is** the runtime's format for describing UI.

---
# 📎 Extra: Vue 2 vs Vue 3 compiler, briefly

- Vue 2's virtual DOM diff walks and compares the **entire** tree on every update — there's no compile-time knowledge of what's static vs dynamic.
- Vue 3's compiler does static analysis ahead of time (hoisting + patch flags + block tree), so the runtime diff only ever touches nodes that are provably capable of changing. This is why Vue 3 can be faster than Vue 2 even though both use a virtual DOM.
- `<script setup>` (compiled by `compiler-sfc`) additionally lets the template compiler resolve bindings at compile time (inlining them as `_ctx.foo` vs `$setup.foo` vs plain identifiers), which avoids proxy lookups through the render context for many bindings.

[[vue/index|vue]]
[[vue/Internals/Reactivity|Reactivity — where the compiler hands off the baton]]
#vue
