Revisi prototype dashboard web ARDIS (Archive Records Destruction Information System) yang sudah ada.

Jangan ubah identitas visual utama sistem. Pertahankan gaya desain prototype saat ini:
- Dashboard modern, clean, profesional
- Sidebar kiri warna navy/dark blue
- Topbar gelap
- Aksen orange untuk menu aktif
- Card putih dengan border halus
- Tombol utama biru
- Tombol aksi hijau, merah, dan biru sesuai fungsi
- Elemen hak akses menggunakan warna ungu
- Tabel modern, rapi, dan konsisten
- Layout desktop dashboard

Fokus revisi hanya pada:
- Struktur halaman
- Isi tabel
- Label kolom
- Filter
- Role dan hak akses
- Data jumlah box
- Alur fitur
- Detail data arsip

Jangan membuat ulang desain dari nol. Buat semua halaman dalam frame terpisah, bukan satu gambar gabungan.

==================================================
1. DATA USER DAN ROLE
==================================================

Sistem memiliki 7 akun:
- 1 akun Admin
- 6 akun staf kearsipan

Data akun:

1. Admin
- Dedy Dwi A

2. Arsiparis Umum
- Ari Riski H
- Donny Setiadi
- Dela Yuliani

3. Petugas Pencacahan
- Imam Saputra
- Agung Pratama

Role sistem:
- Role 1: Admin
- Role 2: Arsiparis Umum
- Role 3: Petugas Pencacahan

==================================================
2. ATURAN UMUM UNTUK SEMUA HALAMAN
==================================================

Terapkan aturan berikut di seluruh halaman prototype.

1. Semua menu tetap terlihat di sidebar untuk semua role.
Namun, fitur dan aksi di dalam menu menyesuaikan hak akses masing-masing role.

2. Jika ada checkbox data/box yang dipilih, jangan tampilkan teks keterangan box terpilih.

Hapus semua teks seperti:
- “1 box dipilih”
- “1 box dipilih — 4 berkas”
- “1 box dipilih — 6 berkas”
- “4 berkas dipilih”
- atau teks ringkasan pilihan lain yang sejenis.

Cukup tampilkan checkbox aktif pada tabel dan tombol aksi yang tersedia.

3. Pada semua daftar arsip/dokumen, kolom “Jumlah” berarti:
- 1 baris informasi = 1 box

Jadi semua baris pada kolom Jumlah harus menampilkan:
- 1 box

Jangan gunakan:
- 3 berkas
- 4 berkas
- 5 berkas
- 6 berkas
- atau jumlah berkas lainnya.

4. Ganti semua label kolom:
- “Departemen/Pencipta” menjadi “Pencipta Arsip”

5. Hapus semua filter “Bulan”.
Ganti dengan filter:
- Tahun Arsip

6. Struktur kolom utama pada daftar arsip/dokumen harus konsisten:
- Kode Klasifikasi
- Uraian Dokumen
- Tahun Arsip
- Pencipta Arsip
- ROP
- Jumlah

7. Jika halaman membutuhkan tanggal, gunakan label tanggal sesuai konteks:
- Usulan Musnah: Tanggal Entry
- Pengajuan: Tanggal Entry dan Tanggal Pengajuan
- Temporary Storage: Tgl Masuk TPS
- Pencacahan Arsip: Tgl Konfirmasi
- Riwayat Pemusnahan: Tanggal Dimusnahkan

8. Struktur ROP harus menggunakan format lokasi arsip berikut:
- Gedung A Penyimpanan 1
- Gedung A Penyimpanan 2
- Gedung A Penyimpanan 3
- Gedung B Penyimpanan 4
- Gedung B Penyimpanan 5
- Gedung C Penyimpanan 6

Nomor rak:
- Rak 1 sampai Rak 160

Kode slot/laci:
- A1, A2, A3, A4, A5
- B1, B2, B3, B4, B5
- C1, C2, C3, C4, C5
- D1, D2, D3, D4, D5
- E1, E2, E3, E4, E5
- F1, F2, F3, F4, F5

