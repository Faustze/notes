#!/usr/bin/env node
// Translates every note in content/ into Russian, writing the result to content-ru/.
// content/ itself is never modified — it is re-synced from the Obsidian vault and
// any local edits there would be lost on the next sync.
//
// Translation runs through the local `claude` CLI in headless mode (`claude -p`),
// which uses the logged-in Claude subscription (`claude login` / this machine's
// existing session) — not a metered ANTHROPIC_API_KEY. No tools are invoked (pure
// text in, text out via stdin/stdout), so it needs no extra permissions.
//
// Translations are cached: a manifest in content-ru/.translation-manifest.json maps
// each note's relative path to the sha256 of the source content that produced its
// translation. A file is only re-sent to Claude when its source hash changed since
// the last run, so re-running with an unchanged content/ makes zero claude calls.
//
// Usage:
//   node scripts/translate-content.mjs          translate whatever changed
//   node scripts/translate-content.mjs --check  exit 1 if content-ru/ is stale, no calls made
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises"
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import path from "node:path"

const CONTENT_DIR = path.resolve("content")
const OUTPUT_DIR = path.resolve("content-ru")
const MANIFEST_PATH = path.join(OUTPUT_DIR, ".translation-manifest.json")
const CHECK_ONLY = process.argv.includes("--check")
const CONCURRENCY = 2
const CLAUDE_TIMEOUT_MS = 120_000

const PROMPT = `You translate personal technical notes (Obsidian-flavored Markdown) for a bilingual RU/EN developer notes site. Translate all natural-language prose — headings, explanations, prose inside HTML tags, comments — into Russian.

Leave unchanged, verbatim:
- code fences and their contents (including inline code spans)
- URLs
- Obsidian wikilinks like [[note-name]] or [[note-name|alias]]
- LaTeX ($...$ or $$...$$)
- HTML tag names and attributes (translate only the visible text nodes inside them)
- YAML frontmatter keys, and frontmatter values that are not natural language (tags, aliases, dates)

In YAML frontmatter, translate only human-readable string values such as title and description.

If the input is already fully in Russian, return it unchanged.

Output ONLY the resulting Markdown file — no commentary, no wrapping code fence around the whole output. The file content follows below the line "---FILE---".
---FILE---
`

function hash(text) {
  return createHash("sha256").update(text).digest("hex")
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"))
  } catch {
    return {}
  }
}

async function collectMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(full)))
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(full)
    }
  }
  return files
}

function translateViaClaude(original) {
  return execFileSync(
    "claude",
    [
      "-p",
      PROMPT + original,
      "--output-format",
      "text",
      "--no-session-persistence",
      // Headless claude still runs as a full agent with file-system tool access
      // by default. Since the prompt contains the real file's content, Claude
      // can recognize it matches an actual file in cwd and "helpfully" edit it
      // directly instead of just returning translated text — this must be a
      // pure text-in/text-out call with zero ability to touch the filesystem.
      "--tools",
      "",
    ],
    { encoding: "utf8", timeout: CLAUDE_TIMEOUT_MS, maxBuffer: 16 * 1024 * 1024 },
  )
}

async function translateFile(filePath, manifest) {
  const relPath = path.relative(CONTENT_DIR, filePath)
  const outPath = path.join(OUTPUT_DIR, relPath)
  const original = await readFile(filePath, "utf8")
  const sourceHash = hash(original)

  if (manifest[relPath] === sourceHash) {
    return { relPath, sourceHash, changed: false }
  }

  if (CHECK_ONLY) {
    return { relPath, sourceHash, changed: true }
  }

  const translated = translateViaClaude(original).trim() + "\n"

  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, translated, "utf8")
  console.log(`translated ${relPath}`)
  return { relPath, sourceHash, changed: true }
}

async function run() {
  const files = await collectMarkdownFiles(CONTENT_DIR)
  const manifest = await loadManifest()
  const nextManifest = {}
  const staleFiles = []

  let index = 0
  let failures = 0

  async function worker() {
    while (index < files.length) {
      const file = files[index++]
      try {
        const result = await translateFile(file, manifest)
        nextManifest[result.relPath] = result.sourceHash
        if (result.changed) staleFiles.push(result.relPath)
      } catch (error) {
        failures++
        console.error(`failed ${path.relative(CONTENT_DIR, file)}: ${error.message}`)
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  if (CHECK_ONLY) {
    if (staleFiles.length > 0) {
      console.error(`content-ru/ is stale — ${staleFiles.length} file(s) need translation:`)
      for (const f of staleFiles) console.error(`  ${f}`)
      console.error("Run `npm run translate` and commit content-ru/.")
      process.exit(1)
    }
    console.log("content-ru/ is up to date")
    return
  }

  // Drop translated files whose source note was renamed or deleted, so content-ru/
  // never serves a page that no longer exists in content/.
  const outputFiles = await collectMarkdownFiles(OUTPUT_DIR).catch(() => [])
  const staleOutputs = outputFiles.filter(
    (file) => !(path.relative(OUTPUT_DIR, file) in nextManifest),
  )
  await Promise.all(staleOutputs.map((file) => rm(file)))

  await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(MANIFEST_PATH, JSON.stringify(nextManifest, null, 2) + "\n", "utf8")

  if (failures > 0) {
    console.error(`done with ${failures} failure(s)`)
    process.exit(1)
  }
  if (staleFiles.length === 0) {
    console.log("content-ru/ already up to date, no translation needed")
  } else {
    console.log(`translated ${staleFiles.length} file(s)`)
  }
}

run()
