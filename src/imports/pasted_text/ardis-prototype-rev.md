Revisi prototype aplikasi ARDIS – Archive Records Destruction Information System berdasarkan desain yang sudah ada. Pertahankan gaya visual saat ini: sidebar navy gelap, aksen orange, card putih rounded, layout dashboard administratif, bahasa Indonesia, dan tampilan profesional untuk sistem manajemen arsip.

FOKUS REVISI UTAMA:

1. FITUR TAHUN OPERASIONAL SEBAGAI GLOBAL FILTER
Pada bagian kanan atas header yang saat ini bertuliskan “Tahun Operasional: 2026”, ubah menjadi dropdown/select tahun.

Pilihan tahun:
- 2024
- 2025
- 2026

Default aktif: 2026.

Ketika pengguna memilih tahun tertentu, seluruh sistem wajib mengikuti tahun tersebut sebagai filter global. Contoh: ketika memilih Tahun Operasional 2025, maka semua data pada sistem menampilkan data tahun 2025 saja.

Area yang harus terfilter berdasarkan tahun:
- Dashboard
- Data Pegawai
- Usulan Musnah
- Pengajuan
- Temporary Storage / TPS
- Pencacahan Arsip
- Riwayat aktivitas
- Statistik
- Grafik
- Status alur arsip
- Total box
- Data arsip retensi habis
- Data arsip yang masuk antrian pencacahan
- Data arsip yang sudah dimusnahkan
- Riwayat pengerjaan setiap pegawai

Tambahkan state visual pada dropdown:
- Saat tahun dipilih, label berubah menjadi “Tahun Operasional: 2025”
- Data statistik langsung berubah mengikuti tahun
- Tambahkan micro-interaction loading singkat saat tahun diganti
- Semua card, grafik, tabel, dan riwayat aktivitas harus menampilkan data sesuai tahun aktif

Contoh perilaku:
Jika user memilih tahun 2025, maka:
- Total Box Retensi Habis menampilkan arsip retensi habis tahun 2025 saja
- Usulan Musnah hanya data tahun 2025
- Dalam Pengajuan hanya data tahun 2025
- Box di TPS hanya data tahun 2025
- Antrian Pencacahan hanya data tahun 2025
- Jumlah Box Dimusnahkan hanya tahun 2025
- Grafik “Arsip Dimusnahkan” menampilkan aktivitas tahun 2025 saja
- Riwayat kegiatan terbaru hanya aktivitas tahun 2025

Gunakan data dummy berbeda untuk 2024, 2025, dan 2026 agar terlihat bahwa filter tahun bekerja.

2. UPDATE DATA LOGIN / USERNAME
Tambahkan dan gunakan daftar user berikut di sistem:

- Username: dedy_arsiparis
  Password: Arsipar!s2026
  Nama: Dedy Dwi A
  Jabatan: SPr II Kearsipan

- Username: ari_arsiparis
  Password: Arsipar!s2026
  Nama: Ari Riski H
  Jabatan: PI. Kearsipan

- Username: donny_arsiparis
  Password: Arsipar!s2026
  Nama: Donny Ariesta P
  Jabatan: Staf Kearsipan

- Username: agung_arsiparis
  Password: Arsipar!s2026
  Nama: Agung
  Jabatan: Staf Kearsipan

- Username: imam_arsiparis
  Password: Arsipar!s2026
  Nama: Moch. Imam L
  Jabatan: Staf Kearsipan

- Username: dela_arsiparis
  Password: Arsipar!s2026
  Nama: Dela Mili A
  Jabatan: Staf Kearsipan

- Username: admin_arsiparis
  Password: Arsipar!s2026
  Nama: Admin Arsiparis
  Jabatan: Super Administrator

Tambahkan user baru:
- Username: guest_arsip
  Password: Arsipar!s2026
  Nama: Guest
  Jabatan: Guest

3. SISTEM HAK AKSES DINAMIS OLEH ADMIN
Pada menu Data Pegawai, tambahkan fitur untuk mengatur hak akses setiap pegawai.

Admin memiliki semua akses dan dapat:
- Melihat semua menu
- Menambah data
- Mengedit data
- Menghapus data
- Menyetujui pengajuan
- Mengatur hak akses pegawai lain
- Mengakses seluruh tahun operasional
- Import Excel
- Export data
- Melihat riwayat aktivitas seluruh pegawai

Tambahkan tombol pada tabel Data Pegawai:
- Detail
- Edit
- Hak Akses
- Hapus

Ketika tombol “Hak Akses” diklik, tampilkan modal “Kelola Hak Akses Pegawai”.

Isi modal:
- Nama pegawai
- Username
- Jabatan
- Role dasar
- Pilihan akses per menu menggunakan checkbox/toggle

Daftar menu hak akses:
- Dashboard
- Data Pegawai
- Usulan Musnah
- Pengajuan
- Temporary Storage
- Pencacahan Arsip
- Riwayat Aktivitas
- Pengaturan

Jenis izin:
- Lihat
- Tambah
- Edit
- Hapus
- Approve / Setujui
- Import Excel
- Export Data

Tambahkan tombol:
- Simpan Akses
- Reset ke Role Default
- Batal