Setiap slot seperti A1 memiliki kapasitas 6 box.

Contoh format ROP pada tabel:
- Gedung A Penyimpanan 1 • Rak 143 • A3 • Box 5
- Gedung A Penyimpanan 2 • Rak 27 • B1 • Box 2
- Gedung A Penyimpanan 3 • Rak 45 • A5 • Box 3
- Gedung B Penyimpanan 4 • Rak 82 • B2 • Box 3
- Gedung B Penyimpanan 5 • Rak 120 • E3 • Box 6
- Gedung C Penyimpanan 6 • Rak 10 • C1 • Box 1

==================================================
3. FRAME 1 — DASHBOARD
==================================================

Buat halaman Dashboard untuk akun Admin.

Menu sidebar yang tampil:
- Dashboard
- Data Pegawai
- Usulan Musnah
- Pengajuan
- Temporary Storage (TPS)
- Pencacahan Arsip
- Riwayat Aktivitas
- Pengaturan
- Keluar

Menu Dashboard aktif.

Area konten menampilkan ringkasan statistik:
- Total Box Dimusnahkan: 490 box
- Usulan Musnah: 200 box
- Dalam Pengajuan: 80 box
- Di TPS: 130 box
- Antrian Pencacahan: 85 box
- Tahun Operasional: 2026

Tampilkan grafik:
- Arsip Dimusnahkan per Bulan
- Status Alur Arsip

Pada bagian bawah, tampilkan tabel:
Judul tabel:
Aktivitas Pemusnahan Terbaru

Kolom tabel:
- No
- Tanggal
- Kode Klasifikasi
- Uraian Dokumen
- Tahun Arsip
- Pencipta Arsip
- ROP
- Jumlah
- Petugas

Ketentuan:
- Semua baris pada kolom Jumlah = 1 box
- Gunakan badge hijau atau soft green untuk label “1 box”
- Gunakan label “Pencipta Arsip”, bukan “Departemen/Pencipta”

==================================================
4. FRAME 2 — ADMIN / DATA PEGAWAI / SUBMENU PEGAWAI
==================================================

Buat halaman Data Pegawai untuk akun Admin:
Dedy Dwi A

Menu Data Pegawai aktif dan memiliki 2 submenu:
- Pegawai
- Role

Submenu Pegawai aktif.

Area konten:
Judul halaman:
Data Pegawai

Breadcrumb:
Dashboard / Data Pegawai / Pegawai

Tombol kanan atas:
+ Tambah Pegawai

Tampilkan 3 kartu statistik:
- Jumlah Pegawai: 6 orang
- Total Box Dimusnahkan: 490 box
- Rata-rata per Pegawai: 82 box/pegawai

Tampilkan grafik batang:
Judul:
Statistik Distribusi per Pegawai

Data grafik:
- Dedy: 0 box
- Ari: 0 box
- Donny: 0 box
- Dela: 0 box
- Imam: 238 box
- Agung: 252 box

Keterangan data:
Jumlah box dicacah sementara hanya dimiliki oleh Petugas Pencacahan:
- Imam Saputra: 238 box dari Januari sampai Mei
- Agung Pratama: 252 box dari Januari sampai Mei
Pegawai lain sementara 0 box.

Di bawah grafik, tampilkan tabel:
Judul tabel:
Daftar Pegawai Unit Kearsipan

Kolom:
- No
- Nama Pegawai
- Nomor Pegawai
- Jabatan
- Unit
- Jumlah Box Dicacah
- Hak Akses
- Aksi

Isi tabel:
1. Dedy Dwi A
   Hak Akses: Admin
   Jumlah Box Dicacah: 0 box

2. Ari Riski H
   Hak Akses: Arsiparis Umum
   Jumlah Box Dicacah: 0 box

3. Donny Setiadi
   Hak Akses: Arsiparis Umum
   Jumlah Box Dicacah: 0 box

