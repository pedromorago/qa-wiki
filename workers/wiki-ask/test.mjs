// Local harness for the wiki-ask Worker: exercises validation, CORS, rate
// limiting and stream pass-through with a mocked env.AI. Run: node test.mjs
import worker from './src/index.mjs'

const OK_ORIGIN = 'https://wiki.pedromorago.com'
const env = {
  ALLOWED_ORIGINS: 'https://wiki.pedromorago.com,http://localhost:5173',
  AI: {
    async run(_model, opts) {
      if (!opts.stream) throw new Error('expected stream:true')
      const enc = new TextEncoder()
      return new ReadableStream({
        start(c) {
          c.enqueue(enc.encode('data: {"response":"Use "}\n\n'))
          c.enqueue(enc.encode('data: {"response":"Awaitility [1]."}\n\n'))
          c.enqueue(enc.encode('data: [DONE]\n\n'))
          c.close()
        },
      })
    },
  },
}

const goodChunk = { title: 'Async APIs', heading: 'Polling', url: '/api-testing/async-apis-with-awaitility', text: 'Awaitility polls until a condition is met.' }
const req = (body, { origin = OK_ORIGIN, method = 'POST', ip = '1.2.3.4' } = {}) =>
  new Request('https://wiki-ask.example/', {
    method,
    headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  })

let failures = 0
async function check(name, resPromise, expectStatus, bodyCheck) {
  const res = await resPromise
  const ok = res.status === expectStatus && (!bodyCheck || bodyCheck(await res.text()))
  console.log(`${ok ? '✓' : '✗'} ${name} (HTTP ${res.status}, esperado ${expectStatus})`)
  if (!ok) failures++
}

await check('OPTIONS preflight', worker.fetch(req(null, { method: 'OPTIONS' }), env), 204)
await check('GET rechazado', worker.fetch(req(null, { method: 'GET' }), env), 405)
await check('origen desconocido rechazado', worker.fetch(req({ question: 'q', chunks: [goodChunk] }, { origin: 'https://evil.example' }), env), 403)
await check('sin pregunta', worker.fetch(req({ chunks: [goodChunk] }), env), 400)
await check('pregunta larguísima', worker.fetch(req({ question: 'x'.repeat(500), chunks: [goodChunk] }), env), 400)
await check('sin chunks', worker.fetch(req({ question: 'q', chunks: [] }), env), 400)
await check('demasiados chunks', worker.fetch(req({ question: 'q', chunks: Array(9).fill(goodChunk) }), env), 400)
await check('url externa en chunk', worker.fetch(req({ question: 'q', chunks: [{ ...goodChunk, url: 'https://evil.example/x' }] }), env), 400)
await check('JSON roto', worker.fetch(new Request('https://x/', { method: 'POST', headers: { Origin: OK_ORIGIN }, body: '{nope' }), env), 400)
await check('petición válida → stream', worker.fetch(req({ question: 'how do I test async APIs?', chunks: [goodChunk] }), env), 200,
  (t) => t.includes('Awaitility [1].') && t.includes('[DONE]'))
await check('CORS header en respuesta válida', worker.fetch(req({ question: 'q', chunks: [goodChunk] }), env).then(async (r) => {
  return new Response(null, { status: r.headers.get('Access-Control-Allow-Origin') === OK_ORIGIN ? 200 : 500 })
}), 200)

// Rate limit: 8 permitidas por IP/minuto, la novena → 429
let last
for (let i = 0; i < 9; i++) last = await worker.fetch(req({ question: 'q', chunks: [goodChunk] }, { ip: '9.9.9.9' }), env)
console.log(`${last.status === 429 ? '✓' : '✗'} rate limit por IP (HTTP ${last.status}, esperado 429)`)
if (last.status !== 429) failures++

// El error de AI degrada a 503 con mensaje
const brokenEnv = { ...env, AI: { async run() { throw new Error('quota') } } }
await check('cuota agotada → 503 amable', worker.fetch(req({ question: 'q', chunks: [goodChunk] }), brokenEnv), 503, (t) => t.includes('quota'))

process.exit(failures ? 1 : 0)