Buat sistem role default:
- Super Administrator: semua akses aktif
- SPr II Kearsipan: akses luas, dapat melihat, menambah, mengedit, dan memantau proses
- PI. Kearsipan: akses operasional dan monitoring
- Staf Kearsipan: akses operasional umum
- Guest: akses umum seperti staf, tetapi dibatasi

Hak akses Guest:
- Bisa melihat Dashboard terbatas
- Bisa melihat data umum
- Bisa melihat status proses arsip
- Tidak bisa tambah data
- Tidak bisa edit data
- Tidak bisa hapus data
- Tidak bisa approve pengajuan
- Tidak bisa import Excel
- Tidak bisa mengatur hak akses
- Tidak bisa masuk menu Pengaturan
- Tidak bisa melihat data sensitif pegawai secara lengkap

Tambahkan indikator akses di tabel pegawai:
- Badge “Full Access” untuk Admin
- Badge “Custom Access” untuk pegawai yang aksesnya sudah diubah
- Badge “Default Role” untuk pegawai yang masih memakai akses standar
- Badge “Limited Access” untuk Guest

Tambahkan catatan kecil pada halaman Data Pegawai:
“Admin dapat menambahkan atau mencabut hak akses pegawai sesuai kebutuhan operasional.”

4. MENU USULAN MUSNAH – TAMBAHKAN IMPORT EXCEL
Pada halaman Usulan Musnah, tambahkan tombol baru di bagian kanan atas dekat tombol “Entry Data”.

Tombol:
- Import Excel
- Entry Data

Desain tombol Import Excel:
- Warna hijau atau biru sekunder
- Icon file/spreadsheet/upload
- Label “Import Excel”

Ketika tombol Import Excel diklik, tampilkan modal:
Judul: Import Data Usulan Musnah dari Excel

Isi modal:
- Area drag & drop file Excel
- Tombol pilih file
- Format file yang diterima: .xlsx dan .xls
- Informasi template kolom
- Tombol “Download Template”
- Tombol “Preview Data”
- Tombol “Import”
- Tombol “Batal”

Tambahkan preview data setelah file dipilih:
- Nama berkas
- Jumlah baris terbaca
- Data valid
- Data error
- Tabel preview 5 baris pertama

Tambahkan validasi:
- Kode arsip wajib
- Uraian dokumen wajib
- Tahun wajib
- Pencipta wajib
- ROP wajib
- Jumlah wajib
- Tahun data mengikuti Tahun Operasional yang sedang aktif

Saat import berhasil, tampilkan notifikasi:
“Data usulan musnah berhasil diimport untuk Tahun Operasional 2025.”

5. HAPUS KOLOM MASA RETENSI DI TABEL USULAN MUSNAH
Pada tabel “Daftar Usulan Musnah”, hapus kolom “Masa Retensi”.

Susunan kolom baru:
- Checkbox
- Tanggal Entry
- Kode
- Uraian Dokumen
- Tahun
- Pencipta
- ROP
- Jumlah
- Status
- Aksi

Pastikan layout tabel tetap rapi setelah kolom Masa Retensi dihapus.

6. PENYESUAIAN DASHBOARD
Dashboard harus menampilkan statistik sesuai Tahun Operasional aktif.

Card statistik:
- Arsip Retensi Habis
- Usulan Musnah
- Dalam Pengajuan
- Box di TPS
- Box Dimusnahkan
- Musnah Bulan Ini
- Antrian Pencacahan
- Jumlah Pegawai

Tambahkan keterangan kecil pada area dashboard:
“Data ditampilkan berdasarkan Tahun Operasional yang dipilih.”

Grafik “Arsip Dimusnahkan” juga mengikuti tahun aktif.
Status Alur Arsip juga mengikuti tahun aktif.
Aktivitas Pemusnahan Terbaru juga mengikuti tahun aktif.

7. INTERAKSI DAN PROTOTYPE FLOW
Buat interaksi prototype:
- Dropdown Tahun Operasional dapat diklik dan memilih 2024, 2025, 2026
- Setelah tahun dipilih, angka statistik berubah
- Menu Data Pegawai bisa membuka modal Hak Akses
- Modal Hak Akses bisa simpan dan menampilkan badge Custom Access
- Tombol Import Excel membuka modal import
- Preview import Excel muncul setelah file dipilih
- Import berhasil menambahkan data ke tabel sesuai tahun aktif
- Guest login menampilkan menu terbatas
- Admin login menampilkan seluruh menu

8. RESPONSIVE DAN DETAIL UI
Pastikan desain tetap konsisten:
- Sidebar tetap sama
- Header tetap sama
- Gunakan warna utama navy dan orange seperti desain existing
- Gunakan card rounded
- Gunakan badge status
- Gunakan icon sederhana
- Gunakan spacing rapi
- Tabel mudah dibaca
- Font tetap modern dan jelas

Output yang diharapkan:
- Revisi prototype ARDIS lengkap
- Dropdown Tahun Operasional global
- Data per tahun 2024, 2025, 2026
- User Guest ditambahkan
- Manajemen hak akses pegawai oleh Admin
- Tombol dan modal Import Excel pada Usulan Musnah
- Kolom Masa Retensi dihapus dari tabel Usulan Musnah
- Semua halaman mengikuti filter tahun operasional