4. Dela Yuliani
   Hak Akses: Arsiparis Umum
   Jumlah Box Dicacah: 0 box

5. Imam Saputra
   Hak Akses: Petugas Pencacahan
   Jumlah Box Dicacah: 238 box

6. Agung Pratama
   Hak Akses: Petugas Pencacahan
   Jumlah Box Dicacah: 252 box

Aksi untuk Admin:
- Detail
- Edit
- Delete

Admin dapat menambah pegawai.

==================================================
5. FRAME 3 — ADMIN / DATA PEGAWAI / SUBMENU ROLE
==================================================

Buat halaman Role untuk akun Admin:
Dedy Dwi A

Menu Data Pegawai aktif.
Submenu Role aktif.

Area konten:
Judul halaman:
Kelola Hak Akses Pegawai

Subjudul:
Atur izin akses menu dan fitur untuk setiap role.

Buat tampilan matrix hak akses / tabel role management.

Tampilkan 3 role:
- Role 1: Admin (Dedy)
- Role 2: Arsiparis Umum (Ari, Donny, Dela)
- Role 3: Petugas Pencacahan (Imam, Agung)

Baris menu:
- Dashboard
- Data Pegawai (Pegawai)
- Data Pegawai (Role)
- Usulan Musnah
- Pengajuan
- Temporary Storage (TPS)
- Pencacahan Arsip
- Riwayat Aktivitas
- Pengaturan

Kolom hak akses:
- Lihat
- Tambah
- Edit
- Hapus
- Approve
- Import Excel
- Export Data

Gunakan checkbox atau permission icon berwarna ungu.

Aturan akses:

Role Admin:
- Bisa mengakses semua menu
- Bisa melihat
- Bisa menambah
- Bisa mengedit
- Bisa menghapus
- Bisa approve
- Bisa import excel
- Bisa export data
- Bisa mengelola hak akses pegawai

Role Arsiparis Umum:
- Semua menu terlihat
- Data Pegawai hanya menampilkan data pribadi
- Tidak bisa akses submenu Pegawai
- Tidak bisa akses submenu Role
- Usulan Musnah dapat dikelola
- Pengajuan dapat mengedit, memindahkan, mengajukan, dan mengembalikan
- Temporary Storage hanya view
- Pencacahan Arsip hanya view
- Riwayat Aktivitas hanya view
- Pengaturan hanya view

Role Petugas Pencacahan:
- Semua menu terlihat
- Data Pegawai hanya menampilkan data pribadi
- Tidak bisa akses submenu Pegawai
- Tidak bisa akses submenu Role
- Usulan Musnah hanya view
- Pengajuan hanya view
- Temporary Storage dapat mengedit, memindahkan, dan mengembalikan
- Pencacahan Arsip dapat mengedit, memindahkan, dan mengembalikan
- Riwayat Aktivitas hanya view
- Pengaturan hanya view

Tambahkan tombol bawah:
- Reset ke Default Role
- Simpan Perubahan

==================================================
6. FRAME 4 — ARSIPARIS UMUM / DATA PEGAWAI PRIBADI
==================================================

Buat halaman Data Pegawai untuk akun Arsiparis Umum.

Contoh user login:
Ari Riski H

Sidebar tetap menampilkan semua menu:
- Dashboard
- Data Pegawai
- Usulan Musnah
- Pengajuan
- Temporary Storage (TPS)
- Pencacahan Arsip
- Riwayat Aktivitas
- Pengaturan
- Keluar

Menu Data Pegawai aktif.
Tidak ada submenu Pegawai.
Tidak ada submenu Role.

Area konten:
Judul halaman:
Data Pegawai

Breadcrumb:
Dashboard / Data Pegawai

Tampilkan 3 kartu statistik:
- Jumlah Pegawai: 6 orang
- Total Box Dimusnahkan: 490 box
- Rata-rata box dimusnahkan per pegawai: 82 box/pegawai

