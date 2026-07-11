import { h } from "preact"
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

// Pure string (not an imported .inline.ts) so this works with plain `import()`
// and needs no build step — local plugins in this repo are loaded as-is.
const script = `
(function () {
  function setup() {
    var btn = document.getElementById("lang-switch")
    if (!btn) return
    var path = window.location.pathname
    var isRu = path === "/ru" || path.indexOf("/ru/") === 0
    var label = btn.querySelector(".lang-switch-label")
    if (label) label.textContent = isRu ? "EN" : "RU"
    btn.setAttribute("aria-label", isRu ? "Switch to English" : "Переключить на русский")
    var target
    if (isRu) {
      target = path.replace(/^\\/ru\\/?/, "/")
      if (target === "") target = "/"
    } else {
      target = "/ru" + (path.charAt(0) === "/" ? path : "/" + path)
    }
    btn.setAttribute("href", target)
  }
  document.addEventListener("nav", setup)
  document.addEventListener("render", setup)
})()
`

const style = `
.lang-switch {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  height: 32px;
  min-width: 20px;
  background: none;
  border: none;
  text-decoration: none;
  flex-shrink: 0;
  color: var(--darkgray);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.lang-switch:hover {
  color: var(--secondary);
}
`

const LangSwitchComponent: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return h(
    "a",
    {
      id: "lang-switch",
      class: `${displayClass ?? ""} lang-switch`,
      href: "/ru/",
      "aria-label": "Switch language",
    },
    h("span", { class: "lang-switch-label" }, "RU"),
  )
}

LangSwitchComponent.beforeDOMLoaded = script
LangSwitchComponent.css = style

export const LangSwitch: QuartzComponentConstructor = () => LangSwitchComponent
