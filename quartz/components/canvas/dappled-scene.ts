// Dappled Canvas — свет сквозь листву на стене, двухтоновый ordered-dither шейдер
// на fullscreen quad (raw WebGL, без зависимостей).
// Основано на https://github.com/jackyzha0/jackyzha0.github.io/blob/v4/quartz/components/scripts/dappledLight.inline.ts
//
// Модель:
//  - сигнал ветра W(t): медленная огибающая порывов (~20-30с), скорость курсора
//    поднимает "потолок", под которым колеблется W.
//  - дерево из 4 слоёв (ствол -> толстые ветки -> тонкие -> листья), смещение
//    накапливается вниз по дереву, у каждого слоя своя эластичность.
//  - у каждого слоя есть `blur` (дистанция лист->стена): рядом = резко и тёмная
//    тень, далеко = мягкая полутень, сильно дизерится. Дизер и есть полутень.
//
// Debug-панель (графики FPS/ветра + живые слайдеры): Konami — стрелки
//   вверх вверх вниз вниз влево вправо влево вправо
//
// Файл — это ТОЛЬКО связывание модулей (wiring). Вся логика — в:
//   scene-generator.ts   геометрия колонн/статуй, управляется SceneConfig
//   wind-system.ts        сигнал ветра/параллакса
//   scene-config.ts        тон изображения + вкл/выкл слоёв дерева
//   segment-encoding.ts   формат текстуры-геометрии (JS<->GLSL контракт)
//   gl-uniforms.ts         схема uniform'ов (устраняет дублирование)
//   debug-panel.ts         декларативный UI для live-тюнинга
//   dom-utils.ts            CSS/DOM хелперы, PRNG

import { VERT, FRAG } from "./shaders"
import { cssVar, cssNum, rgbStr, contentSize } from "./dom-utils"
import { compileProgram, createUniformBinder, type UniformSpec } from "./gl-uniforms"
import { encodeSegments, MAXSEG } from "./segment-encoding"
import { generateScene, defaultSceneConfig, type SceneConfig } from "./scene-generator"
import { WindSystem, defaultWindConfig, defaultLayerWindParams } from "./wind-system"
import {
  defaultToneConfig,
  defaultLayerConfig,
  type ToneConfig,
  type LayerConfig,
} from "./scene-config"
import { DebugPanel, watchKonamiCode, type Control } from "./debug-panel"

const SCALE = 2 // рендерим в 2x меньшем разрешении, чем CSS-размер канваса