Tampilkan grafik distribusi per pegawai:
- Dedy: 0 box
- Ari: 0 box
- Donny: 0 box
- Dela: 0 box
- Imam: 238 box
- Agung: 252 box

Hapus daftar pegawai umum.
Ganti menjadi section:
Data Pribadi

Tabel Data Pribadi berisi 1 baris user login:
- Nama Pegawai: Ari Riski H
- Nomor Pegawai
- Jabatan: Arsiparis
- Unit: Kearsipan
- Jumlah Box Dicacah: 0 box
- Hak Akses: Arsiparis Umum
- Aksi: Detail

Tambahkan tombol:
- Export Excel

Tidak boleh ada:
- Tambah Pegawai
- Edit
- Delete
- Submenu Pegawai
- Submenu Role

Tambahkan info:
Anda hanya dapat melihat data pribadi Anda sesuai hak akses Arsiparis Umum.

==================================================
7. FRAME 5 — PETUGAS PENCACAHAN / DATA PEGAWAI PRIBADI
==================================================

Buat halaman Data Pegawai untuk akun Petugas Pencacahan.

Contoh user login:
Imam Saputra

Sidebar tetap menampilkan semua menu:
- Dashboard
- Data Pegawai
- Usulan Musnah
- Pengajuan
- Temporary Storage (TPS)
- Pencacahan Arsip
- Riwayat Aktivitas
- Pengaturan
- Keluar

Menu Data Pegawai aktif.
Tidak ada submenu Pegawai.
Tidak ada submenu Role.

Area konten:
Judul halaman:
Data Pegawai

Breadcrumb:
Dashboard / Data Pegawai

Tampilkan 3 kartu statistik:
- Jumlah Pegawai: 6 orang
- Total Box Dimusnahkan: 490 box
- Rata-rata box dimusnahkan per pegawai: 82 box/pegawai

Tampilkan grafik distribusi per pegawai:
- Dedy: 0 box
- Ari: 0 box
- Donny: 0 box
- Dela: 0 box
- Imam: 238 box
- Agung: 252 box

Hapus daftar pegawai umum.
Ganti menjadi section:
Data Pribadi

Tabel Data Pribadi berisi 1 baris user login:
- Nama Pegawai: Imam Saputra
- Nomor Pegawai
- Jabatan: Petugas Pencacahan
- Unit: Kearsipan
- Jumlah Box Dicacah: 238 box
- Hak Akses: Petugas Pencacahan
- Aksi: Detail

Tambahkan tombol:
- Export Excel

Tidak boleh ada:
- Tambah Pegawai
- Edit
- Delete
- Submenu Pegawai
- Submenu Role

Tambahkan info:
Anda hanya dapat melihat data pribadi Anda sesuai hak akses Petugas Pencacahan.

==================================================
8. FRAME 6 — USULAN MUSNAH
==================================================

Buat halaman Usulan Musnah.

Menu Usulan Musnah aktif.

Area konten:
Judul:
Usulan Musnah

Subjudul:
Arsip retensi habis yang diusulkan untuk dimusnahkan.

Card statistik:
- Arsip Retensi Habis: 100 box
- Usulan Musnah: 200 box
- Dalam Pengajuan: 80 box
- Total di TPS: 130 box

Tombol kanan atas:
- Import Excel
- Entry Data

Filter:
- Search / Cari nama berkas
- Pencipta Arsip
- ROP
- Tahun Arsip

Tambahkan filter ROP dengan struktur:
- Gedung
- Penyimpanan
- Rak
- Slot
- Box

Tabel:
Judul tabel:
Daftar Usulan Musnah — 200 box

Kolom:
- Checkbox
- Tanggal Entry
- Kode Klasifikasi
- Uraian Dokumen
- Tahun Arsip
- Pencipta Arsip
- ROP
- Jumlah
- Aksi

