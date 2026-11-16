import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/logger'

/**
 * Proxy model AI: browser -> Route Handler (server) -> provider OpenAI-compatible.
 * Token hanya dibaca dari environment server; jangan pakai prefix NEXT_PUBLIC_.
 * Contoh AI_BASE_URL: Ollama lokal http://127.0.0.1:11434/v1, HF router https://router.huggingface.co/v1,
 * Groq https://api.groq.com/openai/v1, Gemini https://generativelanguage.googleapis.com/v1beta/openai,
 * Workers AI https://api.cloudflare.com/client/v4/accounts/<ID>/ai/v1
 */
const MAX_PROMPT = 2000

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const started = Date.now()
  const baseUrl = process.env.AI_BASE_URL?.replace(/\/+$/, '')
  const model = process.env.AI_MODEL
  if (!baseUrl || !model) {
    return NextResponse.json({ error: 'AI_BASE_URL dan AI_MODEL belum diisi di .env.local' },
      { status: 503, headers: { 'X-Request-ID': requestId } })
  }

  let prompt: unknown
  try {
    prompt = (await request.json())?.prompt
  } catch {
    return NextResponse.json({ error: 'JSON tidak valid' }, { status: 400, headers: { 'X-Request-ID': requestId } })
  }
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ error: 'prompt wajib diisi' }, { status: 400, headers: { 'X-Request-ID': requestId } })
  }

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.AI_API_KEY ? { Authorization: `Bearer ${process.env.AI_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model,
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt.trim().slice(0, MAX_PROMPT) }],
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    })
    logEvent('info', 'ai_proxy', { requestId, status: upstream.status, durationMs: Date.now() - started })
    if (!upstream.ok) {
      return NextResponse.json({ error: `Provider menjawab HTTP ${upstream.status}` },
        { status: 502, headers: { 'X-Request-ID': requestId } })
    }
    const data = await upstream.json()
    const answer = data?.choices?.[0]?.message?.content
    if (typeof answer !== 'string') {
      return NextResponse.json({ error: 'Format respons provider tidak dikenal' },
        { status: 502, headers: { 'X-Request-ID': requestId } })
    }
    return NextResponse.json({ answer, model, durationMs: Date.now() - started },
      { headers: { 'X-Request-ID': requestId } })
  } catch {
    logEvent('error', 'ai_proxy_unavailable', { requestId, durationMs: Date.now() - started })
    return NextResponse.json({ error: 'Provider AI tidak dapat dihubungi atau timeout' },
      { status: 504, headers: { 'X-Request-ID': requestId } })
  }
}
