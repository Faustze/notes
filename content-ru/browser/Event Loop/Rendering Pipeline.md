# 🖼 Rendering Pipeline: Parse → Style → Layout → Paint → Composite

## 💡 Основная идея

> Не каждое изменение стиля одинаково дорого. То, что триггерит CSS-свойство — Layout, Paint или просто Composite — определяет, будет ли анимация плавной или начнёт дропать кадры.

---

# 🧭 Полный пайплайн

```
Parse HTML → DOM
Parse CSS  → CSSOM
DOM + CSSOM → Render Tree (excludes display:none)
Render Tree → Layout      (geometry: x, y, width, height)
Layout      → Paint       (pixels: color, text, shadows)
Paint       → Composite   (GPU assembles layers)
```

`element.style.width = '100px'` **не** триггерит layout немедленно. Браузер просто помечает элемент (и часто его поддерево) как «грязный» и откладывает пересчёт до следующей естественной точки рендера — шага, который идёт сразу после того, как опустошается очередь микротасков и отрабатывают колбэки rAF в [[browser/Event Loop/Event Loop|Event Loop]].

Важное различие: **CSSOM** (распарсенные правила из `<style>`/стилшитов) и инлайновый `element.style` (объект `CSSStyleDeclaration`, привязанный к атрибуту `style` одного элемента) — это разные объекты. Запись `el.style.width = ...` никогда не трогает CSSOM — она только помечает грязным этот один элемент.

---

# ⚡ Что триггерит каждый этап

```
Layout:          width/height, top/left/right/bottom, margin/padding,
                  border-width, font-size, display, adding/removing DOM nodes
Paint:            color, background, box-shadow, border-radius, visibility, outline
Composite-only:   transform, opacity
```

## Почему transform/opacity дешёвые

Не потому что _значат_ эти свойства — а из-за того, _где_ они обрабатываются. Если у элемента уже есть свой compositor layer (GPU-текстура — от `will-change`, идущей анимации, `position: fixed`, `<video>`, `<canvas>` и т.д.), изменение `transform`/`opacity` — это просто применение матрицы трансформации или значения альфа-канала к _уже растеризованной_ текстуре, целиком на **compositor thread**. Layout и Paint вообще не запускаются.

- `transform` — это не категория «свойств для анимации», это геометрические трансформации (translate/scale/rotate/skew/matrix), которые оказались дешёвыми в анимации.
- `opacity` — это не яркость, это альфа-канал (0 = невидимо, 1 = непрозрачно).

Все функции `transform` компилируются в одну каноническую форму:

- `translate(x, y)` — сдвиг по осям (`translateX/Y/Z`, `translate3d`)
- `scale(x, y)` — изменение размера (`scale(1.5)` = в 1.5 раза больше); `scaleX`/`scaleY` независимо по каждой оси
- `rotate(angle)` — вращение вокруг точки (по умолчанию: центр элемента); `rotateX/Y/Z` для 3D
- `skew(x-angle, y-angle)` — сдвиг/скос: превращает прямоугольник в параллелограмм
- `matrix(a, b, c, d, e, f)` — низкоуровневая матрица 2×3 affine, в которую компилируется всё вышеперечисленное (`matrix3d` — 4×4, для 3D)

---

# 🧵 Main thread vs Compositor thread

```
Main thread:        JS execution → Style calc → Layout → Paint
Compositor thread:  Composite (transform/opacity)
```

Main thread — это место, где живут [[browser/Event Loop/Event Loop|Event Loop]], call stack и весь JS — Style, Layout и Paint тоже находятся там. Если main thread заблокирован (долгий синхронный JS, forced reflow), всё замирает: скролл, клики и любая анимация на `width`/`top`.

Compositor thread отдельный и не блокируется main thread'ом. К моменту выполнения Composite DOM/CSSOM уже не важны: Paint (на main thread) уже превратил элемент в растеризованную GPU-текстуру. Compositor thread видит только готовые текстуры и матрицы трансформаций — он никогда не трогает дерево DOM. Composite — это не «рисование поверх HTML/CSS-скелета», это «размещение уже готовых картинок на экране».

## Как формируются compositor layers

Слой — это не DOM-элемент, а область пикселей плюс правило её позиционирования. Он состоит из:

- **display list** — записанных Paint команд рисования («залить этот прямоугольник», «нарисовать этот текст») для части DOM в этом слое
- **растеризованной текстуры (bitmap)** — результата выполнения display list, обычно нарезанной на **тайлы** (например, 256×256px) для эффективной перезагрузки
- **свойств трансформации** — матрицы (transform), opacity и позиции в системе координат compositor'а

Этапы формирования:

1. **Style** — вычисляются значения CSS
2. **Layout** — вычисляется геометрия (размеры, позиции)
3. **Построение дерева слоёв (layerization)** — main thread решает, какие элементы получают собственный compositor layer. Триггеры: анимированные `transform`/`opacity`, `will-change`, `position: fixed`, `<video>`, `<canvas>`. Всё остальное рисуется в слой родителя.
4. **Paint** — main thread не рисует пиксели, он записывает display list для каждого слоя
5. **Растеризация** — display list превращается в реальные пиксели, обычно через GPU (например, GPU-бэкенд Skia), часто на отдельных raster-потоках
6. **Compositing** — compositor thread собирает готовые текстуры слоёв в финальный кадр, применяя transform/opacity каждого слоя целиком

Шаги 1–4 выполняются на main thread; шаги 5–6 — на отдельных потоках. Если у элемента, который уже имеет слой, меняется только `transform`/`opacity`, шаги 1–4 полностью пропускаются — сразу к шагу 6 с существующей текстурой.

Почему каждый слой рендерится в свою текстуру: её можно переиспользовать без перерисовки. Если слой уже содержит что-то дорогое (текст, тени, градиенты) и его просто перемещают (`translateX`), нет нужды заново выполнять команды рисования — GPU просто перепозиционирует готовую текстуру. Это также распараллеливает работу: разные слои растеризуются одновременно на разных потоках, и перерисовывается только тот слой, который реально изменился.

---

# 🐢 Forced synchronous layout

Если вы записываете стиль и сразу читаете свойство, зависящее от layout (`offsetWidth`, `getBoundingClientRect()`, `clientHeight`, `scrollTop`, …), браузер обязан пересчитать геометрию **синхронно, прямо на месте**, чтобы дать точный ответ — он не может отложить это до следующей точки рендера.

```js
// bad: 1000 forced layouts, one per iteration
items.forEach((item) => {
  item.style.width = "100px" // write — flags the element dirty
  console.log(item.offsetWidth) // read — forces a full recalculation NOW
})

// good: one layout for the whole batch
items.forEach((item) => {
  item.style.width = "100px"
}) // all writes first
items.forEach((item) => {
  console.log(item.offsetWidth)
}) // all reads — first read recomputes, the rest hit the cache
```

Почему это дорого: layout вычисляет геометрию не только для затронутого элемента — обычно для значительной затронутой части дерева (элементы влияют друг на друга через flexbox, проценты, реflow текста). Это как заново измерять 1000 стен и звать инспектора после каждой, вместо того чтобы позвать его один раз в конце.

---

# 🧠 Одним предложением

> Изменения `width`/`top` стоят Layout + Paint на main thread; изменения `color`/`shadow` стоят только Paint; `transform`/`opacity` пропускают и то, и другое и остаются на compositor thread — это и есть вся причина предпочитать анимировать именно их.

[[browser/Event Loop/index|Event Loop & Rendering]]
[[browser/Event Loop/Event Loop|Event Loop — where render fits into the loop]]
#browser
