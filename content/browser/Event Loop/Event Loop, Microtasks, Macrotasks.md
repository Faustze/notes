# ⏱ Event Loop, Microtasks, Macrotasks, requestAnimationFrame

## 💡 Core idea

> The Event Loop doesn't execute code. It's a dispatcher: it checks whether the call stack is empty, then moves the next queued task into it.

Two questions this note answers: why does `setTimeout(fn, 0)` always run after all synchronous code *and* all promises? And why does an infinite `Promise.then()` chain freeze the tab dead, while an infinite `requestAnimationFrame` loop doesn't?

---
# 🧭 The participants

1. **Call Stack** — runs synchronous JS line by line. Nothing else runs while it isn't empty.
2. **JS engine (V8, etc.)** — executes only the call stack. It has no built-in concept of `setTimeout`, the DOM, or `fetch` — none of that is part of the ECMAScript spec.
3. **Web APIs** (browser) / **libuv** (Node.js) — a separate part of the runtime that actually counts timers, listens for network/DOM events, and prepares frames.
4. **Macrotask queue** — `setTimeout`, `setInterval`, DOM events, I/O. FIFO; the Event Loop pulls **one task at a time** from it.
5. **Microtask queue** — `Promise.then`, `queueMicrotask`, `MutationObserver`. FIFO, but the Event Loop **drains it completely** before doing anything else.
6. **Event Loop** — the dispatcher itself: in a loop, it checks "is the call stack empty?", pulls the next task, pushes it onto the stack.

---
# 🔑 The golden rule

> After every synchronous task, the Event Loop **fully drains** the microtask queue — including microtasks added while draining is in progress. Only once the queue is empty does it move on (to rendering, or to a single macrotask).

The difference isn't "priority" — it's a different draining strategy: microtasks mean *"finish everything that has piled up, however much that turns out to be"*; a macrotask means *"take exactly one thing and hand control back to the dispatcher"*.

**One full loop iteration:**

```
Call Stack (all synchronous code)
  → drain microtask queue COMPLETELY (even if it refills while draining)
      → requestAnimationFrame callbacks (a snapshot of exactly this frame)
          → Render: Layout → Paint → Composite
              → take ONE macrotask → run it
                  → drain microtask queue again
                      → ... repeat
```

---
# 🎞 requestAnimationFrame

`requestAnimationFrame(cb)` asks the browser to *"run this right before the next frame is painted"*. It's not a timer and gives no guarantee about exact milliseconds — it's tied to the actual screen refresh cycle (~60/sec).

Ordering, with rAF in the mix:

```js
Promise.resolve().then(() => console.log('promise'));
requestAnimationFrame(() => console.log('raf'));
setTimeout(() => console.log('timeout'), 0);

// promise → raf → timeout
```

---
# ❄️ Why infinite Promise.then() freezes the tab, but infinite rAF doesn't

Not a coincidence — the two queues work on fundamentally different mechanics.

**The microtask queue is checked dynamically.** Before every step, the Event Loop asks "is the queue empty?". If the microtask currently running enqueues a new one, that new one joins the queue and runs **in this same pass**. For an infinite chain, the exit condition ("empty") never arrives:

```js
function loop() {
  Promise.resolve().then(loop); // every .then() spawns the next one
}
loop();
// the Event Loop never reaches rendering, macrotasks, or clicks — the tab is dead
```

**The rAF queue for a frame is a snapshot (batch), fixed at the start of that frame's processing.** Anything registered via `requestAnimationFrame(...)` *during* the current batch's execution physically cannot land in that same batch — only in the next frame:

```js
function animate() {
  x++;
  requestAnimationFrame(animate); // goes into the NEXT frame, not this one
}
requestAnimationFrame(animate);
// Render (Layout → Paint → Composite) is guaranteed to happen between frames
```

So infinite recursion through rAF doesn't block the browser: a render always lands between iterations. The key distinction isn't about how fast either callback runs — it's that the microtask queue has no snapshot boundary, and the rAF batch does.

---
# 🧠 In one sentence

> The Event Loop's exit condition for the microtask queue is "empty" — a self-refilling queue never reaches it. The rAF queue instead exits by *snapshot*: what gets added during a batch is deferred to the next one no matter how fast it runs.

[[browser/Event Loop/index|Event Loop & Rendering]]
[[browser/Event Loop/Rendering Pipeline|Rendering Pipeline — what happens after the microtask queue drains]]
#browser
