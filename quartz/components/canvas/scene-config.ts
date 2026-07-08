// Настройки, которые не относятся ни к геометрии колонн (scene-generator),
// ни к ветру (wind-system), ни к рендеру — тон изображения и включение/выключение
// слоёв дерева (trunk/branches/leaves).

export interface ToneConfig {
  contrast: number
  center: number
  goldLo: number
  goldHi: number
  canopy: number
  dither: boolean
}

export function defaultToneConfig(centerFromCss: number): ToneConfig {
  return {
    contrast: 1.6,
    center: centerFromCss,
    goldLo: 0.45,
    goldHi: 0.7,
    canopy: 1.2,
    dither: true,
  }
}

/** Индексы: 0 trunk, 1 branches, 2 (не используется), 3 leaves. */
export interface LayerConfig {
  enabled: [number, number, number, number]
  blur: [number, number, number, number]
  floorMax: [number, number, number]
}

export function defaultLayerConfig(): LayerConfig {
  return {
    enabled: [1, 1, 0, 1],
    blur: [0.0, 0.12, 0.35, 0.45],
    floorMax: [0.1, 0.4, 0.7],
  }
}