Ketentuan:
- Semua baris pada kolom Jumlah = 1 box
- ROP menggunakan format yang sudah ditentukan
- Tambahkan kolom Aksi
- Pada kolom Aksi tampilkan icon Detail berbentuk mata
- Detail digunakan untuk melihat informasi dokumen
- Detail juga bisa menampilkan note/catatan yang berkaitan dengan proses pengembalian dari TPS
- Jangan tampilkan keterangan box terpilih walaupun ada checkbox aktif

==================================================
9. FRAME 7 — PENGAJUAN
==================================================

Buat halaman Pengajuan.

Menu Pengajuan aktif.

Area konten:
Judul:
Pengajuan

Tampilkan panduan alur pengajuan seperti desain sebelumnya, tetapi tetap rapi.

Filter:
- Pencipta Arsip
- Tahun Arsip
- ROP
- Lokasi Arsip
- No Rak
- Status

Hapus filter:
- Bulan

Tambahkan filter:
- Tahun Arsip
- ROP

Tombol aksi:
- Unduh Daftar Pengajuan (Excel)
- Kembalikan
- Setujui & Pindahkan ke TPS

Hapus semua keterangan box terpilih seperti:
- “1 box dipilih”
- “1 box dipilih — 4 berkas”
- atau teks sejenisnya

Tabel:
Judul tabel:
Daftar Pengajuan — 80 box

Kolom:
- Checkbox
- Tanggal Entry
- Tanggal Pengajuan
- Kode Klasifikasi
- Uraian Dokumen
- Tahun Arsip
- Pencipta Arsip
- ROP
- Jumlah
- Status

Hapus kolom:
- Masa Retensi

Ketentuan:
- Semua baris pada kolom Jumlah = 1 box
- ROP mengikuti format yang sama seperti Usulan Musnah
- Status dapat berupa Baru Masuk, Menunggu Persetujuan, Disetujui, atau Ditolak sesuai kebutuhan visual

==================================================
10. FRAME 8 — TEMPORARY STORAGE (TPS)
==================================================

Buat halaman Temporary Storage (TPS).

Menu Temporary Storage (TPS) aktif.

Area konten:
Judul:
Temporary Storage (TPS)

Subjudul:
Tempat penyimpanan sementara arsip yang telah disetujui dan menunggu proses pencacahan.

Card statistik:
- Total Arsip di TPS: 130 box
- Box Baru Masuk: 50 box
- Box Dalam Antrian: 80 box
- Box Terpilih: boleh tetap ada sebagai card statistik, tetapi jangan tampilkan ringkasan box terpilih di area tabel

Filter:
- Search / Cari nama dokumen
- Pencipta Arsip atau Departemen
- Tahun Arsip
- ROP
- Status

Hapus filter:
- Bulan

Tambahkan filter:
- Tahun Arsip
- ROP

Tombol aksi:
- Kembalikan
- Pindahkan dan Konfirmasi Pencacahan

Hapus teks ringkasan di atas tabel seperti:
- “1 box dipilih”
- “1 box dipilih — 4 berkas”
- “4 berkas dipilih”

Tabel:
Judul tabel:
Daftar Arsip di TPS — 130 box

Kolom:
- Checkbox
- Tgl Masuk TPS
- Kode Klasifikasi
- Uraian Dokumen
- Tahun Arsip
- Pencipta Arsip
- ROP
- Jumlah
- Status
- Aksi

Ketentuan:
- Semua baris pada kolom Jumlah = 1 box
- Pada Uraian Dokumen hanya tampil nama dokumen atau nama box arsip
- Hapus keterangan tambahan seperti:
  “Aktif 2 thn + Inaktif 8 thn”
  “Aktif 2 thn + Inaktif 3 thn”
  atau keterangan retensi lain
- ROP menggunakan format revisi
- Tambahkan tombol Detail pada kolom Aksi

Modal fitur Kembalikan:
Saat tombol Kembalikan diklik, tampilkan modal:

Judul:
Konfirmasi Pengembalian

Subjudul:
Kembalikan box ke tahap sebelumnya.

