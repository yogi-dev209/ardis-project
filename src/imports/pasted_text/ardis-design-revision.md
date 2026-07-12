# PROMPT REVISI DESAIN SISTEM ARDIS — FIGMA MAKE AI

> Gunakan prompt ini secara keseluruhan atau per bagian sesuai komponen yang ingin direvisi.

---

## KONTEKS UMUM

Sistem yang direvisi adalah **ARDIS (Arsip Digital System)** — aplikasi manajemen pemusnahan arsip berbasis web. Revisi ini mencakup 5 area utama: detail kolom tabel di menu Pengajuan dan TPS, logika alur status, fitur menu Pencacahan, perbaikan interaktivitas Data Pegawai, dan penerapan hak akses pengguna.

---

## BAGIAN 1 — REVISI MENU PENGAJUAN

### 1.1 Tambahkan Kolom Status dan Kolom Aksi pada Tabel Daftar Pengajuan

Pada tabel **Daftar Pengajuan**, tambahkan kolom berikut di antara kolom "Jumlah" dan bagian akhir tabel:

| Kolom Baru | Posisi | Keterangan |
|---|---|---|
| Status | Setelah kolom Jumlah | Menampilkan badge berwarna: **Menunggu Pengajuan** (kuning), **Disetujui** (hijau), **Ditolak** (merah) |
| Keterangan | Setelah kolom Status | Kolom teks singkat, misalnya "Menunggu persetujuan ANRI" atau "Dikembalikan ke Usulan Musnah" |

Struktur kolom tabel lengkap setelah revisi:
`Tanggal Entry | Tanggal Pengajuan | Kode Klasifikasi | Uraian Dokumen | Tahun Arsip | Masa Retensi | Pencipta Arsip | ROP | Jumlah | Status | Keterangan`

### 1.2 Revisi Alur Fitur Ekspor Excel (Unduh untuk Pengajuan)

Ganti tombol/fitur **"Ekspor Excel"** di menu Pengajuan menjadi tombol berlabel **"Unduh Daftar Pengajuan (Excel)"** dengan logika berikut:

- User mencentang (checklist) satu atau lebih arsip pada tabel Daftar Pengajuan.
- User klik tombol **"Unduh Daftar Pengajuan (Excel)"**.
- Sistem mengunduh file Excel berisi daftar arsip yang dipilih.
- Setelah diunduh, status arsip yang terpilih **otomatis berubah menjadi "Menunggu Pengajuan"** (ditampilkan dengan badge kuning).
- Tampilkan tooltip atau catatan kecil di bawah tombol:
  - Jika **Masa Retensi < 5 Tahun**: *"Diajukan ke Departemen Pencipta/Pemilik Arsip"*
  - Jika **Masa Retensi ≥ 5 Tahun**: *"Diajukan ke ANRI dan Departemen Pencipta/Pemilik Arsip"*

### 1.3 Revisi Alur Fitur "Setujui & Pindahkan ke TPS"

Tambahkan panduan alur berikut pada komponen info/notifikasi di atas tabel:

1. User pilih filter **Status: Menunggu Pengajuan**.
2. User pilih arsip yang sudah mendapat persetujuan (centang checklist).
3. User klik tombol **"Setujui & Pindahkan ke TPS"**.
4. Status arsip berubah menjadi **"Disetujui"** (badge hijau) dan arsip berpindah ke menu Temporary Storage.

### 1.4 Revisi Alur Fitur "Kembalikan"

- User pilih arsip yang ditolak (centang checklist).
- User klik tombol **"Kembalikan"**.
- Arsip **kembali ke menu Usulan Musnah** dan status dihapus dari Daftar Pengajuan.
- Tampilkan konfirmasi modal sebelum proses ini dijalankan.

---

## BAGIAN 2 — REVISI MENU TEMPORARY STORAGE (TPS)

### 2.1 Tambahkan Kolom Status dan Kolom Tanggal Perubahan Status pada Tabel

