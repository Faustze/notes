// Геометрия сцены (колонны/ветки/статуи) передаётся в шейдер не как атрибуты
// вершин, а как текстура-таблица: каждая строка — один "отрезок с толщиной"
// (капсула), шейдер в цикле идёт по всем строкам и считает distance field.
//
// РАСКЛАДКА СТРОКИ (4 текселя RGBA, соответствует TEXW=4 в шейдере):
//   texel 0 = (x1, y1)         — начало отрезка, каждая координата 16 бит (R,G / B,A)
//   texel 1 = (x2, y2)         — конец отрезка
//   texel 2 = (widthStart, widthEnd) — толщина капсулы на концах
//   texel 3 = (depth, —)       — "глубина" (blur/тень), второй канал не используется
//
// Это единственное место, которое должно совпадать с dec16()/чтением
// текстуры в шейдере (см. shaders.ts). Если меняешь формат — меняй здесь
// и синхронно в GLSL, но логика кодирования отсюда никуда не размазана.

export interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
  widthStart: number
  widthEnd: number
  depth: number
}

export const TEXW = 4
export const MAXSEG = 1024
/** Толщина хранится как 16-битное целое, поделённое на этот масштаб при чтении в шейдере. */
export const WIDTH_SCALE = 0.1

export interface EncodedSegments {
  texData: Uint8Array
  segCount: number
  /** posScale — во сколько раз координаты были растянуты перед упаковкой в [0,1]. */
  posScale: number
}

function encode16(value: number, target: Uint8Array, offset: number) {
  const clamped = Math.max(0, Math.min(65535, Math.round(value * 65535)))
  target[offset] = (clamped >> 8) & 255
  target[offset + 1] = clamped & 255
}

/**
 * Упаковывает список сегментов в RGBA-текстуру нужного формата.
 * posScale подбирается вызывающей стороной так, чтобы все x/y после
 * `(coord + 1) / posScale` попадали в [0, 1] (координаты сцены в диапазоне [-1, aspect+1]).
 */
export function encodeSegments(segments: Segment[], posScale: number): EncodedSegments {
  const segCount = Math.min(segments.length, MAXSEG)
  const texData = new Uint8Array(TEXW * MAXSEG * 4)
  for (let i = 0; i < segCount; i++) {
    const s = segments[i]
    const base = i * TEXW * 4
    encode16((s.x1 + 1) / posScale, texData, base)
    encode16((s.y1 + 1) / posScale, texData, base + 2)
    encode16((s.x2 + 1) / posScale, texData, base + 4)
    encode16((s.y2 + 1) / posScale, texData, base + 6)
    encode16(s.widthStart / WIDTH_SCALE, texData, base + 8)
    encode16(s.widthEnd / WIDTH_SCALE, texData, base + 10)
    encode16(s.depth, texData, base + 12)
  }
  return { texData, segCount, posScale }
}
