Berikut prompt tunggal final yang menggabungkan semua dokumen, siap di-paste dalam 1 kali:

---

**BUAT DAN REVISI MENYELURUH SISTEM ARDIS — LAKUKAN SEMUA SEKALIGUS**

---

**[LAYOUT GLOBAL]**

Buat aplikasi web desktop bernama ARDIS (Archive Records Destruction Information System). Warna: navy gelap `#1a2642` untuk sidebar dan header, oranye `#e8630a` sebagai aksen utama, abu-abu terang `#f4f5f7` sebagai latar konten. Seluruh satuan jumlah menggunakan "dokumen" dengan nilai antara 4 hingga 6 per baris data.

Header lebar penuh tinggi 60px latar `#1a2642`. Kiri: logo kotak oranye berisi ikon dokumen putih, teks tebal putih "ARDIS", subjudul kecil "Archive Records Destruction Information System" warna `#7a9ac4`. Kanan: badge pil "Tahun Operasional: 2026". Bawah header: garis aksen oranye 3px.

Sidebar kiri permanen lebar tetap 240px, tidak bisa dilipat, tidak ada tombol toggle, posisi fixed tinggi penuh 100vh, tidak ikut scroll. Area konten memiliki margin-left 240px. Latar sidebar `#1a2642`. Baris pengguna atas: avatar lingkaran oranye inisial "AA", nama "Admin Arsiparis", subjudul "Tahun Operasional: 2026". Item nav tinggi 36px radius 8px margin horizontal 8px, kotak ikon 30x30px radius 6px latar putih semi-transparan. Item aktif latar oranye `#e8630a`. Setiap item nav: label utama putih 12px tebal, subjudul biru redup 10px.

Navigasi UTAMA: Dashboard (ikon grid, "Ringkasan & Statistik"), Data Pegawai (ikon orang, "Rekap Pegawai & Aktivitas"). Navigasi ARSIP: Usulan Musnah (ikon tempat sampah, "Arsip Retensi Habis", badge oranye angka dinamis), Pengajuan (ikon plus-kotak, "Review & Persetujuan", badge biru angka dinamis), Temporary Storage (ikon gembok, "TPS – Penampungan"), Pencacahan Arsip (ikon roda gigi, "Proses Pemusnahan"). Bawah: Pengaturan dipisah garis tipis. Semua item sidebar dapat diklik dan berpindah halaman dengan animasi transisi halus.

Ukuran frame: 1280x800px per halaman. Buat 6 frame halaman terpisah.

---

**[HALAMAN 1 — DASHBOARD]**

Judul "Dashboard". Grid 8 kartu dalam 2 baris 4 kolom (putih radius 12px border tipis): Arsip Retensi Habis: 200 (merah), Usulan Musnah: 200 (oranye), Dalam Pengajuan: 100 (biru), Dokumen di TPS: 100 (teal), Arsip Dimusnahkan: 500 (hijau), Musnah Bulan Ini: 125 (ungu), Jumlah Pegawai: 6 (abu biru), Total Arsip Masuk: 8 (coklat). Semua angka ini terupdate secara real-time setiap kali ada perpindahan data antar menu.

Tabel "Aktivitas Pemusnahan Terbaru", header oranye `#e8630a`. Kolom: No, Tanggal Dimusnahkan (oranye), Kode Klasifikasi, Uraian Dokumen, Pencipta Arsip, Jumlah, Petugas. 5 baris: (1) 26/4/2026, T-170884, Laporan Keuangan 2016, Dept Keuangan, 6 dokumen, Ahmad Fauzi — (2) 22/3/2026, T-195633, Surat Menyurat 2012, Dept Sekretariat, 5 dokumen, Siti Nurhaliza — (3) 15/3/2026, T-221972, Arsip Proyek 2013, Dept Teknik, 4 dokumen, Ahmad Fauzi — (4) 10/2/2026, NK-031200, Dokumen Kepegawaian 2011, Dept SDM, 6 dokumen, Budi Santoso — (5) 5/2/2026, NK-018745, Berkas Anggaran 2010, Dept Keuangan, 5 dokumen, Dewi Lestari.

