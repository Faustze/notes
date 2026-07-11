#!/usr/bin/env node
// Generates quartz.config.ru.yaml from quartz.config.yaml with baseUrl pointed
// at the /ru subpath. Components that navigate via an absolute, basePath-derived
// href (Explorer, Search, Graph — see quartz/plugins/loader/config-loader.ts)
// read that basePath from `configuration.baseUrl`'s URL pathname, so without
// this the RU build's basePath is empty and those links bounce back to the
// EN root instead of staying under /ru/.
import { readFile, writeFile } from "node:fs/promises"
import YAML from "yaml"

const SOURCE_PATH = "quartz.config.yaml"
const OUTPUT_PATH = "quartz.config.ru.yaml"

const raw = await readFile(SOURCE_PATH, "utf8")
const config = YAML.parse(raw)

if (!config.configuration?.baseUrl) {
  throw new Error(`${SOURCE_PATH} has no configuration.baseUrl to derive the RU baseUrl from`)
}

config.configuration.baseUrl = `${config.configuration.baseUrl.replace(/\/$/, "")}/ru`

await writeFile(OUTPUT_PATH, YAML.stringify(config))
console.log(`wrote ${OUTPUT_PATH} (baseUrl: ${config.configuration.baseUrl})`)
