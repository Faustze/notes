// Раньше wind/ceiling/parallax жили как отдельные `let` в теле initScene,
// вперемешку с GL-кодом и DOM-обработчиками. Здесь это самостоятельный
// объект с понятным жизненным циклом: onPointerMove/onTilt дают вход,
// update(dt) считает следующий кадр, dispArr — готовый выход для шейдера.

export interface WindConfig {
  sensitivity: number // чем выше, тем слабее реагирует на скорость курсора
  rest: number // "состояние покоя" ветра при отсутствии движения
  gustSpeed: number // множитель скорости порывов
}

/** Смещение (bend/flutter/freq/phase) на слой дерева: trunk, thick, thin, leaves. */
export interface LayerWindParams {
  bend: number[] // 4 значения
  flutter: number[]
  freq: number[]
  phase: number[]
}

export function defaultWindConfig(): WindConfig {
  return { sensitivity: 5, rest: 0.35, gustSpeed: 1 }
}

export function defaultLayerWindParams(): LayerWindParams {
  return {
    bend: [0.0, 0.05, 0.1, 0.36],
    flutter: [0.0, 0.03, 0.08, 0.42],
    freq: [0.0, 0.7, 1.5, 3.2],
    phase: [0.0, 1.0, 2.4, 3.9],
  }
}

const DIR: [number, number] = [0.97, 0.22]

export class WindSystem {
  time = 0
  wind = 0
  parallax = 0
  /** [dx0,dy0, dx1,dy1, dx2,dy2, dx3,dy3] — готово для gl.uniform2fv(uDisp). */
  readonly dispArr = new Float32Array(8)

  private ceiling: number
  private ceilingTarget: number
  private parallaxTarget = 0
  private lastX = 0
  private lastY = 0
  private lastT = 0

  /** Публичные — debug-панель и внешний код правят их напрямую, без гетеров/сеттеров. */
  constructor(
    public config: WindConfig,
    public layers: LayerWindParams,
  ) {
    this.ceiling = config.rest
    this.ceilingTarget = config.rest
    this.wind = config.rest
  }

  onPointerMove(clientX: number, clientY: number, timeStamp: number, viewportWidth: number) {
    if (this.lastT) {
      const dtms = timeStamp - this.lastT
      if (dtms > 0) {
        const speed = Math.hypot(clientX - this.lastX, clientY - this.lastY) / dtms
        this.ceilingTarget = Math.min(
          1,
          Math.max(this.ceilingTarget, speed / this.config.sensitivity),
        )
      }
    }
    this.lastX = clientX
    this.lastY = clientY
    this.lastT = timeStamp
    this.parallaxTarget = (clientX / viewportWidth - 0.5) * 2
  }

  onDeviceTilt(gamma: number | null) {
    if (gamma != null) this.parallaxTarget = Math.max(-1, Math.min(1, gamma / 35))
  }

  private gust(t: number): number {
    const g = this.config.gustSpeed
    return 0.7 + 0.3 * (0.65 * Math.sin(t * 0.27 * g) + 0.35 * Math.sin(t * 0.13 * g + 2.0))
  }

  update(dt: number) {
    this.time += dt
    this.ceilingTarget = Math.max(this.config.rest, this.ceilingTarget * 0.97)
    this.ceiling +=
      (this.ceilingTarget - this.ceiling) * (this.ceilingTarget > this.ceiling ? 0.02 : 0.05)
    this.parallax += (this.parallaxTarget - this.parallax) * 0.08
    this.wind = this.gust(this.time) * this.ceiling

    let s = 0
    for (let i = 0; i < 4; i++) {
      s +=
        this.wind *
        (this.layers.bend[i] +
          this.layers.flutter[i] * Math.sin(this.time * this.layers.freq[i] + this.layers.phase[i]))
      this.dispArr[2 * i] = DIR[0] * s
      this.dispArr[2 * i + 1] = DIR[1] * s
    }
  }
}
