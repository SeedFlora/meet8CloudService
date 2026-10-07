/** Uji end-to-end Next Route Handler bersama API Lab 06 yang sudah hidup. */
const base = process.env.LAB08_BASE_URL ?? 'http://127.0.0.1:3000'
let checks = 0

function check(label, condition) {
  if (!condition) throw new Error(`FAIL ${label}`)
  checks += 1
  console.log(`PASS ${label}`)
}

const health = await fetch(`${base}/api/health`)
check('liveness Next.js HTTP 200', health.status === 200 && (await health.json()).status === 'ok')
const ready = await fetch(`${base}/api/ready`)
check('readiness API Lab 06 HTTP 200', ready.status === 200 && (await ready.json()).status === 'ready')
const missingTitle = await fetch(`${base}/api/notes`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: 'tanpa judul' }),
})
check('judul kosong ditolak HTTP 400', missingTitle.status === 400)
const invalidJson = await fetch(`${base}/api/notes`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
})
check('JSON rusak ditolak HTTP 400', invalidJson.status === 400)
const title = `Lab08-check-${Date.now()}`
const created = await fetch(`${base}/api/notes`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, content: 'Catatan uji jalur browser ke PostgreSQL.' }),
})
check('POST catatan menghasilkan HTTP 201', created.status === 201)
check('respons proxy membawa X-Request-ID', Boolean(created.headers.get('x-request-id')))
const item = await created.json()
check('catatan tersimpan dengan judul yang benar', item.title === title && Boolean(item.id))
const listed = await fetch(`${base}/api/notes`, { cache: 'no-store' })
check('GET catatan menghasilkan HTTP 200', listed.status === 200)
check('catatan baru tampak dalam daftar', (await listed.json()).some(note => note.id === item.id && note.title === title))
console.log(`challenge: ${checks} PASS, 0 FAIL`)