---

**[HALAMAN 2 — DATA PEGAWAI]**

Judul "Data Pegawai". 3 kartu statistik atas: Total Pegawai = 6, Total Dokumen Dimusnahkan = 500, Rata-rata per Pegawai = 30 dokumen per bulan. Filter Bulan dan Tahun berdampingan. Tombol "+ Tambah Pegawai" biru pojok kanan atas.

Tabel "Daftar Pegawai Arsiparis". Kolom: No, Avatar (inisial), Nama Pegawai, Nomor Pegawai, Jabatan, Unit, Jumlah, Aksi (ikon pensil edit + ikon tempat sampah hapus). Data: (1) Dedy Dwi A, 2115454, SPr II Kearsipan, Kearsipan, 92 dokumen — (2) Ari Riski H, 2180354, PI. Kearsipan, Kearsipan, 78 dokumen — (3) Donny Ariesta P, K.210060, Staf Kearsipan, Kearsipan, 85 dokumen — (4) Agung, K.230146, Staf Kearsipan, Kearsipan, 67 dokumen — (5) Moch. Imam L, K.250267, Staf Kearsipan, Kearsipan, 94 dokumen — (6) Dela Mili A, K.250141, Staf Kearsipan, Kearsipan, 84 dokumen.

Kolom Jumlah setiap pegawai bertambah otomatis setiap kali ada proses pencacahan yang menggunakan nama pegawai tersebut sebagai petugas. Ikon pensil membuka modal edit data pegawai. Ikon tempat sampah membuka dialog konfirmasi "Apakah Anda yakin ingin menghapus pegawai ini?" dengan tombol Batal dan tombol Hapus merah.

---

**[HALAMAN 3 — USULAN MUSNAH]**

Judul "Usulan Musnah". Subjudul abu kecil di bawah judul. Tombol "Entry Data" biru pojok kanan atas sejajar judul. 4 kartu statistik: Arsip Retensi Habis: 200 (merah), Usulan Musnah: 200 (oranye), Dalam Pengajuan: 100 (biru), Total di TPS: 100 (teal). Banner info oranye muda dengan ikon info dan teks keterangan proses pemilihan arsip.

Filter 3 kolom berdampingan: (1) input teks "Cari nama dokumen...", (2) dropdown "Semua Departemen" berisi: Dept Keuangan, Dept SDM, Dept Teknik, Dept Sekretariat, Dept Perencanaan, Dept Umum, (3) dropdown "Semua Tahun" berisi 2000–2020. Ketiga filter ini benar-benar berfungsi menyaring data tabel secara real-time.

Tabel "Daftar Usulan Musnah", header oranye `#e8630a`, header menampilkan "Total: 200 arsip" (angka ini bertambah otomatis saat Entry Data baru disimpan). Kolom: checkbox, Tanggal Entry, Kode Klasifikasi (monospace biru), Uraian Dokumen, Tahun Arsip, Masa Retensi (badge merah), Pencipta Arsip, ROP, Jumlah (badge oranye 4–6 dokumen). Isi dengan 200 baris data fiktif realistis: variasikan Tanggal Entry antara 1/1/2026 hingga 30/4/2026, Kode Klasifikasi antara format NK.XX.XX dan T-XXXXXX, Uraian Dokumen antara: Laporan Keuangan, Surat Keputusan, Dokumen Kepegawaian, Arsip Proyek, Berkas Anggaran, Laporan Tahunan, Surat Menyurat, Dokumen Pengadaan, Laporan Bulanan, Arsip Kontrak dengan tahun arsip 2000–2015, Masa Retensi dengan tanggal lewat 2010–2020, Pencipta Arsip antara 6 departemen, ROP berupa Gedung A/B/C Lt.1/2/3 dengan kode rak.

