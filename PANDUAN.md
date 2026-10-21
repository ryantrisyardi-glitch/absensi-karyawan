# Panduan Setup Aplikasi Absensi (untuk yang bukan IT)

Aplikasi ini terdiri dari 4 file: `index.html`, `manifest.json`, `sw.js`, `firestore.rules`.
Semuanya gratis: hosting di **GitHub Pages**, data di **Firebase** (paket gratis "Spark").

---

## BAGIAN 1 — Buat Project Firebase (tempat data disimpan)

1. Buka https://console.firebase.google.com, login pakai akun Google.
2. Klik **"Add project"** → beri nama misalnya `absensi-perusahaan-saya` → lanjut (boleh matikan Google Analytics) → **Create project**.
3. Di menu kiri, klik **Build → Authentication** → tab **Sign-in method** → aktifkan:
   - **Google**
   - **Email/Password**
4. Di menu kiri, klik **Build → Firestore Database** → **Create database** → pilih lokasi terdekat (misal `asia-southeast2`) → mode **Production**.
5. Setelah database dibuat, klik tab **Rules** di atas, hapus isinya, lalu **copy-paste seluruh isi file `firestore.rules`** yang saya buatkan, klik **Publish**.
6. Klik ikon gerigi (⚙️) di kiri atas → **Project settings**. Di bagian bawah "Your apps", klik ikon **`</>`** (Web app) → beri nama apa saja → **Register app**.
7. Firebase akan menampilkan kode `firebaseConfig = {...}`. **Copy semua isinya.**
8. Buka file `index.html`, cari bagian:
   ```
   const firebaseConfig = { ... GANTI ... };
   ```
   Ganti seluruh isi `{ ... }` itu dengan yang Anda copy dari Firebase tadi. Simpan file.
9. Masih di `index.html`, cari baris:
   ```
   const SUPERADMIN_EMAIL = "superadmin@contoh.com";
   ```
   Ganti dengan email Google/email Anda sendiri (ini akan otomatis menjadi Superadmin saat pertama kali login).

---

## BAGIAN 2 — Upload ke GitHub (hosting gratis)

1. Buka https://github.com, buat akun jika belum punya.
2. Klik tombol **"+"** di kanan atas → **New repository**.
   - Repository name: misal `absensi-karyawan`
   - Pilih **Public**
   - Klik **Create repository**
3. Di halaman repo baru, klik **"uploading an existing file"**.
4. Drag & drop semua file website (`index.html`, `manifest.json`, `sw.js`, `styles.css`, `icon-192.png`, `icon-512.png`, `favicon.ico`) — **firestore.rules TIDAK perlu diupload ke GitHub**, itu khusus untuk di-paste ke Firebase Console saja.
5. Klik **Commit changes**.
6. Masuk ke tab **Settings** (di repo) → menu kiri **Pages**.
   - Source: pilih branch **main**, folder **/ (root)** → **Save**.
7. Tunggu 1-2 menit, GitHub akan menampilkan alamat website Anda, contoh:
   `https://namaanda.github.io/absensi-karyawan/`
   Itulah alamat aplikasi absensi Anda — bisa dibuka di HP/laptop siapa saja.

---

## BAGIAN 3 — Izinkan domain GitHub Pages login Google

1. Kembali ke Firebase Console → **Authentication → Settings → Authorized domains**.
2. Klik **Add domain**, masukkan domain GitHub Pages Anda, contoh: `namaanda.github.io`.

---

## BAGIAN 4 — Cara Pakai Aplikasi (v2)

1. Buka alamat GitHub Pages Anda di HP (bisa "Add to Home Screen" agar seperti aplikasi asli — ini fitur PWA).
2. **Login pertama kali pakai email Superadmin** yang tadi Anda set di `SUPERADMIN_EMAIL` → otomatis jadi Superadmin.
3. Sebagai Superadmin, buka tab **Kantor**:
   - Klik peta untuk menandai lokasi kantor, atau klik **"Gunakan Lokasi Saya"** saat berada di lokasi kantor.
   - Klik **"Deteksi Alamat"** untuk otomatis mengisi Kelurahan/Kecamatan/Kota (bisa disunting manual jika kurang tepat).
   - Pilih radius (100–1000 meter), beri nama kantor, klik **Simpan Kantor**.
   - Bisa tambah **lebih dari satu kantor/cabang** — karyawan otomatis dicocokkan ke kantor terdekat saat absen.
4. Buka tab **Shift** untuk membuat jadwal shift (nama + jam mulai/selesai). Shift bisa diedit kapan saja lewat ikon pensil.
5. Karyawan tinggal buka link yang sama, login dengan Google atau daftar email sendiri → otomatis muncul di tab **Karyawan**.
6. Di tab **Karyawan**, untuk tiap karyawan Anda bisa:
   - Klik **Info** untuk mengisi **Nama** dan **NIK**.
   - Klik **Jadwal** untuk mengatur **shift per hari** (misal Senin–Kamis Shift Pagi, Jumat Shift Siang, Sabtu-Minggu libur).
   - Nonaktifkan akun karyawan yang resign, atau (khusus Superadmin) jadikan **Admin**.
