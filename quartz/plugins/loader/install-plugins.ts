#!/usr/bin/env node
import fs from "fs"
import path from "path"
import YAML from "yaml"
import { installPlugins, parsePluginSource } from "./gitLoader.js"

async function main() {
  // Read config directly from YAML to avoid importing quartz.js (which pulls in SCSS)
  const configPath = path.join(process.cwd(), "quartz.config.default.yaml")
  const raw = fs.readFileSync(configPath, "utf-8")
  const quartzConfig = YAML.parse(raw)
  const externalPlugins = quartzConfig.externalPlugins || []

  if (externalPlugins.length === 0) {
    console.log("No external plugins to install.")
    return
  }

  console.log(`Installing ${externalPlugins.length} plugin(s) from Git...`)

  const specs = externalPlugins.map((source: string) => parsePluginSource(source))
  const installed = await installPlugins(specs, { verbose: true })

  if (installed.size === externalPlugins.length) {
    console.log("✓ All plugins installed successfully")
  } else {
    console.error(`✗ Only ${installed.size}/${externalPlugins.length} plugins installed`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Failed to install plugins:", err)
  process.exit(1)
})
