Berikut 1 prompt lengkap yang menggabungkan semua instruksi:

---

> **[ARDIS — PROMPT LENGKAP: LOGIN + REVISI DATA SELURUH MENU]**
>
> **[HALAMAN LOGIN]**
> Buat halaman login sebagai halaman pertama sebelum Dashboard. Layout dua kolom. Kolom kiri 45% berlatar navy gelap (#1a2642) dengan aksen oranye (#e8630a). Tampilkan logo ARDIS (kotak oranye berisi ikon dokumen putih) besar di tengah atas, teks putih besar "ARDIS", subjudul putih "Archive Records Destruction Information System", lalu 3 poin keunggulan dengan ikon centang oranye: (1) Sistem penentuan arsip musnah berbasis jadwal retensi yang otomatis dan akurat, (2) Jaminan integritas data antara arsip tersimpan dan arsip usulan musnah, (3) Alur pemusnahan terpusat dengan dokumentasi petugas, tanggal, dan lokasi arsip. Di bagian bawah kolom kiri tampilkan teks kecil putih redup "© 2026 ARDIS System — Kearsipan Resmi".
>
> Kolom kanan 55% berlatar putih. Form login maksimal 420px secara vertikal di tengah. Urutan elemen dari atas ke bawah: logo kecil ARDIS + teks "ARDIS" navy di pojok kiri atas form, judul besar "Selamat Datang" warna navy (#1a2642) dengan subjudul abu-abu "Masuk ke sistem untuk mengakses layanan arsip", label "USERNAME / NIP" dengan input berisi ikon orang di kiri dan placeholder "Masukkan username atau NIP", label "PASSWORD" dengan tautan "Lupa Password?" di kanan dan input berisi ikon gembok di kiri serta ikon mata di kanan untuk show/hide, checkbox "Ingat saya di perangkat ini", tombol besar "Masuk ke Sistem" oranye (#e8630a) lebar penuh sudut membulat, teks kecil abu-abu "Butuh bantuan? Hubungi IT Support: ext. 101".
>
> Tidak ada field "Login Sebagai" atau dropdown di form login.
>
> Pesan error merah "Username atau password salah. Silakan coba lagi." ditampilkan di atas tombol Masuk ke Sistem saat login gagal. Saat login berhasil sistem langsung berpindah ke Dashboard dan menampilkan nama serta jabatan pengguna di sidebar sesuai akun yang digunakan.
>
> **Data akun valid:**
> Username: dedy_arsiparis — Password: Arsipar!s2026 — Nama: Dedy Dwi A — Jabatan: SPr II Kearsipan
> Username: ari_arsiparis — Password: Arsipar!s2026 — Nama: Ari Riski H — Jabatan: PI. Kearsipan
> Username: donny_arsiparis — Password: Arsipar!s2026 — Nama: Donny Ariesta P — Jabatan: Staf Kearsipan
> Username: agung_arsiparis — Password: Arsipar!s2026 — Nama: Agung — Jabatan: Staf Kearsipan
> Username: imam_arsiparis — Password: Arsipar!s2026 — Nama: Moch. Imam L — Jabatan: Staf Kearsipan
> Username: dela_arsiparis — Password: Arsipar!s2026 — Nama: Dela Mili A — Jabatan: Staf Kearsipan
> Username: admin_arsiparis — Password: Arsipar!s2026 — Nama: Admin Arsiparis — Jabatan: Super Administrator
>
> Tambahkan tombol logout di bagian bawah sidebar tepat di atas menu Pengaturan berupa item dengan ikon pintu keluar dan teks "Keluar" berwarna merah. Saat diklik tampilkan dialog konfirmasi "Apakah Anda yakin ingin keluar?" dengan tombol Batal dan Keluar berwarna merah. Setelah konfirmasi sistem kembali ke halaman login.
>
> ---
>
> **[KONSEP DASAR DATA ARSIP — WAJIB DIPAHAMI SEBELUM MEREVISI]**
> Setiap baris di semua tabel mewakili 1 box fisik arsip. Box adalah wadah fisik berisi kumpulan dokumen sejenis dalam periode tertentu. Kolom "Uraian Dokumen" adalah nama lengkap yang tertulis di label box fisik, contoh: "Laporan Keuangan 2015 Jan s/d Jun", "Memo Verifikasi Pembayaran Jan Tgl 27 s/d 30 2026", "Surat Keputusan Kepegawaian 2014 Semester 1". Kolom "Jumlah" adalah jumlah berkas atau pemisah di dalam 1 box tersebut, bukan jumlah box. Tampilkan jumlah dengan format "4 berkas" atau "6 berkas".
>
> ---
>
> **[USULAN MUSNAH — REVISI 200 BARIS]**
> Perbarui seluruh 200 baris data di tabel Usulan Musnah. Nama Uraian Dokumen mencerminkan nama box fisik lengkap dengan jenis dokumen dan periode waktu. Gunakan variasi: "Laporan Keuangan [tahun] [bulan] s/d [bulan]", "Surat Keputusan Kepegawaian [tahun] Semester [1/2]", "Memo Verifikasi Pembayaran [bulan] Tgl [tanggal] s/d [tanggal] [tahun]", "Dokumen Pengadaan Barang [tahun] Triwulan [1/2/3/4]", "Arsip Kontrak Proyek [tahun] Periode [bulan]-[bulan]", "Laporan Bulanan Operasional [tahun] [bulan]", "Berkas Kepegawaian [tahun] Batch [nomor]", "Surat Menyurat Eksternal [tahun] [bulan] s/d [bulan]", "Dokumen Anggaran [tahun] Revisi [nomor]", "Laporan Tahunan [tahun] Lengkap". Kolom Jumlah: Laporan Keuangan per semester = 6 berkas, Memo Verifikasi per periode = 3 hingga 4 berkas, Surat Keputusan per semester = 4 hingga 5 berkas, dokumen lainnya = 3 hingga 6 berkas. Semua jumlah menggunakan satuan "berkas".
>
> **[PENGAJUAN — REVISI 100 BARIS]**
> Terapkan konsep nama box yang sama pada 100 baris data tabel Pengajuan. Setiap Uraian Dokumen berupa nama lengkap box fisik dengan periode waktu spesifik. Jumlah menggunakan satuan "berkas".
>
> **[TEMPORARY STORAGE — REVISI 100 BARIS]**
> Terapkan konsep nama box yang sama pada 100 baris data tabel Temporary Storage. Setiap Uraian Dokumen berupa nama lengkap box fisik dengan periode waktu spesifik. Jumlah menggunakan satuan "berkas".
>
> **[PENCACAHAN ARSIP — ANTRIAN DAN RIWAYAT]**
> Terapkan konsep nama box yang sama pada tabel Antrian Pencacahan. Jumlah menggunakan satuan "berkas" sebagai isi dalam box.
>
> Pada tab Riwayat Pemusnahan, perbarui kolom Jumlah menjadi jumlah box yang telah dicacah oleh petugas dengan format "4 box" karena satuan yang dihitung adalah box fisik yang masuk ke mesin cacah. Contoh: Ahmad Fauzi mencacah 3 box pada tanggal 26/4/2026. Update header tabel Riwayat Pemusnahan menjadi "Total: 500 box dimusnahkan".
>
> Tambahkan tombol "Unduh Laporan Excel" berwarna hijau (#22a86e) dengan ikon download di pojok kanan atas seksi Riwayat Pemusnahan, sejajar dengan tombol Ekspor Excel yang sudah ada. Saat diklik tampilkan modal dengan judul "Laporan Riwayat Pemusnahan Arsip" berisi preview tabel kolom: No, Tanggal Dimusnahkan, Nama Box (Uraian Dokumen), Kode Klasifikasi, Pencipta Arsip, Jumlah Box, Petugas. Di bawah tabel preview tampilkan tombol "Unduh sebagai Excel (.xlsx)" hijau dan "Tutup" abu-abu outline. Saat tombol Unduh diklik tampilkan notifikasi hijau di pojok kanan bawah "Laporan Excel berhasil diunduh".
>
> **[DATA PEGAWAI — REVISI KOLOM DAN STATISTIK]**
> Perbarui kolom "Jumlah" di tabel Data Pegawai menjadi jumlah box yang telah dicacah masing-masing pegawai dengan format angka diikuti "box". Data: Dedy Dwi A — 92 box, Ari Riski H — 78 box, Donny Ariesta P — 85 box, Agung — 67 box, Moch. Imam L — 94 box, Dela Mili A — 84 box. Total keseluruhan 500 box. Rata-rata per pegawai 30 box per bulan. Ubah label kolom dari "Jumlah" menjadi "Jumlah Box Dicacah". Ubah label kartu statistik kedua menjadi "Total Box Dimusnahkan" dengan nilai 500 box dan kartu ketiga menjadi "Rata-rata per Pegawai" dengan nilai 30 box per bulan.
>
> Tambahkan tombol "Lihat Detail" berwarna biru di kolom Aksi setiap pegawai selain ikon edit dan hapus. Saat diklik tampilkan modal "Detail Box Dicacah — [Nama Pegawai]" berisi tabel kolom: No, Tanggal, Nama Box, Kode Klasifikasi, Jumlah Box, Keterangan. Di pojok kanan atas modal tambahkan tombol "Unduh Excel" hijau yang saat diklik memunculkan notifikasi "Laporan Excel [Nama Pegawai] berhasil diunduh".

---

Prompt ini siap di-paste langsung dalam 1 kali untuk menjalankan semua perubahan sekaligus.