7. Karyawan klik **Clock In/Out**; sistem otomatis ambil jam server + GPS, mencocokkan ke kantor terdekat, dan menolak jika di luar radius **semua** kantor. Karyawan juga bisa melihat peta lokasi kantor & radius absen langsung dari dashboard.
8. Admin/Superadmin buka tab **Absensi**:
   - **Rekap Harian** — laporan mudah dibaca: 1 baris per karyawan per hari, jam masuk (clock-in pertama) & jam keluar (clock-out terakhir), plus status otomatis: *Tepat Waktu*, *Terlambat X menit*, *Lupa Clock In*, atau *Lupa Clock Out*.
   - **Data Mentah** — semua log absen apa adanya (untuk audit detail).
   - Tombol **Export Excel** mengekspor tampilan yang sedang aktif.

---

## Tentang Peta & Lokasi (Leaflet + OpenStreetMap — 100% Gratis)

Aplikasi ini memakai **Leaflet.js** dengan peta **OpenStreetMap**, bukan Google Maps API, karena:
- Tidak perlu API key atau kartu kredit.
- Tidak ada batas jumlah request/bulan seperti Google Maps.
- Google Maps API tetap bisa dipakai kalau Anda mau (perlu billing account + API key), tapi untuk kebutuhan absensi karyawan, Leaflet+OSM sudah lebih dari cukup dan gratis selamanya.

Deteksi alamat (Kelurahan/Kecamatan/Kota) memakai **Nominatim** (layanan geocoding gratis dari OpenStreetMap). Karena gratis, hasilnya kadang tidak 100% presisi seperti nama resmi kelurahan — selalu bisa disunting manual di form.

---

## Catatan Migrasi dari Versi Sebelumnya

Jika sebelumnya Anda sudah punya data di Firestore dari versi lama (1 lokasi kantor di `settings/global`, shift tunggal per karyawan `shiftId`):
- **Lokasi kantor lama tidak otomatis pindah** ke koleksi `offices` yang baru — silakan tambahkan ulang lewat tab **Kantor** (cukup sekali, hanya perlu klik peta/GPS lagi).
- **Shift karyawan lama (`shiftId`) tidak otomatis terisi ke jadwal mingguan baru** — buka tab **Karyawan → Jadwal** untuk tiap karyawan dan atur ulang jadwal per harinya (biasanya cukup pilih shift yang sama untuk Senin–Jumat).
- Data riwayat absensi (`attendance`) lama tetap aman dan tetap muncul di laporan.

---

## Tentang Keamanan & Batasan Jujur

Sudah diterapkan untuk mencegah kecurangan:
- **Jam absen diambil dari server Google (Firebase), bukan dari HP karyawan** — karyawan tidak bisa mengubah jam sistem HP-nya untuk memalsukan waktu absen.
- **Lokasi kantor & radius hanya bisa diubah admin**, tersimpan di server, tidak bisa dimanipulasi dari HP karyawan.
- **Karyawan tidak bisa mengubah/menghapus riwayat absensinya sendiri** (aturan ini dikunci di Firestore Rules, bukan cuma di tampilan — jadi walau karyawan paham coding, tetap tidak bisa lewat).
- **Karyawan tidak bisa mengubah Nama/NIK-nya sendiri atau menaikkan role jadi admin** — dikunci di server (Firestore Rules), bukan cuma disembunyikan di tampilan.
- Sistem menolak absen jika **akurasi GPS terlalu buruk** (>150m) atau **berada di luar radius semua kantor terdaftar**.

**Batasan yang jujur perlu Anda tahu:** aplikasi berbasis web (bukan aplikasi native Android/iOS) tidak bisa 100% mendeteksi aplikasi *fake GPS* di Android yang di-root. Tidak ada aplikasi absensi berbasis GPS manapun (termasuk yang berbayar) yang bisa menjamin 100% anti fake-GPS jika HP karyawan sudah di-root/dimodifikasi. Kalau ini jadi risiko besar di perusahaan Anda, dua opsi tambahan yang bisa ditambahkan nanti (butuh pengembangan lanjutan, bisa saya bantu buatkan kalau diperlukan):
1. **Wajib foto selfie** saat clock in/out (kamera depan), tersimpan untuk verifikasi visual oleh admin.
2. **Kode QR unik** yang dipasang fisik di lokasi kantor dan harus di-scan saat absen, sebagai lapisan kedua selain GPS.

---

## Menambah/Mengurangi Karyawan
- **Menambah**: karyawan cukup buka link aplikasi dan login/daftar sendiri — otomatis masuk daftar karyawan (status aktif).
- **Mengurangi**: klik **"Nonaktifkan"** pada nama karyawan di tab Karyawan. (Menghapus akun secara total dari sistem Google butuh fitur tambahan/server — menonaktifkan sudah cukup untuk menghentikan akses absen karyawan tersebut.)