Pada tabel **Daftar Arsip di TPS**, tambahkan kolom berikut:

| Kolom Baru | Posisi | Keterangan |
|---|---|---|
| Status | Setelah kolom Jumlah | Badge berwarna: **Baru Masuk** (biru), **Dalam Antrian** (oranye), **Siap Dicacah** (hijau) |
| Tanggal Perubahan Status | Setelah kolom Status | Menampilkan tanggal dan jam perubahan status terakhir |

Struktur kolom tabel lengkap setelah revisi:
`Tanggal Entry | Tanggal Pemindahan | Kode Klasifikasi | Uraian Dokumen | Tahun Arsip | Masa Retensi | Pencipta Arsip | ROP | Jumlah | Status | Tanggal Perubahan Status`

### 2.2 Logika Tiga Status di TPS

Tambahkan keterangan visual atau legenda status pada bagian atas halaman TPS (di bawah summary card), berisi tabel atau card ringkas:

| Status | Kondisi | Durasi |
|---|---|---|
| **Baru Masuk** | Arsip baru dipindahkan dari Pengajuan ke TPS | 0 sampai 2x24 jam sejak tanggal pemindahan |
| **Dalam Antrian** | Arsip sudah melewati 2x24 jam di TPS | Berlaku 6x24 jam |
| **Siap Dicacah** | Arsip sudah melewati 2x24 + 6x24 jam (total 8 hari) di TPS | Siap dipindahkan ke Pencacahan |

Status berubah **otomatis berdasarkan selisih waktu** dari tanggal pemindahan. Tombol **"Pindahkan ke Pencacahan"** hanya aktif (enabled) jika arsip yang dipilih berstatus **Siap Dicacah**. Jika arsip berstatus Baru Masuk atau Dalam Antrian, tombol tetap ditampilkan namun dalam kondisi **disabled** dengan tooltip: *"Arsip belum memenuhi jangka waktu TPS"*.

---

## BAGIAN 3 — REVISI MENU PENCACAHAN

### 3.1 Tambahkan Dua Status pada Antrian Pencacahan

Pada tabel **Antrian Pencacahan**, tambahkan kolom Status dengan dua nilai:

| Status | Keterangan | Badge |
|---|---|---|
| **Dipindahkan ke Pencacahan** | Arsip baru masuk dari TPS ke menu Pencacahan | Biru |
| **Siap Dicacah** | Arsip sudah dikonfirmasi tanggal dan petugas, siap diproses | Hijau |

### 3.2 Revisi Fitur Konfirmasi Pencacahan

Pada modal atau form **Konfirmasi Pencacahan**, pastikan dua field berikut wajib diisi:

1. **Tanggal Pemusnahan** — Date picker
2. **Petugas Pencacah** — Dropdown berisi daftar pegawai arsiparis yang aktif

Setelah form ini disimpan, status arsip berubah dari **"Dipindahkan ke Pencacahan"** menjadi **"Siap Dicacah"**.

### 3.3 Revisi Fitur Unduh di Riwayat Pencacahan

Pada bagian **Riwayat Pemusnahan**, hapus tombol/link individual **"Unduh"** dan **"Laporan Excel"** per baris. Ganti dengan satu tombol tunggal di bagian atas tabel berlabel:

**"Ekspor Excel"**

Tombol ini aktif saat user mencentang satu atau lebih baris riwayat, atau tersedia sebagai ekspor seluruh data. Letakkan tombol di sisi kanan atas tabel, sejajar dengan area filter.

---

## BAGIAN 4 — PERBAIKAN DATA PEGAWAI (INTERAKTIVITAS IKON AKSI)

### 4.1 Aktifkan Ikon Edit dan Delete pada Tabel Daftar Pegawai

Pada kolom **Aksi** di tabel Daftar Pegawai Arsiparis, pastikan dua ikon berikut dapat diklik dan memiliki respons visual:

