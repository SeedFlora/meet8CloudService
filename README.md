# Lab 08 — Cloud Notes dengan Next.js lokal

**Kebijakan kelas:** Lab ini latihan formatif, tanpa tugas, nilai, atau penyerahan terpisah. Satu proyek besar dikerjakan oleh kelompok **3 orang**, dengan presentasi checkpoint minggu 7 (UTS) dan hasil akhir minggu 14 (UAS). Simpan hasil lab hanya bila berguna sebagai referensi atau bukti proses proyek. Baca [brief proyek kelompok](PROYEK_KELOMPOK.md). Bobot resmi tetap mengikuti RPS/LMS.

Praktik utama memakai **PowerShell, Node 22+, dan Docker Desktop**. Frontend Next.js di port 3000 meneruskan GET/POST melalui Route Handler server ke API Compose Lab 06 di **18006**. Akun cloud tidak diperlukan.

Mulai dari [modul langkah demi langkah](MODUL_MAHASISWA.md) atau [PDF](MODUL_MAHASISWA.pdf). Modul memisahkan terminal backend, frontend, dan pemeriksaan agar perintah tidak tersangkut di server yang sedang berjalan.

## Terminal 1 — backend Lab 06

Buka PowerShell di folder tempat menyimpan proyek:

```powershell
git clone https://github.com/SeedFlora/meet6CloudService.git meet6CloudService-local
Set-Location .\meet6CloudService-local
Copy-Item .\.env.example .\.env
docker compose up --build -d --wait
docker compose ps
curl.exe -i http://127.0.0.1:18006/health
```

Gunakan clone Lab 06 yang sudah sehat dari pertemuan sebelumnya sebagai pengganti clone baru. Pada clone lama, pertahankan `.env` dan volume. Hasil health harus HTTP 200 dan menyebut PostgreSQL serta Redis.

## Terminal 2 — frontend Lab 08

Buka PowerShell baru di folder induk yang sama:

```powershell
git clone https://github.com/SeedFlora/meet8CloudService.git meet8CloudService-local
Set-Location .\meet8CloudService-local
node --version
npm --version
npm ci
Copy-Item .\.env.example .\.env.local
npm run dev
```

Node harus versi **22+**, sesuai seluruh dependensi proyek. Buka <http://localhost:3000>. Buat catatan dan cocokkan hasilnya dengan <http://127.0.0.1:18006/notes>. Biarkan terminal 2 menjalankan Next.js.

## Terminal 3 — pemeriksaan

Buka terminal pada folder `meet8CloudService-local`:

```powershell
curl.exe -i http://localhost:3000/api/health
curl.exe -i http://localhost:3000/api/ready
```

Keduanya HTTP 200. Health memeriksa Next.js; ready memeriksa API Lab 06. Ikuti modul untuk uji POST, validasi HTTP 400, pembahasan source, typecheck, dan build. Checker tambahan `npm run check:local` membuat satu catatan uji; bukan prasyarat praktik.

## Materi pendamping

- [Teori Vercel dan Next.js](slides/Teori_Pertemuan_08.pptx)
- [Slide praktik lokal](slides/LAB08_Cloud_Notes_Nextjs_Bukti_Live.pptx)
- [Git opsional ke repo pribadi](PANDUAN_GIT.md)
- [Proyek kelompok](PROYEK_KELOMPOK.md)

Bagian tambahan modul menjelaskan Supabase dan Git deployment ke Vercel. `.env.local` berada pada root repo, `LOCAL_API_URL` hanya dipakai server, sedangkan `NEXT_PUBLIC_SUPABASE_*` terlihat di browser. Gunakan hanya URL dan publishable key pada `NEXT_PUBLIC_`; service role/secret key tidak boleh berada di sana. Restart server sesudah mengubah konfigurasi.
