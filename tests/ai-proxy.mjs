/** Uji /api/ai tanpa akun: server mock OpenAI-compatible + Next.js yang sudah hidup. */
import { createServer } from 'node:http'

const base = process.env.LAB08_BASE_URL ?? 'http://127.0.0.1:3000'
let checks = 0
function check(label, condition) {
  if (!condition) throw new Error(`FAIL ${label}`)
  checks += 1
  console.log(`PASS ${label}`)
}

const empty = await fetch(`${base}/api/ai`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: ' ' }) })
check('prompt kosong ditolak HTTP 400 atau AI belum dikonfigurasi 503', [400, 503].includes(empty.status))
const res = await fetch(`${base}/api/ai`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: 'Apa itu Docker?' }) })
const body = await res.json()
check('jawaban provider diteruskan (HTTP 200)', res.status === 200 && typeof body.answer === 'string' && body.answer.length > 0)
check('respons membawa X-Request-ID', Boolean(res.headers.get('x-request-id')))
console.log(`ai-proxy: ${checks} PASS, 0 FAIL  (jawaban: ${body.answer.slice(0, 60)})`)