export function initScene(container: HTMLElement) {
  const canvas = document.createElement("canvas")
  canvas.className = "dappled-canvas"
  container.appendChild(canvas)

  // отдельная переменная под nullable-результат: narrowing не доживает до
  // хойстящихся function-деклараций ниже, а const gl — уже non-null тип
  const glMaybe = canvas.getContext("webgl", { antialias: false, alpha: false })
  if (!glMaybe) {
    console.error("[dappled-light] no WebGL")
    return
  }
  const gl = glMaybe
  gl.getExtension("OES_standard_derivatives")

  const program = compileProgram(gl, VERT, FRAG)
  gl.useProgram(program)

  const vbo = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const posLoc = gl.getAttribLocation(program, "position")
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  // --- состояние (сгруппировано по модулям, а не по одной большой куче) ---
  const scene: SceneConfig = defaultSceneConfig()
  const tone: ToneConfig = defaultToneConfig(cssNum("--komorebi-center", 0.38))
  const layers: LayerConfig = defaultLayerConfig()
  const wind = new WindSystem(defaultWindConfig(), defaultLayerWindParams())

  let colA = cssVar("--komorebi-light")
  let colMid = cssVar("--komorebi-mid")
  let colB = cssVar("--komorebi-shadow")
  let chartRGB = rgbStr("--secondary")
  const seedXY = [Math.random() * 1000, Math.random() * 1000]

  let bw = 200,
    bh = 60
  let posScale = 12
  let segCount = 0

  const segTex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, segTex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  function rebuildScene() {
    const aspect = bw / Math.max(bh, 1)
    const { segments, posScale: ps } = generateScene(scene, aspect)
    const encoded = encodeSegments(segments, ps)
    segCount = encoded.segCount
    posScale = encoded.posScale
    gl.bindTexture(gl.TEXTURE_2D, segTex)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      4,
      MAXSEG,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      encoded.texData,
    )
  }

  // --- схема uniform'ов: единственное место, где перечислены все uniform'ы ---
  const uniformSpecs: UniformSpec[] = [
    { name: "uTime", kind: "1f", get: () => wind.time },
    { name: "uDisp[0]", kind: "2fv", get: () => wind.dispArr },
    { name: "uResolution", kind: "2f", get: () => [bw, bh] },
    { name: "uColorA", kind: "3f", get: () => colA },
    { name: "uColorMid", kind: "3f", get: () => colMid },
    { name: "uColorB", kind: "3f", get: () => colB },
    { name: "uContrast", kind: "1f", get: () => tone.contrast },
    { name: "uCenter", kind: "1f", get: () => tone.center },
    { name: "uGoldLo", kind: "1f", get: () => tone.goldLo },
    { name: "uGoldHi", kind: "1f", get: () => tone.goldHi },
    { name: "uCanopy", kind: "1f", get: () => tone.canopy },
    { name: "uLayerOn", kind: "4f", get: () => layers.enabled },
    { name: "uBlur", kind: "4f", get: () => layers.blur },
    { name: "uDither", kind: "1f", get: () => (tone.dither ? 1 : 0) },
    { name: "uParallax", kind: "1f", get: () => wind.parallax },
    { name: "uFloor", kind: "3f", get: () => layers.floorMax },
    { name: "uPosScale", kind: "1f", get: () => posScale },
    { name: "uWidScale", kind: "1f", get: () => 0.1 },
    { name: "uSegCount", kind: "1i", get: () => segCount },
    { name: "uLeafGrad", kind: "2f", get: () => [0, 1] },
    { name: "uLeafFall", kind: "1f", get: () => 1.4 },
    { name: "uLeafFollow", kind: "1f", get: () => 0.6 },
    { name: "uTrunkCount", kind: "1f", get: () => 0 },
    { name: "uTrunkX", kind: "2f", get: () => [0.5, 0.5] },
    { name: "uTrunkW", kind: "1f", get: () => 0.018 },
    { name: "uSeed", kind: "2f", get: () => seedXY },
  ]
  const uniforms = createUniformBinder(gl, program, uniformSpecs)
  // uSegTex не входит в схему: сэмплеру нужен bind текстуры + номер юнита,
  // а не значение из состояния — location берём напрямую
  const uSegTexLoc = gl.getUniformLocation(program, "uSegTex")

  function draw() {
    uniforms.apply()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, segTex)
    gl.uniform1i(uSegTexLoc, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  // --- resize ---
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  function resize() {
    const [w, h] = contentSize(container)
    bw = Math.max(1, Math.round(w / SCALE))
    bh = Math.max(1, Math.round(h / SCALE))
    canvas.width = bw
    canvas.height = bh
    canvas.style.width = w + "px"
    canvas.style.height = h + "px"
    gl!.viewport(0, 0, bw, bh)
    rebuildScene()
  }
  resize()
  const ro = new ResizeObserver(() => {
    resize()
    if (reduce) draw()
  })
  ro.observe(container)

  // --- цветовая тема ---
  function syncColors() {
    colA = cssVar("--komorebi-light")
    colMid = cssVar("--komorebi-mid")
    colB = cssVar("--komorebi-shadow")
    tone.center = cssNum("--komorebi-center", 0.38)
    chartRGB = rgbStr("--secondary")
    if (reduce) draw()
  }
  document.addEventListener("themechange", syncColors)

  // --- ввод: курсор поднимает ветер + даёт параллакс, клик — новая сцена ---
  const onPointerMove = (e: PointerEvent) =>
    wind.onPointerMove(e.clientX, e.clientY, e.timeStamp, window.innerWidth)
  window.addEventListener("pointermove", onPointerMove, { passive: true })
  const onTilt = (e: DeviceOrientationEvent) => wind.onDeviceTilt(e.gamma)
  window.addEventListener("deviceorientation", onTilt)

  canvas.style.cursor = "pointer"
  canvas.title = "Клик — новая сцена"
  const onClick = () => {
    scene.seed = Math.floor(Math.random() * 1e9)
    rebuildScene()
    if (reduce) draw()
  }
  canvas.addEventListener("click", onClick)

  // --- debug-панель: декларативный список контролов, напрямую читающих/пишущих
  //     те же объекты (scene/tone/layers/wind), что использует и рендер.
  //     Это то место, где раньше слайдеры "columns"/"spacing"/... не были
  //     привязаны к реальной генерации — теперь они пишут прямо в SceneConfig,
  //     который generateScene() реально использует. ---
  const panel = new DebugPanel()
  const fpsChart = panel.addChart("fps", 80, 0, () => chartRGB)
  const windChart = panel.addChart("wind", 1, 2, () => chartRGB)

  const layerNames = ["ствол", "ветки", "(не исп.)", "листья"] as const
  const layerControls: Control[] = [
    { kind: "header", label: "ветер" },
    {
      kind: "slider",
      label: "чувствительность курсора",
      min: 1,
      max: 15,
      step: 0.5,
      get: () => wind.config.sensitivity,
      set: (v) => (wind.config.sensitivity = v),
    },
    {
      kind: "slider",
      label: "ветер в покое",
      min: 0,
      max: 1,
      step: 0.01,
      get: () => wind.config.rest,
      set: (v) => (wind.config.rest = v),
    },
    {
      kind: "slider",
      label: "скорость порывов",
      min: 0.2,
      max: 3,
      step: 0.05,
      get: () => wind.config.gustSpeed,
      set: (v) => (wind.config.gustSpeed = v),
    },
    { kind: "header", label: "ветви" },
  ]
  for (let i = 0; i < 4; i++) {
    if (i === 2) continue
    layerControls.push(
      {
        kind: "toggle",
        label: layerNames[i],
        get: () => layers.enabled[i] > 0.5,
        set: (on) => (layers.enabled[i] = on ? 1 : 0),
      },
      {
        kind: "slider",
        label: `${layerNames[i]} blur`,
        min: 0,
        max: 1,
        step: 0.02,
        get: () => layers.blur[i],
        set: (v) => (layers.blur[i] = v),
      },
    )
    if (i < 3) {
      layerControls.push({
        kind: "slider",
        label: `${layerNames[i]} floor max`,
        min: 0,
        max: 1,
        step: 0.02,
        get: () => layers.floorMax[i],
        set: (v) => (layers.floorMax[i] = v),
      })
    }
  }
  panel.addControls(layerControls)

  const sceneControls: Control[] = [
    { kind: "header", label: "колонны и статуи" },
    {
      kind: "button",
      label: "новая сцена",
      onClick: () => {
        scene.seed = Math.floor(Math.random() * 1e9)
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "колонны",
      min: 2,
      max: 10,
      step: 1,
      get: () => scene.nColumns,
      set: (v) => {
        scene.nColumns = v
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "ширина колонны",
      min: 0.01,
      max: 0.06,
      step: 0.002,
      get: () => scene.columnWidth,
      set: (v) => {
        scene.columnWidth = v
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "ширина статуи",
      min: 0.02,
      max: 0.1,
      step: 0.002,
      get: () => scene.statueWidth,
      set: (v) => {
        scene.statueWidth = v
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "расстояние",
      min: 0.15,
      max: 0.7,
      step: 0.01,
      get: () => scene.spacing,
      set: (v) => {
        scene.spacing = v
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "наклон",
      min: 0,
      max: 0.08,
      step: 0.002,
      get: () => scene.leanAmount,
      set: (v) => {
        scene.leanAmount = v
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "высота постамента",
      min: 0.02,
      max: 0.25,
      step: 0.005,
      get: () => scene.pedestalH,
      set: (v) => {
        scene.pedestalH = v
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "высота капители",
      min: 0.005,
      max: 0.06,
      step: 0.002,
      get: () => scene.capitalH,
      set: (v) => {
        scene.capitalH = v
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "вероятность статуи",
      min: 0,
      max: 1,
      step: 0.05,
      get: () => scene.statueProb,
      set: (v) => {
        scene.statueProb = v
        rebuildScene()
      },
    },
    {
      kind: "slider",
      label: "вероятность арки",
      min: 0,
      max: 0.5,
      step: 0.05,
      get: () => scene.archProb,
      set: (v) => {
        scene.archProb = v
        rebuildScene()
      },
    },
    { kind: "header", label: "тон и дизер" },
    { kind: "toggle", label: "дизер", get: () => tone.dither, set: (v) => (tone.dither = v) },
    {
      kind: "slider",
      label: "контраст",
      min: 0.5,
      max: 3,
      step: 0.05,
      get: () => tone.contrast,
      set: (v) => (tone.contrast = v),
    },
    {
      kind: "slider",
      label: "яркость",
      min: 0.1,
      max: 0.7,
      step: 0.01,
      get: () => tone.center,
      set: (v) => (tone.center = v),
    },
    {
      kind: "slider",
      label: "начало золота",
      min: 0,
      max: 0.8,
      step: 0.01,
      get: () => tone.goldLo,
      set: (v) => (tone.goldLo = v),
    },
    {
      kind: "slider",
      label: "конец золота",
      min: 0.2,
      max: 0.95,
      step: 0.01,
      get: () => tone.goldHi,
      set: (v) => (tone.goldHi = v),
    },
    {
      kind: "slider",
      label: "канопи",
      min: 0,
      max: 1.5,
      step: 0.05,
      get: () => tone.canopy,
      set: (v) => (tone.canopy = v),
    },
  ]
  panel.addControls(sceneControls)
  panel.mount()

  const stopKonami = watchKonamiCode(() => panel.toggle())

  // --- render loop ---
  let raf = 0
  let running = true
  let prevMs = 0
  let fps = 0
  function loop(ms: number) {
    const dt = prevMs ? Math.min(0.05, (ms - prevMs) / 1000) : 0.016
    prevMs = ms
    wind.update(dt)
    draw()
    fps += ((dt > 0 ? 1 / dt : 0) - fps) * 0.1
    if (panel.visible) {
      fpsChart.update(fps)
      windChart.update(wind.wind)
    }
    if (running) raf = requestAnimationFrame(loop)
  }
  function onVis() {
    if (document.hidden) {
      running = false
      cancelAnimationFrame(raf)
    } else if (!reduce) {
      running = true
      prevMs = 0
      raf = requestAnimationFrame(loop)
    }
  }
  if (reduce) {
    draw()
  } else {
    raf = requestAnimationFrame(loop)
    document.addEventListener("visibilitychange", onVis)
  }

  window.addCleanup(() => {
    running = false
    cancelAnimationFrame(raf)
    ro.disconnect()
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("deviceorientation", onTilt)
    document.removeEventListener("themechange", syncColors)
    document.removeEventListener("visibilitychange", onVis)
    stopKonami()
    panel.destroy()
    gl!.deleteTexture(segTex)
    gl!.getExtension("WEBGL_lose_context")?.loseContext()
    canvas.remove()
  })
}

document.addEventListener("nav", () => {
  const el = document.querySelector(".dappled-scene") as HTMLElement | null
  if (!el || el.dataset.init === "true") return
  el.dataset.init = "true"
  initScene(el)
})