Tombol "Entry Data" membuka modal form berisi: Tanggal Entry (date picker), Kode Klasifikasi, Uraian Dokumen, Tahun Arsip, Masa Retensi (date picker), Pencipta Arsip (dropdown 6 departemen), ROP, Jumlah (angka, label "dokumen"). Tombol Batal (outline abu) dan Simpan Data (biru). Setelah Simpan Data diklik: data baru muncul sebagai baris pertama tabel dengan highlight kuning selama 2 detik, angka total header tabel bertambah otomatis, muncul notifikasi hijau pojok kanan bawah "Data berhasil disimpan" selama 3 detik lalu hilang.

Saat checkbox dicentang: baris highlight biru muda, tombol "Pindahkan ke Pengajuan" muncul dan menampilkan jumlah arsip yang dipilih. Saat tombol diklik: tampilkan dialog konfirmasi "Anda akan memindahkan X arsip ke Pengajuan. Lanjutkan?" dengan tombol Batal dan Konfirmasi berwarna oranye. Setelah dikonfirmasi: arsip yang dipilih hilang dari tabel Usulan Musnah, muncul sebagai baris baru di tabel Pengajuan dengan Tanggal Pengajuan terisi tanggal hari ini dan status "Menunggu persetujuan", badge sidebar Usulan Musnah berkurang dan badge Pengajuan bertambah, muncul notifikasi hijau pojok kanan bawah "X arsip berhasil dipindahkan ke Pengajuan" selama 3 detik.

---

**[HALAMAN 4 — PENGAJUAN]**

Judul "Pengajuan". Banner info biru di atas tabel. Tabel "Daftar Pengajuan", header gradien biru-teal, header menampilkan "Total: 100 arsip dalam pengajuan". Kolom: checkbox, Tanggal Entry, Tanggal Pengajuan (biru), Kode Klasifikasi (biru), Uraian Dokumen (nama tebal + status abu: "Menunggu persetujuan" atau "Menunggu SK persetujuan"), Tahun Arsip, Masa Retensi, Pencipta Arsip, ROP, Jumlah (badge biru muda 4–6 dokumen). Isi dengan 100 baris data fiktif realistis dengan variasi yang sama seperti Usulan Musnah.

Saat checkbox dicentang: 3 tombol muncul di atas tabel: Ekspor Excel (outline abu), Kembalikan (outline merah), Setujui & Pindahkan ke TPS (latar hijau). Saat "Setujui & Pindahkan ke TPS" diklik: tampilkan dialog konfirmasi dengan tombol Batal dan Setujui berwarna hijau. Setelah dikonfirmasi: arsip hilang dari Pengajuan, muncul di Temporary Storage dengan Tanggal Pemindahan terisi hari ini dan status "Siap untuk pencacahan", angka "Dalam Pengajuan" di Dashboard berkurang dan "Dokumen di TPS" bertambah, muncul notifikasi hijau pojok kanan bawah selama 3 detik.

---

**[HALAMAN 5 — TEMPORARY STORAGE]**

Judul "Temporary Storage". 2 kartu statistik atas: Total Arsip di TPS = 100 (teal), Total Dokumen di TPS = total keseluruhan (ungu). Banner info teal. Tabel "Daftar Arsip di TPS", header gradien biru-teal, header menampilkan "Total: 100 arsip". Kolom: checkbox, Tanggal Entry, Tanggal Pemindahan (biru), Kode Klasifikasi (biru), Uraian Dokumen (nama tebal + status abu: "Sudah disetujui, ada di TPS" atau "Menunggu proses pencacahan"), Tahun Arsip, Masa Retensi, Pencipta Arsip, ROP, Jumlah (badge ungu muda 4–6 dokumen). Isi dengan 100 baris data fiktif realistis.

Saat checkbox dicentang: tombol "Pindahkan ke Pencacahan" muncul. Saat diklik: tampilkan dialog konfirmasi dengan tombol Batal dan Pindahkan berwarna ungu. Setelah dikonfirmasi: arsip hilang dari TPS, muncul di tab Antrian Pencacahan, muncul notifikasi hijau pojok kanan bawah selama 3 detik.

---

**[HALAMAN 6 — PENCACAHAN ARSIP]**

