// Раньше список uniform'ов был продублирован вручную дважды:
// один раз в объекте `U` (getUniformLocation), второй раз в draw()
// (gl.uniform1f/2f/3f/4f/1i по одному на каждый). Добавление uniform'а
// требовало править оба места синхронно — источник багов.
//
// Здесь список объявляется ОДИН раз как схема {name, kind, get},
// а location-lookup и запись в GL генерируются из неё автоматически.

export type UniformKind = "1f" | "2f" | "3f" | "4f" | "1i" | "2fv"

export interface UniformSpec {
  name: string
  kind: UniformKind
  /** Значение читается лениво на каждый кадр — источник (config/state) может меняться. */
  get: () => number | number[] | Float32Array
}

export function compileProgram(gl: WebGLRenderingContext, vertSrc: string, fragSrc: string) {
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("[dappled-light] shader compile error:", gl.getShaderInfoLog(sh))
    }
    return sh
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("[dappled-light] program link error:", gl.getProgramInfoLog(prog))
  }
  return prog
}

/** Строит setter, который на каждый кадр применяет всю схему uniform'ов одним вызовом. */
export function createUniformBinder(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  specs: UniformSpec[],
) {
  const locations = specs.map((s) => gl.getUniformLocation(program, s.name))

  function apply() {
    for (let i = 0; i < specs.length; i++) {
      const loc = locations[i]
      if (!loc) continue // uniform может быть оптимизирован компилятором, если не используется — это ок
      const v = specs[i].get()
      switch (specs[i].kind) {
        case "1f":
          gl.uniform1f(loc, v as number)
          break
        case "1i":
          gl.uniform1i(loc, v as number)
          break
        case "2f": {
          const a = v as number[]
          gl.uniform2f(loc, a[0], a[1])
          break
        }
        case "3f": {
          const a = v as number[]
          gl.uniform3f(loc, a[0], a[1], a[2])
          break
        }
        case "4f": {
          const a = v as number[]
          gl.uniform4f(loc, a[0], a[1], a[2], a[3])
          break
        }
        case "2fv":
          gl.uniform2fv(loc, v as Float32Array)
          break
      }
    }
  }

  /** Точечный доступ к location — нужен только текстурному uSegTex (bind + unit index). */
  function locationOf(name: string): WebGLUniformLocation | null {
    const i = specs.findIndex((s) => s.name === name)
    return i === -1 ? null : locations[i]
  }

  return { apply, locationOf }
}
