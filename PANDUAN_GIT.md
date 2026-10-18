# Tambahan — Git ke repo pribadi Lab 08

**Kebijakan kelas:** Lab ini latihan formatif, tanpa tugas, nilai, atau penyerahan terpisah. Satu proyek besar dikerjakan oleh kelompok **3 orang**, dengan presentasi checkpoint minggu 7 (UTS) dan hasil akhir minggu 14 (UAS). Simpan hasil lab hanya bila berguna sebagai referensi atau bukti proses proyek. Baca [brief proyek kelompok](PROYEK_KELOMPOK.md). Bobot resmi tetap mengikuti RPS/LMS.

Push tidak diperlukan untuk menyelesaikan praktik lokal. Bagian ini dipakai untuk menyimpan source pribadi atau melakukan deployment Vercel.

1. Buka [repo materi Lab 08](https://github.com/SeedFlora/meet8CloudService), pilih **Use this template**, dan buat repo pribadi.
2. Clone URL repo pribadi ke folder baru, lalu buka PowerShell pada root clone. Salin perubahan source latihan yang ingin disimpan ke clone itu.
3. Jalankan `git remote -v`; alamat origin harus repo milik Anda. Jangan menaruh token/password dalam URL remote.
4. Periksa file sebelum commit:

```powershell
git status --short
git check-ignore -v .env.local node_modules .next
git add README.md src package.json package-lock.json
git diff --cached --name-only
git diff --cached --check
git commit -m "lab08: latihan Cloud Notes"
git push
```

Daftar staged tidak boleh berisi `.env.local`, password, token, `node_modules`, atau `.next`. Laporan dan screenshot pribadi boleh ditambahkan terpisah setelah dipilih. Tidak ada kewajiban membuat laporan atau melakukan push.

Pada penggunaan Git pertama, isi identitas lokal repo melalui `git config user.name "Nama Anda"` dan `git config user.email "email@contoh.com"`. Selesaikan login GitHub yang diminta Git; jangan menyimpan kredensial di source.
