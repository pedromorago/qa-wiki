---
title: AI search
---

<script setup>
import { ref } from 'vue'

// Semantic search that runs ENTIRELY in the browser: the site ships a
// precomputed embedding per content chunk (search-index.json, built at deploy
// time), and here we embed just the query and rank by cosine similarity.
// Nothing you type is sent anywhere — except if you explicitly press
// "AI answer", which sends the question + the top excerpts to our own
// Cloudflare Worker (wiki-ask) so a model can write a grounded answer with
// citations. That button only exists on the public site: if the loaded index
// contains any private content, it is hidden and nothing ever leaves the
// browser. The embedding model must match the one the index was built with.
const MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2'
const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3'
const ASK_ENDPOINT = 'https://wiki-ask.pedromoragolv.workers.dev'

const query = ref('')
const results = ref([])
const status = ref('idle') // idle | loading | ready | searching | error
const searched = ref(false)

const canAsk = ref(false) // public-only: hidden if the index has private chunks
const answer = ref('')
const asking = ref(false)
const askError = ref('')
const sources = ref([])

let extractor = null
let index = null
let lastQuestion = ''
let lastTop = []
let askAbort = null // cancels an in-flight answer when a new search starts

async function ensureReady() {
  if (extractor && index) return
  status.value = 'loading'
  const [{ pipeline, env }, res] = await Promise.all([
    import(/* @vite-ignore */ CDN),
    fetch(`${import.meta.env.BASE_URL}search-index.json`),
  ])
  env.allowLocalModels = false
  index = await res.json()
  canAsk.value = !index.chunks.some((c) => c.area === 'private')
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
    askAbort?.abort()
    askAbort = null
    asking.value = false
    answer.value = ''
    askError.value = ''
    sources.value = []
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
    lastQuestion = q
    lastTop = results.value.slice(0, 5)
    searched.value = true
    status.value = 'ready'
  } catch (e) {
    console.error(e)
    results.value = []
    status.value = 'error'
  }
}

async function ask() {
  if (!lastTop.length || asking.value) return
  const ctrl = new AbortController()
  askAbort = ctrl
  asking.value = true
  answer.value = ''
  askError.value = ''
  sources.value = lastTop.map((c) => ({ title: c.title, heading: c.heading, url: c.url }))
  try {
    const res = await fetch(ASK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        question: lastQuestion.slice(0, 400),
        chunks: lastTop.map((c) => ({ title: c.title, heading: c.heading, url: c.url, text: c.text || c.snippet })),
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    // Workers AI SSE: lines of `data: {"response":"…"}` ending with `data: [DONE]`.
    const handleLine = (line) => {
      if (!line.startsWith('data: ')) return
      const payload = line.slice(6).trim()
      if (payload === '[DONE]') return
      try {
        const token = JSON.parse(payload).response
        if (token) answer.value += token
      } catch { /* partial/keepalive line — ignore */ }
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() // keep the (possibly partial) last line
      lines.forEach(handleLine)
    }
    // Flush the decoder and any final line without a trailing newline, so a
    // cleanly-truncated stream doesn't silently drop its last token.
    buffer += decoder.decode()
    if (buffer) handleLine(buffer)
    if (!ctrl.signal.aborted && !answer.value) askError.value = 'No answer came back — try again.'
  } catch (e) {
    if (ctrl.signal.aborted) return // a new search superseded this answer
    console.error(e)
    askError.value = String(e.message || 'The AI is unavailable right now — the results below still work.')
  } finally {
    if (askAbort === ctrl) {
      askAbort = null
      asking.value = false
    }
  }
}
</script>

# 🔎 AI search

Ask in your own words — this searches the **meaning** of every page, not just keywords. The search itself runs in your browser; nothing you type is sent anywhere. The first search downloads the model (~50 MB, cached afterwards), so it takes a few seconds; later searches are instant.

<div class="ai-search">
  <form @submit.prevent="run">
    <input
      v-model="query"
      type="search"
      maxlength="400"
      placeholder="e.g. how do I test message queues?"
      aria-label="Search query"
      autofocus
    />
    <button type="submit" :disabled="status === 'loading' || status === 'searching'">Search</button>
  </form>

  <p v-if="status === 'loading'" class="ai-search__status">Loading the model (first time only)…</p>
  <p v-else-if="status === 'searching'" class="ai-search__status">Searching…</p>
  <p v-else-if="status === 'error'" class="ai-search__status">Something went wrong — check the console and try again.</p>

  <div v-if="results.length && canAsk" class="ai-answer">
    <button v-if="!answer && !asking" class="ai-answer__ask" @click="ask">
      💬 AI answer <span class="ai-answer__hint">— writes a short answer from the results, with citations</span>
    </button>
    <p v-if="asking && !answer" class="ai-search__status">Writing an answer from the excerpts…</p>
    <div v-if="answer" class="ai-answer__box">
      <p class="ai-answer__text">{{ answer }}</p>
      <p class="ai-answer__sources">
        Sources:
        <template v-for="(s, i) in sources" :key="s.url">
          <a :href="s.url">[{{ i + 1 }}] {{ s.title }}</a><span v-if="i < sources.length - 1"> · </span>
        </template>
      </p>
      <p class="ai-answer__note">Generated from the excerpts above — verify against the linked pages.</p>
    </div>
    <p v-if="askError" class="ai-search__status">⚠️ {{ askError }}</p>
  </div>

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

.ai-answer { margin: 1rem 0; }
.ai-answer__ask {
  padding: 8px 14px; border-radius: 8px; border: 1px dashed var(--vp-c-brand-1);
  background: transparent; color: var(--vp-c-brand-1); font-weight: 600; cursor: pointer;
}
.ai-answer__hint { font-weight: 400; color: var(--vp-c-text-2); font-size: .85rem; }
.ai-answer__box {
  border: 1px solid var(--vp-c-divider); border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 8px; padding: 14px 16px; background: var(--vp-c-bg-soft);
}
.ai-answer__text { margin: 0; white-space: pre-wrap; }
.ai-answer__sources { margin: 10px 0 0; font-size: .9rem; }
.ai-answer__sources a { color: var(--vp-c-brand-1); }
.ai-answer__note { margin: 6px 0 0; font-size: .78rem; color: var(--vp-c-text-3); }
</style>
