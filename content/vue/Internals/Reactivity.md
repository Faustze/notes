# ⚡ Vue 3 Reactivity (Proxy + track/trigger + effect)

## 💡 Core idea

> Vue doesn't "watch" data.
> Vue links **(object + property) → (effect functions)** and reruns them when the value changes.

---
# 🧭 Overview

```text
state.count++
   ↓
Proxy.set()
   ↓
trigger()
   ↓
find effects (Set)
   ↓
effect() reruns
   ↓
render / computed / watch
```

---
# 🧠 1. Proxy — intercepting access

Proxy intercepts:

- `get()` → read
- `set()` → write
- `deleteProperty()` → delete
- `has()` → `in` operator
- `ownKeys()` → enumeration (`Object.keys`, `for...in`)

```js
state.count  // get()
state.count++ // set()
```

👉 Proxy = the entry point of reactivity

Vue 2 used `Object.defineProperty` on every property instead, which had real limitations: it couldn't detect new properties being added to an object or array index/length changes without helper methods (`Vue.set`, `this.$set`). Proxy traps the whole object, so **all** of that "just works" in Vue 3.

---
# 🔥 2. effect — the reactive function

```js
effect(() => {
  console.log(state.count)
})
```

👉 Any reactive logic in Vue is really an effect:

- render (the component's render function)
- computed
- watch / watchEffect

Internally, `effect()` wraps your function in a `ReactiveEffect` instance. That instance is what actually gets stored as a subscriber and rerun — not the raw function.

---
# 🧩 3. activeEffect — "who's currently running"

```js
let activeEffect = null
```

While running:

```text
effect starts
↓
activeEffect = this effect
↓
state fields are read inside it
```

Effects can nest (a computed reading inside a render, for example), so Vue actually keeps an **effect stack**, pushing/popping `activeEffect` as effects start and finish, rather than a single global variable in practice.

---
# 🔗 4. track() — subscribing

Called on `get()`:

```js
state.count // Proxy.get → track()
```

```text
track():
activeEffect gets recorded as a subscriber
```

👉 meaning:

> "this effect depends on this property"

---
# ⚡ 5. trigger() — updating

Called on `set()`:

```js
state.count = 1
```

```text
trigger():
find the Set(effect)
→ run all of them
```

For arrays and collections (`Map`/`Set`), `trigger()` also needs to know **what kind** of change happened (`SET`, `ADD`, `DELETE`, `CLEAR`) — adding a new key or changing `length` can affect iteration-based effects (like `for...in` or `Array.map`) even if that exact key was never read directly.

---
# 🧠 6. Dependency structure

## 💥 Vue stores:

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
## 📦 Full structure

```text
WeakMap
 └─ state
     └─ Map
         ├─ count → Set(effects)
         └─ name  → Set(effects)
```

---

# 🧩 Why these exact structures

## WeakMap

- key = the reactive object itself
- auto garbage-collected when the object is no longer referenced elsewhere
  👉 no memory leaks

---
## Map

- stores the object's properties → their dependency sets

---
## Set

- stores effects without duplicates (an effect can appear only once per property, even if the same property is read multiple times inside it)

---
# 🔁 The full reactivity cycle

## 1. Subscription

```text
effect()
→ activeEffect = fn
→ state.count is read
→ track()
→ fn is added to the Set
```

---
## 2. Mutation

```text
state.count++
→ Proxy.set()
→ trigger()
→ Set is looked up
→ effects are invoked
```

---
# 🧠 Summary diagram

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
effect() reruns
```

---
# 💥 Vue Reactivity in one formula

```text
Proxy + effect + track + trigger
= automatic subscription and UI updates
```

---
# 🧠 The essence, in one sentence

> Vue doesn't "watch data" — it builds a dependency graph between properties and functions, and reruns only the parts affected by a change.

---
# 📎 Extra: what the diagram above leaves out

## reactive() vs ref()

- `reactive(obj)` wraps an object in a Proxy directly — deep by default (nested objects are wrapped lazily, on access).
- `ref(value)` wraps a **single value** (including primitives, which Proxy can't intercept) in an object with a `.value` getter/setter that itself calls `track()`/`trigger()`. That's why refs need `.value` in plain JS but get auto-unwrapped in templates and inside `reactive()` objects.
- `shallowReactive` / `shallowRef` skip the deep wrapping — only the top-level access is tracked, useful for large objects or integrating with non-reactive external state.

## computed()

- A computed is itself a `ReactiveEffect`, but a **lazy** one: it doesn't rerun immediately on `trigger()`. Instead it just flips a `dirty` flag to `true`.
- Reading `.value` checks `dirty`: if true, it reruns the getter and caches the result; if false, it returns the cached value without recomputation.
- This is why computed properties are cheaper than methods when read many times between dependency changes.

## watch / watchEffect

- `watchEffect` is essentially `effect()` with automatic dependency tracking, run immediately.
- `watch` tracks only the explicitly given source(s) and, by default, is **lazy** (doesn't run on setup, only on change) and does not auto-track anything read inside the callback body itself — only inside the source getter.
- Both support a `flush` timing option (`pre` / `post` / `sync`) controlling whether the callback runs before, after, or synchronously around component DOM updates.

## Scheduling — why the DOM doesn't update on every single mutation

- Component render effects aren't run synchronously inside `trigger()`. Instead they're pushed into a **job queue** and flushed as a microtask (`Promise.resolve().then(flushJobs)`).
- This means multiple synchronous mutations (`state.a = 1; state.b = 2`) in the same tick only trigger **one** re-render, not two — this is what `nextTick()` waits for.

## readonly / toRaw / markRaw

- `readonly(obj)` wraps an object so `set`/`delete` traps warn and no-op in dev — used to protect state passed down as props.
- `toRaw(proxy)` unwraps a reactive Proxy back to the original object, bypassing tracking — useful for passing data to non-reactive external libraries.
- `markRaw(obj)` tells Vue to never wrap this object in a Proxy at all.

## Cleanup

- Every time an effect reruns, Vue first removes it from all the dependency Sets it was previously subscribed to (`cleanupEffect`), then lets `track()` rebuild the subscriptions from scratch during the new run. This is what allows conditional dependencies (e.g. inside `v-if` branches or ternaries) to correctly stop being tracked once a branch is no longer taken.

[[vue/index|vue]]
[[vue/Internals/Compiler|Compiler — who generates the reactive code]]
#vue
