'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Note = { id: string | number; title: string; content: string; created_at?: string }

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const refresh = useCallback(async () => {
    if (supabase) {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData.user) { setUserId(null); setNotes([]); return }
      setUserId(userData.user.id)
      const { data, error } = await supabase.from('notes').select('id,title,content,created_at').order('created_at', { ascending: false })
      if (error) throw error
      setNotes(data || [])
    } else {
      const response = await fetch('/api/notes', { cache: 'no-store' })
      if (!response.ok) throw new Error('API lokal gagal. Jalankan Compose Lab 06.')
      setNotes(await response.json())
    }
  }, [])

  useEffect(() => { refresh().catch((error) => setMessage(String(error))) }, [refresh])

  async function authenticate(signup: boolean) {
    if (!supabase) return
    setBusy(true); setMessage('')
    try {
      const result = signup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })
      if (result.error) throw result.error
      setMessage(signup && !result.data.session ? 'Cek email untuk konfirmasi akun, lalu masuk.' : 'Autentikasi berhasil.')
      await refresh()
    } catch (error) { setMessage(String(error)) }
    finally { setBusy(false) }
  }

  async function addNote(event: FormEvent) {
    event.preventDefault()
    setBusy(true); setMessage('')
    try {
      if (supabase) {
        if (!userId) throw new Error('Masuk terlebih dahulu.')
        const { error } = await supabase.from('notes').insert({ title: title.trim(), content: content.trim(), user_id: userId })
        if (error) throw error
      } else {
        const response = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) })
        if (!response.ok) throw new Error(await response.text())
      }
      setTitle(''); setContent('')
      await refresh()
    } catch (error) { setMessage(String(error)) }
    finally { setBusy(false) }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setUserId(null)
    setNotes([])
  }

  return <main>
    <span className="badge">Lab 08 · Next.js App Router</span>
    <h1>Cloud Notes</h1>
    <p className="muted">Catatan kelas dengan dua jalur data: API Compose lokal atau Supabase Auth + RLS.</p>
    <p>Mode aktif: <strong>{supabase ? 'Supabase' : 'API lokal'}</strong></p>

    {supabase && !userId && <section>
      <h2>Masuk atau daftar</h2>
      <form onSubmit={(event) => { event.preventDefault(); authenticate(false) }}>
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /></label>
        <div className="row">
          <button disabled={busy}>Masuk</button>
          <button className="secondary" type="button" disabled={busy} onClick={() => authenticate(true)}>Daftar</button>
        </div>
      </form>
    </section>}

    {(!supabase || userId) && <section>
      <div className="row"><h2>Tulis catatan</h2>{supabase && <button className="secondary" type="button" onClick={signOut}>Keluar</button>}</div>
      <form onSubmit={addNote}>
        <label>Judul<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required /></label>
        <label>Isi<textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={5000} required /></label>
        <button disabled={busy}>Simpan</button>
      </form>
    </section>}

    {message && <p className="error" role="status">{message}</p>}
    <section><h2>Daftar catatan</h2>
      {notes.length === 0 ? <p className="muted">Belum ada catatan yang terlihat.</p> : notes.map((note) => <article key={note.id}><h3>{note.title}</h3><p>{note.content}</p></article>)}
    </section>
  </main>
}