Isi modal:
- Jumlah Box Terpilih: 1 box
- Tujuan Pengembalian: Usulan Musnah
- Catatan atau note: opsional

Hapus pilihan:
- Pengajuan

Catatan:
- Note tidak wajib diisi
- Jika note diisi, note tersebut dapat dilihat pada aksi Detail dokumen di menu Usulan Musnah

Tombol modal:
- Batal
- Simpan Pengembalian

==================================================
11. FRAME 9 — PENCACAHAN ARSIP / ANTRIAN PENCACAHAN
==================================================

Buat halaman Pencacahan Arsip pada tab Antrian Pencacahan.

Menu Pencacahan Arsip aktif.

Area konten:
Judul:
Pencacahan Arsip

Tab:
- Antrian Pencacahan
- Riwayat Pemusnahan

Tab aktif:
Antrian Pencacahan

Card statistik:
- Antrian Pencacahan: 85 box
- Riwayat Pemusnahan: 490 box
- Total Box Dimusnahkan: 490 box

Filter:
- Search / Cari nama dokumen
- Pencipta Arsip
- Tahun Arsip
- ROP

Hapus filter:
- Bulan

Tambahkan filter:
- Tahun Arsip
- ROP

Tombol aksi:
- Kembalikan
- Proses Pencacahan

Hapus semua keterangan box terpilih seperti:
- “1 box dipilih”
- “1 box dipilih — 6 berkas”

Tabel:
Judul tabel:
Antrian Pencacahan — 85 box

Kolom:
- Checkbox
- Tgl Konfirmasi
- Kode Klasifikasi
- Uraian Dokumen
- Tahun Arsip
- Pencipta Arsip
- ROP
- Jumlah
- Petugas
- Status

Ketentuan:
- Semua baris pada kolom Jumlah = 1 box
- ROP mengikuti format revisi
- Status menggunakan badge hijau “Siap Dicacah”

==================================================
12. FRAME 10 — PENCACAHAN ARSIP / RIWAYAT PEMUSNAHAN
==================================================

Buat halaman Pencacahan Arsip pada tab Riwayat Pemusnahan.

Menu Pencacahan Arsip aktif.

Tab aktif:
Riwayat Pemusnahan

Filter:
- Search / Cari nama dokumen
- Pencipta Arsip
- Tahun Arsip
- ROP

Hapus filter:
- Bulan

Hapus kolom:
- Bulan

Tombol kanan:
- Ekspor Excel
- Ekspor PDF

Tabel:
Judul tabel:
Riwayat Pemusnahan — 490 box

Kolom:
- Checkbox
- No
- Tanggal Dimusnahkan
- Tahun Operasional
- Kode Klasifikasi
- Uraian Dokumen
- Tahun Arsip
- Pencipta Arsip
- ROP
- Jumlah
- Petugas

Ketentuan:
- Semua baris pada kolom Jumlah = 1 box
- Hapus kolom Bulan
- ROP mengikuti format revisi
- Jangan tampilkan keterangan box terpilih

==================================================
13. ARAHAN DESAIN AKHIR
==================================================

Pastikan seluruh frame mengikuti arahan berikut:
- Pertahankan visual asli ARDIS
- Semua halaman konsisten
- Gunakan layout desktop dashboard
- Gunakan sidebar kiri dengan ikon dan label menu
- Gunakan topbar dengan identitas user login di kanan atas
- Gunakan card statistik putih dengan ikon
- Gunakan tabel modern, rapi, dan mudah dibaca
- Gunakan grafik batang sederhana
- Gunakan badge untuk role, status, dan jumlah
- Gunakan badge “1 box” pada kolom Jumlah
- Gunakan filter horizontal yang rapi
- Jangan membuat tampilan terlalu penuh
- Jangan menggabungkan semua frame menjadi satu gambar
- Setiap halaman harus menjadi frame terpisah
- Fokus pada revisi prototype, bukan membuat ulang sistem dari awal