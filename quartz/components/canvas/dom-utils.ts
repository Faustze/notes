// Утилиты для чтения CSS custom properties и размеров контейнера.
// Ничего не знают про дерево/колонны/шейдер — можно использовать в любом виджете.

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "")
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = parseInt(h.slice(0, 6), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export function cssVar(name: string): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name)
  return v && v.trim().startsWith("#") ? hexToRgb(v) : [0, 0, 0]
}

export function cssNum(name: string, fallback: number): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name))
  return isNaN(v) ? fallback : v
}

export function rgbStr(name: string): string {
  return cssVar(name)
    .map((c) => Math.round(c * 255))
    .join(",")
}

export function contentSize(el: HTMLElement): [number, number] {
  const cs = getComputedStyle(el)
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
  return [Math.max(1, el.clientWidth - padX), Math.max(1, el.clientHeight - padY)]
}

/** Детерминированный PRNG (mulberry32). Нужен генератору сцены —
 *  чтобы одна и та же seed давала одну и ту же сцену. */
export function mulberry32(seed: number): () => number {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
