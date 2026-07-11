#!/usr/bin/env node
// Builds both language trees and serves them together from one static server,
// so /ru/ actually resolves locally — `npx quartz build --serve` alone only
// builds content/ -> public/ and never runs the RU build, hence 404 on /ru/.
import { execSync } from "node:child_process"
import http from "node:http"
import handler from "serve-handler"

const PORT = process.env.PORT || 8081

console.log("Building EN (content/ -> public/)...")
execSync("npx quartz build", { stdio: "inherit" })

console.log("Building RU (content-ru/ -> public/ru)...")
execSync("npm run build:ru", { stdio: "inherit" })

const server = http.createServer((req, res) => handler(req, res, { public: "public" }))
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\nPort ${PORT} is already in use — probably a previous serve:all still running.`)
    console.error(`Find it with 'lsof -i :${PORT}' and kill it, or run with a different port: PORT=8082 npm run serve:all`)
    process.exit(1)
  }
  throw err
})
server.listen(PORT, () => {
  console.log(`\nServing both trees at:`)
  console.log(`  EN: http://localhost:${PORT}/`)
  console.log(`  RU: http://localhost:${PORT}/ru/`)
  console.log(`\n(one-shot build, no live-reload — re-run after editing content)`)
})
