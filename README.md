# Lab 08 — Next.js + Vercel + Supabase

**Capaian:** membangun App Router, membedakan kode browser dan server, membuat Route Handler GET/POST, menghubungkan BaaS memakai publishable key, serta mendemonstrasikan deploy otomatis dari Git. Kode yang sama bisa dicoba tanpa akun cloud.

## Jalur lokal tanpa akun

1. Clone [repo Lab 06](https://github.com/SeedFlora/meet6CloudService) di komputer/Codespace **yang sama** dan jalankan Compose dari root repo itu (`docker compose up --build -d --wait`). `localhost` pada dua Codespace terpisah tidak saling terhubung.
2. Dari root repo Lab 08 ini, pastikan Node.js minimal 20.9, lalu:

```bash
node --version
npm ci
cp .env.example .env.local
npm run dev
```

Pada PowerShell, ganti baris `cp` dengan `Copy-Item .\.env.example .\.env.local`. Buka `http://localhost:3000`, buat catatan, lalu lihat data lewat `http://127.0.0.1:8000/notes`. Route Handler `/api/notes` meneruskan request ke API Lab 06 dari sisi server, sehingga browser tidak perlu mengakses network Compose langsung.

Uji:

```bash
npm run check:local
npm run typecheck
npm run build
```

## Jalur Supabase

Jalankan `schema.sql` dari [repo Lab 07](https://github.com/SeedFlora/meet7CloudService). Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` di `.env.local`, lalu restart `npm run dev`. Daftar, verifikasi email bila diminta, masuk, dan tulis catatan. Bandingkan dua akun: RLS hanya menampilkan data pemilik. Variabel `NEXT_PUBLIC_` memang dibundel ke browser, jadi **hanya** URL dan publishable key boleh berada di sana. Service role/secret key tidak boleh disimpan sebagai `NEXT_PUBLIC_`.

## Git → Vercel (opsional)

1. Commit repo ke GitHub. Pastikan `.env.local` tidak ikut (`git status`).
2. Import repo di Vercel; pilih root directory `.`.
3. Atur environment variables mode Supabase di pengaturan project, lalu deploy. Jangan set `LOCAL_API_URL` ke `localhost` untuk deployment, karena container Lab 06 hanya hidup di laptop. Gunakan Supabase untuk URL publik.
4. Push perubahan kecil ke branch Git dan amati preview deployment; merge ke branch produksi untuk auto-deploy. Custom domain hanya latihan opsional bila sudah punya domain.

**Bukti:** screenshot UI lokal dan `/api/health`, response GET/POST Route Handler, commit Git, serta URL preview/produksi bila ada. Diskusikan SSR/SSG/ISR dan Server/Client Components; halaman ini sengaja memakai Client Component untuk form dan Auth. Route Handler serta logger berjalan di server.

Rujukan: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers), [Vercel Git deployment](https://vercel.com/docs/git), [Supabase frontend security](https://supabase.com/docs/guides/database/secure-data).

`npm run check:local` memerlukan Next.js dan API Lab 06 aktif; jalankan pada terminal kedua sebelum menghentikan `npm run dev`. Hasil uji lokal: **9 PASS, 0 FAIL**. `/api/health` memeriksa Next saja; `/api/ready` ikut memeriksa kesehatan Lab 06. Gunakan `http://localhost:3000` untuk browser dev lokal.

Panduan: [modul mahasiswa dan kunci](MODUL_MAHASISWA.md), [panduan dosen](PANDUAN_DOSEN.md), [panduan Git](PANDUAN_GIT.md). Screenshot ada di `screenshots/`; laporan pribadi memakai `hasil/TEMPLATE_LAPORAN.md`.