Dua tab: "Antrian Pencacahan" dan "Riwayat Pemusnahan".

**Tab Antrian Pencacahan:** Kartu statistik "Total Dokumen dalam Antrian" dengan nilai total keseluruhan dokumen + label "Kapasitas Harian 20–30 dokumen". Tabel "Antrian Pencacahan". Kolom: checkbox, Tahun Arsip, Kode Klasifikasi (biru), Uraian Dokumen (nama tebal + keterangan "Dipindahkan ke antrian pencacahan" abu), Pencipta Arsip, ROP, Jumlah (badge oranye-merah 4–6 dokumen). Isi dengan 100 baris data fiktif.

Saat checkbox dicentang: tombol "Proses Pencacahan" oranye-merah muncul. Saat diklik: tampilkan modal konfirmasi berisi ringkasan arsip yang dipilih, field "Tanggal Dimusnahkan" (date picker terisi hari ini), dropdown "Petugas yang Bertugas" berisi 6 nama: Dedy Dwi A, Ari Riski H, Donny Ariesta P, Agung, Moch. Imam L, Dela Mili A. Tombol Batal (outline) dan Konfirmasi Pencacahan (merah). Setelah dikonfirmasi: arsip hilang dari Antrian, muncul sebagai baris baru di tab Riwayat Pemusnahan dengan tanggal dan petugas yang dipilih, angka "Arsip Dimusnahkan" dan "Musnah Bulan Ini" di Dashboard bertambah, kolom Jumlah pegawai yang bertugas di Data Pegawai bertambah sesuai jumlah dokumen yang dicacah, muncul notifikasi hijau pojok kanan bawah "Pencacahan berhasil dicatat" selama 3 detik.

**Tab Riwayat Pemusnahan:** Filter di atas tabel: dropdown "Semua Bulan" (Januari–Desember) + dropdown "Semua Tahun" (2024, 2025, 2026) + tombol "Reset Filter" outline abu di sebelah kanan. Kedua filter benar-benar berfungsi menyaring data sesuai bulan dan tahun yang dipilih. Tombol "Ekspor Excel" hijau `#22a86e` dengan ikon download di pojok kanan atas sejajar header tabel. Saat diklik: muncul notifikasi hijau pojok kanan bawah "File Excel berhasil diunduh" dengan ikon centang selama 3 detik.

Tabel "Riwayat Pemusnahan", header hijau `#22a86e`, header menampilkan "Total: 500 arsip dimusnahkan". Kolom: No (1–500 berurutan), Tanggal Dimusnahkan (hijau), Tahun Arsip, Kode Klasifikasi (biru), Uraian Dokumen, Pencipta Arsip, ROP, Jumlah (badge hijau 4–6 dokumen), Petugas. Isi dengan 500 baris data: distribusikan 25 dokumen per hari secara konsisten dari 2 Januari 2026 hingga 30 April 2026, setiap tanggal muncul 25 baris berurutan sebelum berganti ke tanggal berikutnya sehingga total 500 dokumen terbagi dalam 20 hari pemusnahan (Januari 125 dokumen, Februari 125, Maret 125, April 125). Kolom Petugas hanya menggunakan 6 nama pegawai secara acak merata: Dedy Dwi A, Ari Riski H, Donny Ariesta P, Agung, Moch. Imam L, Dela Mili A.

---

**[INTERAKTIVITAS GLOBAL]**

Semua item sidebar dapat diklik dan berpindah halaman dengan animasi transisi halus. Semua checkbox dapat dicentang dan menyebabkan highlight biru muda pada baris serta memunculkan tombol aksi kontekstual. Semua perubahan angka pada kartu statistik Dashboard terupdate secara real-time setiap kali ada perpindahan data antar menu. Setiap perpindahan data disertai notifikasi sukses berwarna hijau pojok kanan bawah layar yang muncul 3 detik lalu hilang otomatis. Ikon pensil di Data Pegawai membuka modal edit. Ikon tempat sampah di Data Pegawai membuka dialog konfirmasi dengan tombol Batal dan Hapus merah.