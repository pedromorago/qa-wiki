---
title: AI search
---

<script setup>
import { ref } from 'vue'

// Semantic search that runs ENTIRELY in the browser: the site ships a
// precomputed embedding per content chunk (search-index.json, built at deploy
// time), and here we embed just the query and rank by cosine similarity.
// Nothing you type is sent anywhere. This same page serves both the public
// wiki (public content only) and the private site (all content) — each is
// served the matching index. The model must match the one the index was built
// with.
const MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2'
const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3'

const query = ref('')
const results = ref([])
const status = ref('idle') // idle | loading | ready | searching | error
const searched = ref(false)

let extractor = null
let index = null

async function ensureReady() {
  if (extractor && index) return
  status.value = 'loading'
  const [{ pipeline, env }, res] = await Promise.all([
    import(/* @vite-ignore */ CDN),
    fetch(`${import.meta.env.BASE_URL}search-index.json`),
  ])
  env.allowLocalModels = false
  index = await res.json()
  extractor = await pipeline('feature-extraction', MODEL, { dtype: 'q8' })
  status.value = 'ready'
}

function cosine(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}

async function run() {
  const q = query.value.trim()
  if (!q) return
  try {
    await ensureReady()
    status.value = 'searching'
    const out = await extractor(q, { pooling: 'mean', normalize: true })
    const qv = Array.from(out.data)
    // Rank all chunks, then keep the best chunk per page (dedupe by URL).
    const ranked = index.chunks
      .map((c) => ({ ...c, score: cosine(qv, c.vector) }))
      .sort((a, b) => b.score - a.score)
    const seen = new Set()
    const top = []
    for (const c of ranked) {
      if (seen.has(c.url)) continue
      seen.add(c.url)
      top.push(c)
      if (top.length === 8) break
    }
    results.value = top.filter((c) => c.score > 0.25)
    searched.value = true
    status.value = 'ready'
  } catch (e) {
    console.error(e)
    results.value = []
    status.value = 'error'
  }
}
</script>

# 🔎 AI search

Ask in your own words — this searches the **meaning** of every page, not just keywords. Everything runs in your browser; nothing you type is sent anywhere. The first search downloads the model (~50 MB, cached afterwards), so it takes a few seconds; later searches are instant.

<div class="ai-search">
  <form @submit.prevent="run">
    <input
      v-model="query"
      type="search"
      placeholder="e.g. how do I test message queues?"
      aria-label="Search query"
      autofocus
    />
    <button type="submit" :disabled="status === 'loading' || status === 'searching'">Search</button>
  </form>

  <p v-if="status === 'loading'" class="ai-search__status">Loading the model (first time only)…</p>
  <p v-else-if="status === 'searching'" class="ai-search__status">Searching…</p>
  <p v-else-if="status === 'error'" class="ai-search__status">Something went wrong — check the console and try again.</p>

  <ul v-if="results.length" class="ai-search__results">
    <li v-for="r in results" :key="r.id">
      <a :href="r.url">
        <span class="ai-search__title">{{ r.title }}</span>
        <span v-if="r.heading" class="ai-search__heading"> › {{ r.heading }}</span>
        <span class="ai-search__badge" v-if="r.area === 'private'">🔒</span>
      </a>
      <p class="ai-search__snippet">{{ r.snippet }}…</p>
    </li>
  </ul>
  <p v-else-if="searched && status === 'ready'" class="ai-search__status">No matches — try rephrasing.</p>
</div>

<style scoped>
.ai-search form { display: flex; gap: 8px; margin: 1.5rem 0; }
.ai-search input {
  flex: 1; padding: 10px 14px; font-size: 1rem;
  border: 1px solid var(--vp-c-border); border-radius: 8px; background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.ai-search button {
  padding: 10px 18px; font-weight: 600; border-radius: 8px; border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-1); color: #fff; cursor: pointer;
}
.ai-search button:disabled { opacity: .5; cursor: default; }
.ai-search__status { color: var(--vp-c-text-2); }
.ai-search__results { list-style: none; padding: 0; margin: 1.5rem 0; }
.ai-search__results li { padding: 12px 0; border-top: 1px solid var(--vp-c-divider); }
.ai-search__title { font-weight: 600; color: var(--vp-c-brand-1); }
.ai-search__heading { color: var(--vp-c-text-2); }
.ai-search__badge { margin-left: 6px; }
.ai-search__snippet { margin: 4px 0 0; color: var(--vp-c-text-2); font-size: .9rem; }
</style>
