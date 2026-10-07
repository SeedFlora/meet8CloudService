import { NextResponse } from 'next/server'

/** Berbeda dari /api/health: readiness ikut memeriksa API Lab 06. */
export async function GET() {
  const baseUrl = process.env.LOCAL_API_URL || 'http://127.0.0.1:8000'
  try {
    const response = await fetch(`${baseUrl}/health`, { cache: 'no-store', signal: AbortSignal.timeout(3000) })
    if (!response.ok) throw new Error('upstream unhealthy')
    return NextResponse.json({ status: 'ready', dependency: 'lab06-api' })
  } catch {
    return NextResponse.json({ status: 'unavailable', dependency: 'lab06-api' }, { status: 503 })
  }
}
