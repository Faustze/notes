// Раньше каждый слайдер/тоггл был отдельным вызовом addSlider(...)/addToggle(...)
// с почти одинаковой сигнатурой — десятки строк копипасты, и легко было
// завести слайдер, который ни на что не влияет (см. баг в оригинале).
// Здесь UI строится из массива описаний контролов; связь "контрол -> состояние"
// видна в одном месте (control.get/control.set), что снимает этот класс багов.

export type Control =
  | { kind: "header"; label: string }
  | {
      kind: "slider"
      label: string
      min: number
      max: number
      step: number
      get: () => number
      set: (v: number) => void
    }
  | { kind: "toggle"; label: string; get: () => boolean; set: (v: boolean) => void }
  | { kind: "button"; label: string; onClick: () => void }

export interface ChartHandle {
  update(value: number): void
}

export class DebugPanel {
  readonly el: HTMLDivElement

  constructor() {
    this.el = document.createElement("div")
    this.el.className = "dappled-debug"
    this.el.style.display = "none"
  }

  addChart(label: string, max: number, digits: number, colorRgbFn: () => string): ChartHandle {
    const wrap = document.createElement("div")
    wrap.className = "dappled-chart"
    const caption = document.createElement("span")
    wrap.appendChild(caption)
    const canvas = document.createElement("canvas")
    canvas.width = 206
    canvas.height = 30
    wrap.appendChild(canvas)
    this.el.appendChild(wrap)

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    const N = canvas.width
    const data = new Float32Array(N)
    let head = 0

    return {
      update(value: number) {
        data[head] = value
        head = (head + 1) % N
        caption.textContent = `${label}: ${value.toFixed(digits)}`
        ctx.clearRect(0, 0, N, canvas.height)
        ctx.beginPath()
        for (let x = 0; x < N; x++) {
          const v = Math.min(data[(head + x) % N], max)
          const y = canvas.height - 1 - (v / max) * (canvas.height - 2)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgb(${colorRgbFn()})`
        ctx.lineWidth = 1
        ctx.stroke()
      },
    }
  }

  /** Рендерит секцию контролов. Можно вызывать много раз (по секциям). */
  addControls(controls: Control[]) {
    for (const c of controls) {
      switch (c.kind) {
        case "header": {
          const hd = document.createElement("div")
          hd.className = "dappled-debug-h"
          hd.textContent = c.label
          this.el.appendChild(hd)
          break
        }
        case "slider": {
          const row = document.createElement("label")
          const span = document.createElement("span")
          const input = document.createElement("input")
          input.type = "range"
          input.min = String(c.min)
          input.max = String(c.max)
          input.step = String(c.step)
          input.value = String(c.get())
          const relabel = () => (span.textContent = `${c.label}: ${(+input.value).toFixed(2)}`)
          relabel()
          input.addEventListener("input", () => {
            c.set(parseFloat(input.value))
            relabel()
          })
          row.append(span, input)
          this.el.appendChild(row)
          break
        }
        case "toggle": {
          const row = document.createElement("label")
          row.className = "dappled-debug-toggle"
          const cb = document.createElement("input")
          cb.type = "checkbox"
          cb.checked = c.get()
          cb.addEventListener("change", () => c.set(cb.checked))
          const span = document.createElement("span")
          span.textContent = c.label
          row.append(cb, span)
          this.el.appendChild(row)
          break
        }
        case "button": {
          const b = document.createElement("button")
          b.className = "dappled-debug-btn"
          b.textContent = c.label
          b.addEventListener("click", c.onClick)
          this.el.appendChild(b)
          break
        }
      }
    }
  }

  mount() {
    document.body.appendChild(this.el)
  }

  destroy() {
    this.el.remove()
  }

  get visible() {
    return this.el.style.display !== "none"
  }

  toggle() {
    this.el.style.display = this.visible ? "none" : "block"
  }
}

/** Слушает Konami-код и вызывает onUnlock() при совпадении. Возвращает cleanup. */
export function watchKonamiCode(onUnlock: () => void): () => void {
  const KONAMI = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
  ]
  let seq: string[] = []
  const onKey = (e: KeyboardEvent) => {
    seq.push(e.key)
    if (seq.length > KONAMI.length) seq = seq.slice(-KONAMI.length)
    if (seq.length === KONAMI.length && KONAMI.every((k, i) => seq[i] === k)) {
      onUnlock()
      seq = []
    }
  }
  document.addEventListener("keydown", onKey)
  return () => document.removeEventListener("keydown", onKey)
}
