// wiki-ask: grounded answer generation for the public wiki's AI search.
//
// Contract: POST { question, chunks: [{ title, heading?, url, text }] }
// → text/event-stream of Workers AI tokens (SSE: `data: {"response":"…"}`).
//
// The Worker is stateless and does NO retrieval — the browser already ranked
// the chunks with its local semantic search and sends the top few. Guardrails:
// origin allow-list, strict input limits, a best-effort per-IP rate limit, and
// a prompt that forbids answering beyond the provided excerpts.

const MODEL = '@cf/meta/llama-3.1-8b-instruct'

const LIMITS = {
  questionChars: 400,
  maxChunks: 6,
  chunkTextChars: 1500,
  titleChars: 160,
  totalContextChars: 8000,
  perIpPerMinute: 8,
}

// Best-effort in-memory rate limit (per isolate — resets on eviction; the real
// backstop is the Workers AI FREE-plan hard cap, which errors and never bills.
// That only holds while the account stays on Workers Free — Paid overage
// auto-bills uncapped).
const hits = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  if (recent.length >= LIMITS.perIpPerMinute) return true
  recent.push(now)
  if (hits.size > 5000) hits.clear()
  hits.set(ip, recent)
  return false
}

function corsHeaders(origin, allowed) {
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

const json = (data, status, headers) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  })

/** Validate and sanitize the request body; returns { question, chunks } or a string error. */
function parseBody(body) {
  if (!body || typeof body !== 'object') return 'Invalid JSON body'
  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (!question) return 'Missing question'
  if (question.length > LIMITS.questionChars) return 'Question too long'
  if (!Array.isArray(body.chunks) || body.chunks.length === 0) return 'Missing chunks'
  if (body.chunks.length > LIMITS.maxChunks) return 'Too many chunks'
  const chunks = []
  let total = 0
  for (const c of body.chunks) {
    if (!c || typeof c !== 'object') return 'Invalid chunk'
    const title = String(c.title ?? '').slice(0, LIMITS.titleChars)
    const heading = c.heading ? String(c.heading).slice(0, LIMITS.titleChars) : null
    const url = String(c.url ?? '')
    const text = String(c.text ?? '').slice(0, LIMITS.chunkTextChars)
    // Only same-site paths: the sources UI builds links from these.
    if (!/^\/[\w\-./]*$/.test(url)) return 'Invalid chunk url'
    if (!title || !text) return 'Chunk missing title or text'
    total += text.length
    if (total > LIMITS.totalContextChars) return 'Context too large'
    chunks.push({ title, heading, url, text })
  }
  return { question, chunks }
}

function buildMessages(question, chunks) {
  const context = chunks
    .map((c, i) => `[${i + 1}] ${c.title}${c.heading ? ` › ${c.heading}` : ''}\n${c.text}`)
    .join('\n\n')
  return [
    {
      role: 'system',
      content:
        "You are the search assistant of Pedro Morago's QA wiki. Answer the user's question using ONLY the numbered excerpts provided. Cite the excerpts you use inline as [1], [2], etc. If the excerpts do not contain the answer, say briefly that the wiki does not cover it — never invent information, names or URLs. Answer in the same language as the question. Be concise: at most ~150 words.",
    },
    {
      role: 'user',
      content: `Excerpts from the wiki:\n\n${context}\n\nQuestion: ${question}`,
    },
  ]
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS ?? 'https://wiki.pedromorago.com')
      .split(',')
      .map((s) => s.trim())
    const origin = request.headers.get('Origin') ?? ''
    const cors = corsHeaders(origin, allowed)

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors)
    if (!allowed.includes(origin)) return json({ error: 'Origin not allowed' }, 403, cors)

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
    if (rateLimited(ip)) return json({ error: 'Too many requests — try again in a minute' }, 429, cors)

    const body = await request.json().catch(() => null)
    const parsed = parseBody(body)
    if (typeof parsed === 'string') return json({ error: parsed }, 400, cors)

    try {
      const stream = await env.AI.run(MODEL, {
        messages: buildMessages(parsed.question, parsed.chunks),
        stream: true,
        max_tokens: 400,
      })
      return new Response(stream, {
        headers: { ...cors, 'Content-Type': 'text/event-stream' },
      })
    } catch (e) {
      // Most likely the free-tier daily cap. Degrade politely; the page falls
      // back to plain results.
      console.error(e)
      return json({ error: 'AI unavailable right now (daily free quota may be exhausted) — plain results still work' }, 503, cors)
    }
  },
}
