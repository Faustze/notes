# 🖼 Rendering Pipeline: Parse → Style → Layout → Paint → Composite

## 💡 Core idea

> Not every style change is equally expensive. What a CSS property triggers — Layout, Paint, or just Composite — decides whether an animation runs smoothly or drops frames.

---
# 🧭 The full pipeline

```
Parse HTML → DOM
Parse CSS  → CSSOM
DOM + CSSOM → Render Tree (excludes display:none)
Render Tree → Layout      (geometry: x, y, width, height)
Layout      → Paint       (pixels: color, text, shadows)
Paint       → Composite   (GPU assembles layers)
```

`element.style.width = '100px'` does **not** trigger layout immediately. The browser just flags the element (and often its subtree) as "dirty" and defers the recalculation to the next natural render point — the step that sits right after the microtask queue drains and rAF callbacks run in the [[browser/Event Loop/Event Loop|Event Loop]].

Important distinction: **CSSOM** (parsed rules from `<style>`/stylesheets) and inline `element.style` (a `CSSStyleDeclaration` object tied to one element's `style` attribute) are separate objects. Writing `el.style.width = ...` never touches CSSOM — it only dirties that one element.

---
# ⚡ What triggers each stage

```
Layout:          width/height, top/left/right/bottom, margin/padding,
                  border-width, font-size, display, adding/removing DOM nodes
Paint:            color, background, box-shadow, border-radius, visibility, outline
Composite-only:   transform, opacity
```

## Why transform/opacity are cheap

Not because of what the properties *mean* — because of *where* they're processed. If an element already has its own compositor layer (a GPU texture — from `will-change`, a running animation, `position: fixed`, `<video>`, `<canvas>`, etc.), changing `transform`/`opacity` is just applying a transform matrix or an alpha value to an *already-rasterized* texture, entirely on the **compositor thread**. Layout and Paint don't run at all.

- `transform` isn't a category of "animation properties" — it's geometric transforms (translate/scale/rotate/skew/matrix) that happen to be cheap to animate.
- `opacity` isn't brightness — it's the alpha channel (0 = invisible, 1 = opaque).

All `transform` functions compile down to one canonical form:

- `translate(x, y)` — shift along axes (`translateX/Y/Z`, `translate3d`)
- `scale(x, y)` — resize (`scale(1.5)` = 1.5× bigger); `scaleX`/`scaleY` independently per axis
- `rotate(angle)` — rotation around a point (default: element center); `rotateX/Y/Z` for 3D
- `skew(x-angle, y-angle)` — shear: turns a rectangle into a parallelogram
- `matrix(a, b, c, d, e, f)` — the low-level 2×3 affine matrix all of the above compile to (`matrix3d` — 4×4, for 3D)

---
# 🧵 Main thread vs Compositor thread

```
Main thread:        JS execution → Style calc → Layout → Paint
Compositor thread:  Composite (transform/opacity)
```

The main thread is where the [[browser/Event Loop/Event Loop|Event Loop]], the call stack, and all JS run — Style, Layout and Paint live there too. If the main thread is blocked (long synchronous JS, forced reflow), everything stalls: scrolling, clicks, and any animation on `width`/`top`.

The compositor thread is separate and isn't blocked by the main thread. By the time Composite runs, DOM/CSSOM no longer matter: Paint (on the main thread) has already turned the element into a rasterized GPU texture. The compositor thread only ever sees finished textures and transform matrices — it never touches the DOM tree. Composite isn't "drawing over an HTML/CSS skeleton" — it's "place already-finished images on screen".

## How compositor layers form

A layer is not a DOM element — it's a region of pixels plus a rule for positioning it. It's made of:

- a **display list** — Paint's recorded drawing commands ("fill this rectangle", "draw this text") for the part of the DOM in that layer
- a **rasterized texture (bitmap)** — the result of executing the display list, usually cut into **tiles** (e.g. 256×256px) for efficient re-upload
- **transform properties** — the matrix (transform), opacity, and position in the compositor's coordinate system

Formation steps:

1. **Style** — CSS values are computed
2. **Layout** — geometry is computed (sizes, positions)
3. **Layer tree construction (layerization)** — the main thread decides which elements get their own compositor layer. Triggers: animated `transform`/`opacity`, `will-change`, `position: fixed`, `<video>`, `<canvas>`. Everything else paints into its parent's layer.
4. **Paint** — the main thread doesn't draw pixels, it records a display list per layer
5. **Rasterization** — the display list becomes actual pixels, usually via GPU (e.g. Skia's GPU backend), often on separate raster threads
6. **Compositing** — the compositor thread assembles the finished layer textures into the final frame, applying each layer's transform/opacity as a whole

Steps 1–4 run on the main thread; steps 5–6 run on separate threads. If only `transform`/`opacity` changes on an element that already has a layer, steps 1–4 are skipped entirely — straight to step 6 with the existing texture.

Why render each layer into its own texture: it can be reused without repainting. If a layer already holds something expensive (text, shadows, gradients) and it's just being moved (`translateX`), there's no need to re-run the drawing commands — the GPU just repositions the finished texture. It also parallelizes: different layers rasterize on different threads simultaneously, and only the layer that actually changed gets repainted.

---
# 🐢 Forced synchronous layout

If you write a style and immediately read a layout-dependent property (`offsetWidth`, `getBoundingClientRect()`, `clientHeight`, `scrollTop`, …), the browser must recompute geometry **synchronously, right there** to give an accurate answer — it can't defer to the next render point.

```js
// bad: 1000 forced layouts, one per iteration
items.forEach(item => {
  item.style.width = '100px';       // write — flags the element dirty
  console.log(item.offsetWidth);    // read — forces a full recalculation NOW
});

// good: one layout for the whole batch
items.forEach(item => { item.style.width = '100px'; });    // all writes first
items.forEach(item => { console.log(item.offsetWidth); }); // all reads — first read recomputes, the rest hit the cache
```

Why this is expensive: layout doesn't just compute geometry for the touched element — usually for a large affected part of the tree (elements influence each other through flexbox, percentages, text reflow). It's like re-measuring 1000 walls and calling the inspector after each one, instead of calling them once at the end.

---
# 🧠 In one sentence

> `width`/`top` changes cost Layout + Paint on the main thread; `color`/`shadow` changes cost Paint only; `transform`/`opacity` skip both and stay on the compositor thread — that's the entire reason to prefer animating the latter.

[[browser/Event Loop/index|Event Loop & Rendering]]
[[browser/Event Loop/Event Loop|Event Loop — where render fits into the loop]]
#browser
