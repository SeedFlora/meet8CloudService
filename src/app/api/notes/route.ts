import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/logger'

const baseUrl = process.env.LOCAL_API_URL || 'http://127.0.0.1:8000'

async function forward(method: 'GET' | 'POST', body?: string) {
  const started = Date.now()
  const requestId = crypto.randomUUID()
  try {
    const upstream = await fetch(`${baseUrl}/notes`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body,
      cache: 'no-store',
    })
    const payload = await upstream.text()
    logEvent('info', 'notes_proxy', { requestId, method, status: upstream.status, durationMs: Date.now() - started })
    return new NextResponse(payload, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'X-Request-ID': requestId,
      },
    })
  } catch {
    logEvent('error', 'notes_proxy_unavailable', { requestId, method, durationMs: Date.now() - started })
    return NextResponse.json({ error: 'API lokal tidak tersedia. Jalankan Compose Lab 06.' },
      { status: 503, headers: { 'X-Request-ID': requestId } })
  }
}

export async function GET() {
  return forward('GET')
}

export async function POST(request: Request) {
  let body: { title?: unknown; content?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON tidak valid' }, { status: 400 })
  }
  if (typeof body.title !== 'string' || !body.title.trim() || typeof body.content !== 'string' || !body.content.trim()) {
    return NextResponse.json({ error: 'Judul dan isi wajib diisi' }, { status: 400 })
  }
  return forward('POST', JSON.stringify({ title: body.title.trim(), content: body.content.trim() }))
}
