// Build the semantic search index for the PRIVATE wiki.
//
// Runs in the private deploy workflow AFTER `npm run build:full`, over the
// full docs tree (public docs + the private overlay mounted at docs/private).
// It never runs in the public deploy, so the index — which contains private
// content — only ever ships on the authenticated site.
//
// Output: <dist>/search-index.json — an array of chunks, each with a
// precomputed embedding. At query time the browser embeds only the query and
// ranks these by cosine similarity (see the search page); nothing leaves the
// browser. Vectors here and in the browser MUST come from the same MODEL.
//
// Usage: node build-index.mjs [docsDir] [outFile]
//   defaults match the workflow layout: wiki/docs and
//   wiki/docs/.vitepress/dist/search-index.json

import { pipeline, env } from '@huggingface/transformers'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

export const MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2'

const DOCS_DIR = process.argv[2] ?? 'wiki/docs'
const OUT_FILE = process.argv[3] ?? join(DOCS_DIR, '.vitepress/dist/search-index.json')

// Directories and files that are machinery or non-content, not searchable pages.
const SKIP_DIRS = new Set(['.vitepress', 'public', 'static', 'promote', 'node_modules', '.git'])
const SKIP_FILES = new Set(['README.md', 'template.md', 'search.md'])

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) out.push(...walk(join(dir, entry.name)))
    } else if (entry.name.endsWith('.md') && !SKIP_FILES.has(entry.name)) {
      out.push(join(dir, entry.name))
    }
  }
  return out
}

/** Route a docs-relative file path to its clean URL (base '/' in the full build).
 *  Index pages keep the trailing slash VitePress/Pages use for directories. */
function toUrl(relPath) {
  const p = relPath.split(sep).join('/').replace(/\.md$/, '')
  if (p === 'index') return '/'
  if (p.endsWith('/index')) return `/${p.slice(0, -'index'.length)}` // .../ (trailing slash kept)
  return `/${p}`
}

function stripFrontmatter(src) {
  const m = src.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)
  return m ? src.slice(m[0].length) : src
}

function frontmatterTitle(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return null
  const t = m[1].match(/^title:[ \t]*["']?(.+?)["']?[ \t]*$/m)
  return t ? t[1] : null
}

/** Markdown → readable plain text for embedding and snippets. */
function toPlainText(md) {
  return md
    .replace(/<script[\s\S]*?<\/script>/gi, ' ') // embedded Vue/JS (e.g. component pages)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')   // embedded CSS
    .replace(/```[\s\S]*?```/g, ' ')        // code fences
    .replace(/`([^`]+)`/g, '$1')            // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')  // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .replace(/^[>\-*+]\s+/gm, '')            // list/quote markers
    .replace(/[*_#>|]/g, ' ')                // residual md syntax
    .replace(/:::.*$/gm, ' ')                // vitepress containers
    .replace(/\s+/g, ' ')
    .trim()
}

function humanize(slug) {
  const s = slug.replace(/[-_]/g, ' ').trim()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Split a page into {heading, text} chunks at H2/H3 boundaries. */
function chunkPage(body) {
  const lines = body.split(/\r?\n/)
  const chunks = []
  let heading = null
  let buffer = []
  const flush = () => {
    const text = toPlainText(buffer.join('\n'))
    if (text.length >= 20) chunks.push({ heading, text })
    buffer = []
  }
  for (const line of lines) {
    const h = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/)
    if (h) {
      flush()
      heading = toPlainText(h[2])
    } else {
      buffer.push(line)
    }
  }
  flush()
  return chunks
}

const files = walk(DOCS_DIR).sort()
console.log(`Indexing ${files.length} pages from ${DOCS_DIR} …`)

env.cacheDir = process.env.MODEL_CACHE_DIR || './.model-cache'
const extract = await pipeline('feature-extraction', MODEL)
const embed = async (text) =>
  Array.from((await extract(text.slice(0, 1500), { pooling: 'mean', normalize: true })).data)

const index = []
for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const relPath = relative(DOCS_DIR, file)
  const url = toUrl(relPath)
  const body = stripFrontmatter(raw)
  const h1 = body.match(/^#\s+(.+?)\s*$/m)
  const title =
    frontmatterTitle(raw) ||
    (h1 ? toPlainText(h1[1]) : humanize(relPath.split(sep).pop().replace(/\.md$/, '')))
  const isPrivate = relPath.split(sep)[0] === 'private'

  for (const { heading, text } of chunkPage(body)) {
    // Embed with the page title (and heading) for context; store a clean snippet.
    const context = [title, heading].filter(Boolean).join(' — ')
    const vector = await embed(`${context}\n${text}`)
    index.push({
      id: `${url}#${index.length}`,
      title,
      heading: heading || null,
      url,
      area: isPrivate ? 'private' : 'public',
      snippet: text.slice(0, 220),
      // Longer excerpt used as grounding context by the RAG answer endpoint
      // (public site only — see the Ask button in search.md).
      text: text.slice(0, 1100),
      vector,
    })
  }
}

writeFileSync(OUT_FILE, JSON.stringify({ model: MODEL, dim: index[0]?.vector.length ?? 0, chunks: index }))
const bytes = statSync(OUT_FILE).size
console.log(`Wrote ${index.length} chunks (${(bytes / 1024).toFixed(0)} KB) → ${OUT_FILE}`)
