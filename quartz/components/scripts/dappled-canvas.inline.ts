// Dappled Canvas — tree-dappled light on a wall, rendered as a two-tone
// ordered-dither shader on a single fullscreen quad (raw WebGL, no dependency).
// Based on https://github.com/jackyzha0/jackyzha0.github.io/blob/v4/quartz/components/scripts/dappledLight.inline.ts
//
// Model:
//  - one wind signal W(t): a slow ~20-30s gust envelope; cursor speed raises a
//    ceiling that W rides under.
//  - a tree of 4 layers (trunk -> thick -> thin -> leaves). Each reacts to W by
//    its own elasticity; displacement is CUMULATIVE down the tree.
//  - each layer has a `blur` (distance leaf->wall): near = sharp + dark shadow
//    (little dither), far = soft penumbra + faint shadow (heavily dithered).
//    The dither *is* the penumbra.
//
// Debug panel (FPS/wind charts + live sliders): Konami arrows
//   up up down down left right left right

const VERT = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAG = `#extension GL_OES_standard_derivatives : enable

precision highp float;
  #define MAXSEG 1024
  uniform sampler2D uSegTex;
  uniform float uPosScale;
  uniform float uWidScale;
  uniform int uSegCount;
  uniform vec2 uLeafGrad;
  uniform float uLeafFall;
  uniform float uLeafFollow;
  uniform float uTrunkCount;
  uniform vec2 uTrunkX;
  uniform float uTrunkW;
  uniform float uTime;
  uniform vec2 uDisp[4];
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorMid;
  uniform vec3 uColorB;
  uniform float uContrast;
  uniform float uCenter;
  uniform float uGoldLo;
  uniform float uGoldHi;
  uniform float uCanopy;
  uniform vec4 uLayerOn;
  uniform vec4 uBlur;
  uniform float uDither;
  uniform vec2 uSeed;
  uniform float uParallax;
  uniform vec3 uFloor;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.55;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.02 + 7.0; a *= 0.5; }
    return v;
  }
  float ridged(vec2 p){ return 1.0 - abs(2.0 * noise(p) - 1.0); }
  float ridgedFbm(vec2 p){
    float v = 0.0, a = 0.6;
    for (int i = 0; i < 4; i++) { v += a * ridged(p); a *= 0.5; p = p * 1.97 + 3.3; }
    return v;
  }
  float dec16(vec2 c){ return (c.x * 255.0 * 256.0 + c.y * 255.0) / 65535.0; }
  vec2 branchField(vec2 buv){
    buv.x += uParallax * 0.04;
    buv += uDisp[1] * 0.5;
    float d = 1e9;
    float nearDepth = 0.0;
    float rowScale = 1.0 / float(MAXSEG);
    for (int i = 0; i < MAXSEG; i++){
      if (i >= uSegCount) break;
      float row = (float(i) + 0.5) * rowScale;
      vec4 t0 = texture2D(uSegTex, vec2(0.5 / 4.0, row));
      vec4 t1 = texture2D(uSegTex, vec2(1.5 / 4.0, row));
      vec4 t2 = texture2D(uSegTex, vec2(2.5 / 4.0, row));
      vec2 a = vec2(dec16(t0.rg), dec16(t0.ba)) * uPosScale - 1.0;
      vec2 bb = vec2(dec16(t1.rg), dec16(t1.ba)) * uPosScale - 1.0;
      vec2 pa = buv - a, ba = bb - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
      float r = mix(dec16(t2.rg), dec16(t2.ba), h) * uWidScale;
      float dist = length(pa - ba * h) - r;
      if (dist < d){
        d = dist;
        nearDepth = dec16(texture2D(uSegTex, vec2(3.5 / 4.0, row)).rg);
      }
    }
    return vec2(d, nearDepth);
  }
  float branchShadow(float d, float nearDepth){
    float pen = 0.006 + nearDepth * 0.06;
    float shadow = 1.0 - smoothstep(-pen, pen, d);
    float umbra = mix(0.03, 0.34, nearDepth);
    return mix(1.0, umbra, shadow);
  }
  float leafLayer(vec2 buv, float scale, vec2 disp, float b, vec2 seed, float cover){
    buv.x += uParallax * (0.15 + b) * 0.1;
    vec2 p = buv * scale + disp + seed;
    float soft = 0.05 + b * 0.30;
    float floorT = b * 0.38;
    float thr = mix(0.85, 0.48, cover);
    float s = smoothstep(thr + soft, thr - soft, fbm(p));
    return mix(1.0, floorT, s);
  }
  float branchLayer(vec2 buv, float scale, vec2 disp, float thick, float b, vec2 seed, float topRange){
    buv.x += uParallax * (0.15 + b) * 0.1;
    vec2 p = buv * scale + disp + seed;
    p += (vec2(noise(p * 0.5 + 2.1), noise(p * 0.5 + 8.7)) - 0.5) * 0.8;
    mat2 R = mat2(0.86, -0.51, 0.51, 0.86);
    float r = ridgedFbm(R * p * vec2(1.0, 0.35));
    float soft = 0.03 + b * 0.22;
    float s = smoothstep(thick, thick + soft, r);
    float floorT = b * b * topRange;
    return mix(1.0, floorT, s);
  }
  float trunkLayer(vec2 uv, float thick, float b, float topRange){
    if (uTrunkCount < 0.5) return 1.0;
    float lean = (noise(vec2(uTrunkX.x * 41.0, uv.y * 0.6)) - 0.5) * 0.06;
    float x = uv.x + lean + uParallax * 0.015;
    float halfw = uTrunkW;
    float d = abs(x - uTrunkX.x);
    if (uTrunkCount > 1.5) d = min(d, abs(x - uTrunkX.y));
    float s = 1.0 - smoothstep(halfw, halfw + 0.02 + b * 0.1, d);
    float floorT = b * b * topRange;
    return mix(1.0, floorT, s);
  }
  float bayer4(vec2 c){
    int x = int(mod(c.x, 4.0));
    int y = int(mod(c.y, 4.0));
    int i = x + y * 4;
    float t = 5.0;
    if (i==0) t=0.0;
    else if (i==1) t=8.0; else if (i==2) t=2.0; else if (i==3) t=10.0;
    else if (i==4) t=12.0; else if (i==5) t=4.0; else if (i==6) t=14.0; else if (i==7) t=6.0;
    else if (i==8) t=3.0; else if (i==9) t=11.0; else if (i==10) t=1.0; else if (i==11) t=9.0;
    else if (i==12) t=15.0; else if (i==13) t=7.0; else if (i==14) t=13.0;
    return (t + 0.5) / 16.0;
  }
  void main(){
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 buv = vec2(uv.x * aspect, uv.y);
    float t = uTime;
    vec2 bf = branchField(buv);
    float l0 = mix(1.0, trunkLayer(uv, 0.45, uBlur.x, uFloor.x), uLayerOn.x);
    float l1 = mix(1.0, branchShadow(bf.x, bf.y), uLayerOn.y);
    float l2 = 1.0;
    float leafCover = clamp(0.55 + dot(uLeafGrad, uv - 0.5) * uLeafFall, 0.12, 1.0);
    float leafDepth = mix(uBlur.w, clamp(bf.y + 0.2, 0.0, 1.0), uLeafFollow);
    float l3 = mix(1.0, leafLayer(buv, 11.0, uDisp[3], leafDepth, uSeed + vec2(13.0, 89.0), leafCover), uLayerOn.w);
    float canopy = smoothstep(0.3, 0.7, fbm(buv * 0.4 + vec2(t * 0.01, 19.0) + uSeed + vec2(101.0, 57.0)));
    float modulate = 1.0 + (canopy - 0.5) * uCanopy + (1.0 - uv.y) * 0.10 - uv.x * 0.05;
    float light = pow(l0 * l1 * l2 * l3, 0.6) * 1.3 * modulate;
    light = clamp((light - 0.5) * uContrast + uCenter, 0.0, 1.0);
    float bayer = uDither > 0.5 ? bayer4(gl_FragCoord.xy) : 0.5;
    float bayerG = uDither > 0.5 ? bayer4(gl_FragCoord.xy + vec2(2.0, 1.0)) : 0.5;
    float lit = step(bayer, light);
    float goldMix = smoothstep(uGoldLo, uGoldHi, light) * smoothstep(0.015, 0.1, fwidth(light));
    float darkIsGold = step(bayerG, goldMix);
    vec3 dark = darkIsGold > 0.5 ? uColorMid : uColorB;
    vec3 col = lit > 0.5 ? uColorA : dark;
    gl_FragColor = vec4(col, 1.0);
  }
`

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "")
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = parseInt(h.slice(0, 6), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
function cssVar(name: string): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name)
  return v && v.trim().startsWith("#") ? hexToRgb(v) : [0, 0, 0]
}
function cssNum(name: string, fallback: number): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name))
  return isNaN(v) ? fallback : v
}
function rgbStr(name: string): string {
  return cssVar(name).map((c) => Math.round(c * 255)).join(",")
}
function contentSize(el: HTMLElement): [number, number] {
  const cs = getComputedStyle(el)
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
  return [Math.max(1, el.clientWidth - padX), Math.max(1, el.clientHeight - padY)]
}