**Ikon Edit (pensil):**
- Status: enabled dan dapat diklik
- Aksi: membuka modal atau halaman form Edit Data Pegawai
- Form berisi field: Nama Pegawai, Nomor Pegawai, Jabatan, Unit
- Terdapat tombol **Simpan** dan **Batal**

**Ikon Delete (tempat sampah):**
- Status: enabled dan dapat diklik
- Aksi: membuka modal konfirmasi dengan teks: *"Apakah Anda yakin ingin menghapus data pegawai ini? Tindakan ini tidak dapat dibatalkan."*
- Terdapat tombol **Hapus** (merah) dan **Batal**

Tambahkan hover state pada kedua ikon: warna ikon berubah saat kursor diarahkan.

---

## BAGIAN 5 — PENERAPAN HAK AKSES PENGGUNA

### 5.1 Visibilitas Sidebar Menu Berdasarkan Role

Terapkan kondisi tampilan sidebar berdasarkan role pengguna yang login:

| Menu Sidebar | Admin | dedy.dwi / ari.riski / donny.ariesta | agung.k / imam.l / dela.mili |
|---|---|---|---|
| Dashboard | Tampil | Tampil | Tampil |
| Data Pegawai | Tampil (penuh) | Tampil (terbatas) | Tampil (terbatas) |
| Usulan Musnah | Tampil | Tampil | Disembunyikan |
| Pengajuan | Tampil | Tampil | Disembunyikan |
| Temporary Storage | Tampil | Disembunyikan | Tampil |
| Pencacahan | Tampil | Disembunyikan | Tampil |
| Riwayat/Laporan | Tampil | Disembunyikan | Tampil |
| Pengaturan | Tampil (penuh sistem) | Tampil (profil/password saja) | Tampil (profil/password saja) |

### 5.2 Batasan Akses Data Pegawai untuk Non-Admin

Untuk user selain admin yang membuka menu Data Pegawai:

- Tabel daftar pegawai: tampilkan kolom ringkas saja (Nama, Username, Jabatan, Unit, Status).
- Kolom **Jumlah Box Dicacah** dan ikon **Detail** untuk staf lain: **disembunyikan atau dikunci**.
- Ikon **Edit** dan **Delete**: hanya aktif pada baris data milik user yang sedang login. Baris milik user lain: ikon dinonaktifkan (disabled state, warna abu-abu).
- Tombol **Unduh Excel** di fitur Detail: hanya mengekspor data arsip milik user yang sedang login.

### 5.3 Batasan Menu Pengaturan untuk Non-Admin

Untuk user selain admin yang membuka menu Pengaturan:

- Tampilkan hanya tab atau section: **Profil Saya** dan **Ubah Password**.
- Sembunyikan tab atau section: **Kelola User**, **Kelola Role**, **Pengaturan Sistem**, dan **Reset Password User Lain**.

### 5.4 Tampilan Konfirmasi Akses Ditolak

Jika user mencoba mengakses menu yang tidak diizinkan (misalnya via URL langsung), tampilkan halaman atau modal dengan teks:

*"Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi Administrator jika membutuhkan akses."*

Tombol: **Kembali ke Dashboard**

---

## CATATAN TAMBAHAN UNTUK FIGMA MAKE AI

1. Semua perubahan status arsip yang bersifat otomatis (berbasis waktu) cukup divisualisasikan sebagai **badge status berwarna** pada tabel. Tidak perlu membuat logika timer nyata di Figma.
2. Semua modal konfirmasi (Kembalikan, Hapus Pegawai, Setujui & Pindahkan) menggunakan komponen modal standar yang sudah ada di desain.
3. Gunakan komponen badge yang konsisten: **kuning = menunggu, hijau = disetujui/siap, merah = ditolak, biru = baru/dipindahkan, oranye = antrian**.
4. Pastikan semua tombol yang disabled memiliki visual berbeda (opacity 40%, cursor not-allowed) dibanding tombol yang enabled.
5. Semua perubahan ini tidak mengubah struktur navigasi sidebar yang sudah ada, hanya menyesuaikan visibilitas berdasarkan role.