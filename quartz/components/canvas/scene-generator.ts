import { mulberry32 } from "./dom-utils"
import type { Segment } from "./segment-encoding"

export type SceneVariant = "random" | "colonnade" | "temple" | "arcade" | "statues" | "ruins"

export interface SceneConfig {
  variant: SceneVariant
  seed: number
  nColumns: number
  columnWidth: number
  statueWidth: number
  spacing: number
  leanAmount: number
  pedestalH: number
  capitalH: number
  statueProb: number
  archProb: number
}

export function defaultSceneConfig(): SceneConfig {
  return {
    variant: "random",
    seed: Math.floor(Math.random() * 1e9),
    nColumns: 5,
    columnWidth: 0.026,
    statueWidth: 0.05,
    spacing: 0.4,
    leanAmount: 0.02,
    pedestalH: 0.12,
    capitalH: 0.02,
    statueProb: 0.4,
    archProb: 0.15,
  }
}

export interface GeneratedScene {
  segments: Segment[]
  posScale: number
}

const GROUND = 0.08

/** Небольшой органический разброс поверх конфигурируемого базового значения. */
const jitter = (rng: () => number, amount: number) => (rng() - 0.5) * amount

export function generateScene(config: SceneConfig, aspect: number): GeneratedScene {
  const rng = mulberry32(config.seed)
  const segments: Segment[] = []
  const push = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    widthStart: number,
    widthEnd: number,
    depth: number,
  ) => {
    if (segments.length < 1024) segments.push({ x1, y1, x2, y2, widthStart, widthEnd, depth })
  }

  const left = 0.15
  const right = aspect - 0.15
  const beam = (x0: number, x1: number, y: number, width: number, depth: number) =>
    push(x0, y, x1, y, width, width, depth)

  const column = (cx: number, top: number, cw: number, depth: number, lean: number) => {
    push(cx - cw * 1.6, GROUND + 0.02, cx + cw * 1.6, GROUND + 0.02, cw * 0.6, cw * 0.6, depth) // база
    push(cx, GROUND + 0.05, cx + lean, top - config.capitalH, cw, cw * 0.82, depth) // ствол (сужается)
    push(
      cx - cw * 1.3 + lean,
      top - config.capitalH,
      cx + cw * 1.3 + lean,
      top - config.capitalH,
      cw * 0.6,
      cw * 0.6,
      depth + 0.06,
    ) // капитель
  }

  const statue = (cx: number, depth: number) => {
    const sw = config.statueWidth * (0.9 + rng() * 0.2)
    const pedTop = GROUND + config.pedestalH
    push(cx, GROUND, cx, pedTop, sw * 1.2, sw * 1.05, depth) // постамент
    push(cx - sw * 1.6, pedTop, cx + sw * 1.6, pedTop, sw * 0.4, sw * 0.4, depth) // плита
    const sh = pedTop + 0.3 + rng() * 0.08
    push(cx, pedTop + 0.04, cx + jitter(rng, 0.04), sh, sw * 0.7, sw * 0.85, depth + 0.08) // торс
    push(cx - sw * 1.1, sh, cx + sw * 1.1, sh, sw * 0.45, sw * 0.45, depth + 0.1) // плечи
    push(cx, sh + 0.03, cx + jitter(rng, 0.02), sh + 0.1, sw * 0.5, sw * 0.42, depth + 0.12) // голова
  }

  /** Декоративная арка между двумя опорами; частота регулируется config.archProb. */
  const archBetween = (cx: number, spacingHalf: number, top: number, depth: number) => {
    const archY = top + 0.05
    const archH = 0.05 + spacingHalf * 0.15
    for (let a = 0; a < 5; a++) {
      const a1 = (Math.PI * a) / 5
      const a2 = (Math.PI * (a + 1)) / 5
      push(
        cx - spacingHalf + Math.cos(a1) * spacingHalf,
        archY + Math.sin(a1) * archH,
        cx - spacingHalf + Math.cos(a2) * spacingHalf,
        archY + Math.sin(a2) * archH,
        0.014,
        0.014,
        depth,
      )
    }
  }

  const names: SceneVariant[] = ["colonnade", "temple", "arcade", "statues", "ruins"]
  const variant =
    config.variant === "random" ? names[Math.floor(rng() * names.length)] : config.variant

  const columnStep = () => config.spacing * (0.85 + rng() * 0.3)

  if (variant === "colonnade" || variant === "temple") {
    const top = (variant === "temple" ? 0.55 : 0.68) + rng() * 0.06
    const span = right - left
    const n = Math.max(2, config.nColumns)
    const step = n > 1 ? span / (n - 1) : span
    beam(left - 0.08, right + 0.08, top + 0.03, 0.035, 0.28) // архитрав
    beam(left - 0.12, right + 0.12, top + 0.11, 0.028, 0.24) // карниз
    beam(left - 0.1, right + 0.1, GROUND, 0.04, 0.2) // стилобат
    for (let i = 0; i < n; i++) {
      const cx = left + i * step + jitter(rng, 0.015)
      column(
        cx,
        top,
        config.columnWidth * (0.9 + rng() * 0.2),
        0.15 + rng() * 0.25,
        jitter(rng, config.leanAmount),
      )
      if (i < n - 1 && rng() < config.archProb) {
        archBetween(cx + step / 2, step / 2 - config.columnWidth, top - 0.15, 0.15)
      }
    }
    if (variant === "temple") {
      const mid = (left + right) / 2
      push(left - 0.12, top + 0.15, mid, top + 0.34, 0.022, 0.022, 0.3) // фронтон
      push(mid, top + 0.34, right + 0.12, top + 0.15, 0.022, 0.022, 0.3)
    }
  } else if (variant === "arcade") {
    const n = Math.max(2, config.nColumns)
    const step = (right - left) / n
    const archY = 0.34 + rng() * 0.1
    const archH = 0.2 + rng() * 0.08
    beam(left - 0.08, right + 0.08, archY + archH + 0.14, 0.045, 0.26)
    beam(left - 0.08, right + 0.08, GROUND, 0.035, 0.2)
    for (let i = 0; i <= n; i++) {
      push(
        left + i * step,
        GROUND + 0.03,
        left + i * step,
        archY + 0.04,
        config.columnWidth * 1.2,
        config.columnWidth * 1.1,
        0.2,
      ) // опоры
    }
    for (let i = 0; i < n; i++) {
      const cx = left + (i + 0.5) * step
      const aw = step * 0.5 - 0.03
      for (let a = 0; a < 6; a++) {
        const a1 = (Math.PI * a) / 6
        const a2 = (Math.PI * (a + 1)) / 6
        push(
          cx + Math.cos(a1) * aw,
          archY + Math.sin(a1) * archH,
          cx + Math.cos(a2) * aw,
          archY + Math.sin(a2) * archH,
          0.02,
          0.02,
          0.24,
        )
      }
    }
  } else if (variant === "statues") {
    const n = Math.max(2, config.nColumns)
    const step = n > 1 ? (right - left) / (n - 1) : right - left
    beam(left - 0.1, right + 0.1, GROUND, 0.035, 0.2)
    for (let i = 0; i < n; i++) {
      const cx = left + i * step + jitter(rng, 0.04)
      if (rng() < config.statueProb) statue(cx, 0.18 + rng() * 0.22)
      else
        column(
          cx,
          0.55 + rng() * 0.2,
          config.columnWidth,
          0.18 + rng() * 0.25,
          jitter(rng, config.leanAmount),
        )
    }
  } else {
    // ruins: разрушенные обрубки, упавшие барабаны, редкие целые колонны
    const n = Math.max(3, Math.round((right - left) / columnStep()))
    beam(left - 0.1, right + 0.1, GROUND, 0.035, 0.2)
    for (let i = 0; i < n; i++) {
      const cx = left + (i + rng() * 0.8) * ((right - left) / n)
      const kind = rng()
      if (kind < 0.4) {
        column(
          cx,
          GROUND + 0.2 + rng() * 0.3,
          config.columnWidth * (1.0 + rng() * 0.5),
          0.15 + rng() * 0.3,
          jitter(rng, config.leanAmount * 3),
        )
      } else if (kind < 0.65) {
        push(
          cx,
          GROUND + 0.05,
          cx + 0.12 + rng() * 0.12,
          GROUND + 0.05 + jitter(rng, 0.05),
          config.columnWidth * 1.3,
          config.columnWidth * 1.3,
          0.2 + rng() * 0.2,
        ) // упавший барабан
      } else {
        column(
          cx,
          0.6 + rng() * 0.25,
          config.columnWidth,
          0.2 + rng() * 0.25,
          jitter(rng, config.leanAmount),
        )
      }
    }
  }

  return { segments, posScale: aspect + 2 }
}