function initScene(container: HTMLElement) {
  const canvas = document.createElement("canvas")
  canvas.className = "dappled-canvas"
  container.appendChild(canvas)
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false })
  if (!gl) { console.error("[dappled-light] no WebGL"); return }
  gl.getExtension("OES_standard_derivatives")

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
      console.error("[dappled-light] shader:", gl.getShaderInfoLog(sh))
    return sh
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
    console.error("[dappled-light] link:", gl.getProgramInfoLog(prog))
  gl.useProgram(prog)

  const vbo = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const posLoc = gl.getAttribLocation(prog, "position")
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  const loc = (n: string) => gl.getUniformLocation(prog, n)
  const U = {
    uTime: loc("uTime"), uDisp: loc("uDisp[0]"), uResolution: loc("uResolution"),
    uColorA: loc("uColorA"), uColorMid: loc("uColorMid"), uColorB: loc("uColorB"),
    uContrast: loc("uContrast"), uCenter: loc("uCenter"),
    uGoldLo: loc("uGoldLo"), uGoldHi: loc("uGoldHi"), uCanopy: loc("uCanopy"),
    uLayerOn: loc("uLayerOn"), uBlur: loc("uBlur"), uDither: loc("uDither"),
    uSeed: loc("uSeed"), uParallax: loc("uParallax"), uFloor: loc("uFloor"),
    uSegTex: loc("uSegTex"), uPosScale: loc("uPosScale"), uWidScale: loc("uWidScale"),
    uSegCount: loc("uSegCount"), uLeafGrad: loc("uLeafGrad"),
    uLeafFall: loc("uLeafFall"), uLeafFollow: loc("uLeafFollow"),
    uTrunkCount: loc("uTrunkCount"), uTrunkX: loc("uTrunkX"), uTrunkW: loc("uTrunkW"),
  }
  gl.uniform2f(U.uSeed, Math.random() * 1000, Math.random() * 1000)

  const u = {
    contrast: 1.6, center: cssNum("--komorebi-center", 0.38),
    goldLo: 0.45, goldHi: 0.7, canopy: 1.2, dither: 1,
    layerOn: [1, 1, 0, 1],
    blur: [0.0, 0.12, 0.35, 0.45],
    floor: [0.1, 0.4, 0.7],
    sensitivity: 5, rest: 0.35, gustSpeed: 1,
  }

  const MAXSEG = 1024
  const TEXW = 4
  const WIDSCALE = 0.1
  const texData = new Uint8Array(TEXW * MAXSEG * 4)
  let segCount = 0
  let posScale = 12
  let leafGx = 0, leafGy = 1
  let trunkCount = 0, trunkX0 = 0.5, trunkX1 = 0.5, trunkW = 0.018
  const segTex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, segTex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  let sceneSeed = Math.floor(Math.random() * 1e9)
  const scene = {
    nColumns: 5,        // number of columns/statues
    columnWidth: 0.06,  // base width of columns
    statueWidth: 0.08,  // width of statue figures
    spacing: 0.18,      // horizontal spacing between elements
    leanAmount: 0.02,   // how much columns lean (wind sway)
    pedestalH: 0.06,    // height of pedestal
    capitalH: 0.04,     // height of capital (top of column)
    statueProb: 0.4,    // probability a column is replaced by a statue
    archProb: 0.15,     // probability of an arch between two columns
  }
  const mulberry32 = (a: number) => () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const buildSegments = () => {
    const aspect = bw / Math.max(bh, 1)
    const pxPerUnit = bh
    const rng = mulberry32(sceneSeed)
    const segs: number[][] = []

    // Helper: add a segment [x1, y1, x2, y2, wStart, wEnd, depth]
    const seg = (x1: number, y1: number, x2: number, y2: number, ws: number, we: number, d: number) => {
      if (segs.length >= MAXSEG) return
      segs.push([x1, y1, x2, y2, ws, we, d])
    }

    // Generate columns and statues across the canvas
    const totalWidth = scene.nColumns * scene.spacing
    const startX = (aspect - totalWidth) * 0.5 + scene.spacing * 0.5

    for (let i = 0; i < scene.nColumns; i++) {
      if (segs.length >= MAXSEG - 20) break

      const cx = startX + i * scene.spacing + (rng() - 0.5) * 0.02
      const isStatue = rng() < scene.statueProb
      const baseDepth = 0.15 + rng() * 0.35  // varies per column for parallax

      if (isStatue) {
        // === STATUE ===
        const sw = scene.statueWidth * (0.8 + rng() * 0.4)
        const lean = (rng() - 0.5) * scene.leanAmount

        // Pedestal
        const pedY = 0.05
        const pedH = scene.pedestalH * (0.8 + rng() * 0.4)
        seg(cx - sw * 0.6, pedY, cx - sw * 0.55, pedY + pedH, sw * 1.2, sw * 1.1, baseDepth)
        seg(cx + sw * 0.55, pedY, cx + sw * 0.6, pedY + pedH, sw * 1.1, sw * 1.2, baseDepth)

        // Pedestal top slab
        seg(cx - sw * 0.7, pedY + pedH, cx + sw * 0.7, pedY + pedH, sw * 1.4, sw * 1.4, baseDepth)

        // Body (torso) — slightly tapered
        const bodyH = pedY + pedH + 0.22 * (0.8 + rng() * 0.4)
        const bodyLean = lean * 0.5
        seg(cx - sw * 0.35 + bodyLean, pedY + pedH, cx - sw * 0.3 + bodyLean * 1.5, bodyH, sw * 0.7, sw * 0.6, baseDepth + 0.1)
        seg(cx + sw * 0.3 + bodyLean, pedY + pedH, cx + sw * 0.3 + bodyLean * 1.5, bodyH, sw * 0.6, sw * 0.6, baseDepth + 0.1)

        // Shoulders
        const shoulderY = bodyH
        const shoulderW = sw * (0.7 + rng() * 0.3)
        seg(cx - shoulderW * 0.5 + bodyLean * 1.5, shoulderY, cx + shoulderW * 0.5 + bodyLean * 1.5, shoulderY, shoulderW, shoulderW, baseDepth + 0.15)

        // Neck
        const neckY = shoulderY + 0.04
        seg(cx - sw * 0.12 + bodyLean * 1.8, shoulderY, cx - sw * 0.1 + bodyLean * 2, neckY, sw * 0.25, sw * 0.22, baseDepth + 0.2)
        seg(cx + sw * 0.1 + bodyLean * 1.8, shoulderY, cx + sw * 0.1 + bodyLean * 2, neckY, sw * 0.22, sw * 0.22, baseDepth + 0.2)

        // Head
        const headY = neckY + 0.06
        const headR = sw * 0.2
        seg(cx + bodyLean * 2, neckY, cx + bodyLean * 2.2, headY, headR * 2, headR * 2, baseDepth + 0.25)

      } else {
        // === COLUMN ===
        const cw = scene.columnWidth * (0.7 + rng() * 0.6)
        const lean = (rng() - 0.5) * scene.leanAmount
        const colH = 0.7 + rng() * 0.2

        // Base / pedestal
        const baseY = 0.02
        seg(cx - cw * 0.7, baseY, cx - cw * 0.65, baseY + scene.pedestalH, cw * 1.4, cw * 1.3, baseDepth)
        seg(cx + cw * 0.65, baseY, cx + cw * 0.7, baseY + scene.pedestalH, cw * 1.3, cw * 1.4, baseDepth)

        // Shaft (main column body) — slightly tapered with entasis
        const shaftTop = baseY + scene.pedestalH + colH
        const entasis = cw * 0.08  // slight bulge in the middle
        const topCW = cw * 0.85

        // Left side of shaft with entasis
        seg(cx - cw * 0.5, baseY + scene.pedestalH, cx - cw * 0.5 - entasis * 0.3, (baseY + scene.pedestalH + shaftTop) * 0.5, cw, cw * 0.95, baseDepth + 0.05)
        seg(cx - cw * 0.5 - entasis * 0.3, (baseY + scene.pedestalH + shaftTop) * 0.5, cx - topCW * 0.5 + lean, shaftTop, cw * 0.95, topCW, baseDepth + 0.05)

        // Right side of shaft with entasis
        seg(cx + cw * 0.5, baseY + scene.pedestalH, cx + cw * 0.5 + entasis * 0.3, (baseY + scene.pedestalH + shaftTop) * 0.5, cw, cw * 0.95, baseDepth + 0.05)
        seg(cx + cw * 0.5 + entasis * 0.3, (baseY + scene.pedestalH + shaftTop) * 0.5, cx + topCW * 0.5 + lean, shaftTop, cw * 0.95, topCW, baseDepth + 0.05)

        // Capital (top of column) — wider, decorative
        const capW = cw * 1.6
        seg(cx - capW * 0.5 + lean * 0.5, shaftTop, cx - capW * 0.55 + lean, shaftTop + scene.capitalH, capW * 0.9, capW, baseDepth + 0.1)
        seg(cx + capW * 0.5 + lean * 0.5, shaftTop, cx + capW * 0.55 + lean, shaftTop + scene.capitalH, capW * 0.9, capW, baseDepth + 0.1)

        // Abacus (top slab)
        const abacusW = cw * 1.8
        seg(cx - abacusW * 0.5 + lean, shaftTop + scene.capitalH, cx + abacusW * 0.5 + lean, shaftTop + scene.capitalH, abacusW, abacusW, baseDepth + 0.12)
      }

      // Occasional arch between columns
      if (i < scene.nColumns - 1 && rng() < scene.archProb && segs.length < MAXSEG - 10) {
        const nextCx = startX + (i + 1) * scene.spacing + (rng() - 0.5) * 0.02
        const archY = 0.15 + rng() * 0.1
        const archH = 0.25 + rng() * 0.15
        const archW = (nextCx - cx) * 0.5
        const archCX = (cx + nextCx) * 0.5
        const archThickness = scene.columnWidth * 0.3

        // Arch segments (approximated with straight segments)
        const nArchSegs = 6
        for (let a = 0; a < nArchSegs; a++) {
          const t1 = a / nArchSegs
          const t2 = (a + 1) / nArchSegs
          const angle1 = Math.PI * t1
          const angle2 = Math.PI * t2
          const x1 = archCX + Math.cos(angle1) * archW
          const y1 = archY + Math.sin(angle1) * archH
          const x2 = archCX + Math.cos(angle2) * archW
          const y2 = archY + Math.sin(angle2) * archH
          seg(x1, y1, x2, y2, archThickness, archThickness, baseDepth + 0.08)
        }
      }
    }

    segCount = Math.min(segs.length, MAXSEG)
    posScale = aspect + 2
    const enc = (v: number, off: number) => {
      const val = Math.max(0, Math.min(65535, Math.round(v * 65535)))
      texData[off] = (val >> 8) & 255
      texData[off + 1] = val & 255
    }
    texData.fill(0)
    for (let i = 0; i < segCount; i++) {
      const s = segs[i], base = i * TEXW * 4
      enc((s[0] + 1) / posScale, base)
      enc((s[1] + 1) / posScale, base + 2)
      enc((s[2] + 1) / posScale, base + 4)
      enc((s[3] + 1) / posScale, base + 6)
      enc(s[4] / WIDSCALE, base + 8)
      enc(s[5] / WIDSCALE, base + 10)
      enc(s[6], base + 12)
    }
    gl.bindTexture(gl.TEXTURE_2D, segTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TEXW, MAXSEG, 0, gl.RGBA, gl.UNSIGNED_BYTE, texData)
  }

  let colA = cssVar("--komorebi-light")
  let colMid = cssVar("--komorebi-mid")
  let colB = cssVar("--komorebi-shadow")
  let chartRGB = rgbStr("--secondary")
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const SCALE = 2
  let w = 600, h = 180, bw = 200, bh = 60
  const resize = () => {
    ;[w, h] = contentSize(container)
    bw = Math.max(1, Math.round(w / SCALE))
    bh = Math.max(1, Math.round(h / SCALE))
    canvas.width = bw; canvas.height = bh
    canvas.style.width = w + "px"; canvas.style.height = h + "px"
    gl.viewport(0, 0, bw, bh)
    buildSegments()
  }
  resize()
  const ro = new ResizeObserver(() => { resize(); if (reduce) draw() })
  ro.observe(container)

  const syncColors = () => {
    colA = cssVar("--komorebi-light"); colMid = cssVar("--komorebi-mid")
    colB = cssVar("--komorebi-shadow"); u.center = cssNum("--komorebi-center", 0.38)
    chartRGB = rgbStr("--secondary")
    if (reduce) draw()
  }
  document.addEventListener("themechange", syncColors)

  let ceiling = u.rest, ceilingTarget = u.rest
  let parallax = 0, parallaxTarget = 0
  let lastX = 0, lastY = 0, lastT = 0
  const onMove = (e: PointerEvent) => {
    const now = e.timeStamp
    if (lastT) {
      const dtm = now - lastT
      if (dtm > 0) {
        const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dtm
        ceilingTarget = Math.min(1, Math.max(ceilingTarget, speed / u.sensitivity))
      }
    }
    lastX = e.clientX; lastY = e.clientY; lastT = now
    parallaxTarget = (e.clientX / window.innerWidth - 0.5) * 2
  }
  window.addEventListener("pointermove", onMove, { passive: true })
  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.gamma != null) parallaxTarget = Math.max(-1, Math.min(1, e.gamma / 35))
  }
  window.addEventListener("deviceorientation", onTilt)

  const gust = (t: number) => 0.7 + 0.3 * (0.65 * Math.sin(t * 0.27 * u.gustSpeed) + 0.35 * Math.sin(t * 0.13 * u.gustSpeed + 2.0))
  const DIR = [0.97, 0.22]
  const BEND = [0.0, 0.05, 0.1, 0.36]
  const FLUT = [0.0, 0.03, 0.08, 0.42]
  const FREQ = [0.0, 0.7, 1.5, 3.2]
  const FPH = [0.0, 1.0, 2.4, 3.9]
  const dispArr = new Float32Array(8)

  // --- debug panel (Konami toggle) ---
  const panel = document.createElement("div")
  panel.className = "dappled-debug"
  panel.style.display = "none"
  const makeChart = (label: string, max: number, digits: number) => {
    const wrap = document.createElement("div"); wrap.className = "dappled-chart"
    const cap = document.createElement("span"); wrap.appendChild(cap)
    const cv = document.createElement("canvas"); cv.width = 206; cv.height = 30; wrap.appendChild(cv)
    const ctx = cv.getContext("2d") as CanvasRenderingContext2D
    const N = cv.width; const data = new Float32Array(N); let head = 0
    const update = (v: number) => {
      data[head] = v; head = (head + 1) % N
      cap.textContent = `${label}: ${v.toFixed(digits)}`
      ctx.clearRect(0, 0, N, cv.height); ctx.beginPath()
      for (let x = 0; x < N; x++) {
        const val = Math.min(data[(head + x) % N], max)
        const y = cv.height - 1 - (val / max) * (cv.height - 2)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgb(${chartRGB})`; ctx.lineWidth = 1; ctx.stroke()
    }
    return { wrap, update }
  }
  const fpsChart = makeChart("fps", 80, 0), windChart = makeChart("wind", 1, 2)
  panel.appendChild(fpsChart.wrap); panel.appendChild(windChart.wrap)

  const addHeader = (text: string) => { const hd = document.createElement("div"); hd.className = "dappled-debug-h"; hd.textContent = text; panel.appendChild(hd) }
  const addSlider = (label: string, min: number, max: number, st: number, get: () => number, set: (v: number) => void) => {
    const row = document.createElement("label"), span = document.createElement("span"), input = document.createElement("input")
    input.type = "range"; input.min = String(min); input.max = String(max); input.step = String(st); input.value = String(get())
    const relabel = () => (span.textContent = `${label}: ${(+input.value).toFixed(2)}`)
    relabel()
    input.addEventListener("input", () => { set(parseFloat(input.value)); relabel() })
    row.append(span, input); panel.appendChild(row)
  }
  const addToggle = (label: string, get: () => boolean, set: (on: boolean) => void) => {
    const row = document.createElement("label"); row.className = "dappled-debug-toggle"
    const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = get()
    cb.addEventListener("change", () => set(cb.checked))
    const span = document.createElement("span"); span.textContent = label
    row.append(cb, span); panel.appendChild(row)
  }
  const addButton = (label: string, onClick: () => void) => { const b = document.createElement("button"); b.className = "dappled-debug-btn"; b.textContent = label; b.addEventListener("click", onClick); panel.appendChild(b) }
  const regen = () => { buildSegments(); if (reduce) draw() }

  addHeader("wind")
  addSlider("cursor sensitivity", 1, 15, 0.5, () => u.sensitivity, (v) => (u.sensitivity = v))
  addSlider("resting wind", 0, 1, 0.01, () => u.rest, (v) => (u.rest = v))
  addSlider("gust speed", 0.2, 3, 0.05, () => u.gustSpeed, (v) => (u.gustSpeed = v))
  addHeader("branches")
  const LNAME = ["trunk", "branches", "(unused)", "leaves"]
  for (let i = 0; i < 4; i++) {
    const k = i; if (k === 2) continue
    addToggle(LNAME[k], () => u.layerOn[k] > 0.5, (on) => (u.layerOn[k] = on ? 1 : 0))
    addSlider(`${LNAME[k]} blur`, 0, 1, 0.02, () => u.blur[k], (v) => (u.blur[k] = v))
    if (k < 3) addSlider(`${LNAME[k]} floor max`, 0, 1, 0.02, () => u.floor[k], (v) => (u.floor[k] = v))
    addSlider(`${LNAME[k]} bend`, 0, 0.5, 0.005, () => BEND[k], (v) => (BEND[k] = v))
    addSlider(`${LNAME[k]} flutter`, 0, 0.5, 0.005, () => FLUT[k], (v) => (FLUT[k] = v))
    addSlider(`${LNAME[k]} flutter spd`, 0, 5, 0.1, () => FREQ[k], (v) => (FREQ[k] = v))
  }
  addHeader("columns & statues")
  addButton("reshuffle scene", () => { sceneSeed = Math.floor(Math.random() * 1e9); regen() })
  addSlider("columns", 2, 10, 1, () => scene.nColumns, (v) => { scene.nColumns = v; regen() })
  addSlider("column width", 0.02, 0.15, 0.005, () => scene.columnWidth, (v) => { scene.columnWidth = v; regen() })
  addSlider("statue width", 0.03, 0.2, 0.005, () => scene.statueWidth, (v) => { scene.statueWidth = v; regen() })
  addSlider("spacing", 0.08, 0.4, 0.01, () => scene.spacing, (v) => { scene.spacing = v; regen() })
  addSlider("lean amount", 0, 0.08, 0.002, () => scene.leanAmount, (v) => { scene.leanAmount = v; regen() })
  addSlider("pedestal h", 0.02, 0.15, 0.005, () => scene.pedestalH, (v) => { scene.pedestalH = v; regen() })
  addSlider("capital h", 0.01, 0.1, 0.002, () => scene.capitalH, (v) => { scene.capitalH = v; regen() })
  addSlider("statue probability", 0, 1, 0.05, () => scene.statueProb, (v) => { scene.statueProb = v; regen() })
  addSlider("arch probability", 0, 0.5, 0.05, () => scene.archProb, (v) => { scene.archProb = v; regen() })
  addHeader("tone & dither")
  addToggle("dither", () => u.dither > 0.5, (on) => (u.dither = on ? 1 : 0))
  addSlider("contrast", 0.5, 3, 0.05, () => u.contrast, (v) => (u.contrast = v))
  addSlider("brightness", 0.1, 0.7, 0.01, () => u.center, (v) => (u.center = v))
  addSlider("gold start", 0, 0.8, 0.01, () => u.goldLo, (v) => (u.goldLo = v))
  addSlider("gold end", 0.2, 0.95, 0.01, () => u.goldHi, (v) => (u.goldHi = v))
  addSlider("canopy", 0, 1.5, 0.05, () => u.canopy, (v) => (u.canopy = v))
  document.body.appendChild(panel)

  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"]
  let seq: string[] = []
  const onKey = (e: KeyboardEvent) => {
    seq.push(e.key)
    if (seq.length > KONAMI.length) seq = seq.slice(-KONAMI.length)
    if (seq.length === KONAMI.length && KONAMI.every((kk, ii) => seq[ii] === kk)) {
      panel.style.display = panel.style.display === "none" ? "block" : "none"; seq = []
    }
  }
  document.addEventListener("keydown", onKey)

  // --- render ---
  let tReal = 0, wind = u.rest
  const draw = () => {
    gl.uniform1f(U.uTime, tReal)
    gl.uniform2f(U.uResolution, bw, bh)
    gl.uniform2fv(U.uDisp, dispArr)
    gl.uniform3f(U.uColorA, colA[0], colA[1], colA[2])
    gl.uniform3f(U.uColorMid, colMid[0], colMid[1], colMid[2])
    gl.uniform3f(U.uColorB, colB[0], colB[1], colB[2])
    gl.uniform1f(U.uContrast, u.contrast)
    gl.uniform1f(U.uCenter, u.center)
    gl.uniform1f(U.uGoldLo, u.goldLo)
    gl.uniform1f(U.uGoldHi, u.goldHi)
    gl.uniform1f(U.uCanopy, u.canopy)
    gl.uniform4f(U.uLayerOn, u.layerOn[0], u.layerOn[1], u.layerOn[2], u.layerOn[3])
    gl.uniform4f(U.uBlur, u.blur[0], u.blur[1], u.blur[2], u.blur[3])
    gl.uniform1f(U.uDither, u.dither)
    gl.uniform1f(U.uParallax, parallax)
    gl.uniform3f(U.uFloor, u.floor[0], u.floor[1], u.floor[2])
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, segTex)
    gl.uniform1i(U.uSegTex, 0)
    gl.uniform1f(U.uPosScale, posScale)
    gl.uniform1f(U.uWidScale, WIDSCALE)
    gl.uniform1i(U.uSegCount, segCount)
    gl.uniform2f(U.uLeafGrad, leafGx, leafGy)
    gl.uniform1f(U.uLeafFall, 1.4)
    gl.uniform1f(U.uLeafFollow, 0.6)
    gl.uniform1f(U.uTrunkCount, trunkCount)
    gl.uniform2f(U.uTrunkX, trunkX0, trunkX1)
    gl.uniform1f(U.uTrunkW, trunkW)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  let raf = 0, running = true, prevMs = 0, fps = 0
  const loop = (ms: number) => {
    const dt = prevMs ? Math.min(0.05, (ms - prevMs) / 1000) : 0.016
    prevMs = ms; tReal += dt
    ceilingTarget = Math.max(u.rest, ceilingTarget * 0.97)
    ceiling += (ceilingTarget - ceiling) * (ceilingTarget > ceiling ? 0.02 : 0.05)
    parallax += (parallaxTarget - parallax) * 0.08
    wind = gust(tReal) * ceiling
    let s = 0
    for (let i = 0; i < 4; i++) {
      s += wind * (BEND[i] + FLUT[i] * Math.sin(tReal * FREQ[i] + FPH[i]))
      dispArr[2 * i] = DIR[0] * s; dispArr[2 * i + 1] = DIR[1] * s
    }
    draw()
    fps += ((dt > 0 ? 1 / dt : 0) - fps) * 0.1
    if (panel.style.display !== "none") { fpsChart.update(fps); windChart.update(wind) }
    if (running) raf = requestAnimationFrame(loop)
  }
  const onVis = () => {
    if (document.hidden) { running = false; cancelAnimationFrame(raf) }
    else if (!reduce) { running = true; prevMs = 0; raf = requestAnimationFrame(loop) }
  }
  if (reduce) { draw() } else { raf = requestAnimationFrame(loop); document.addEventListener("visibilitychange", onVis) }

  window.addCleanup(() => {
    running = false; cancelAnimationFrame(raf); ro.disconnect()
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("deviceorientation", onTilt)
    document.removeEventListener("themechange", syncColors)
    document.removeEventListener("visibilitychange", onVis)
    document.removeEventListener("keydown", onKey)
    panel.remove(); gl.deleteTexture(segTex)
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    canvas.remove()
  })
}

document.addEventListener("nav", () => {
  const el = document.querySelector(".dappled-scene") as HTMLElement | null
  if (!el || el.dataset.init === "true") return
  el.dataset.init = "true"
  initScene(el)
})
