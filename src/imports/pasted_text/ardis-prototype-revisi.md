Revisi prototype ARDIS berdasarkan tampilan yang sudah ada. Pertahankan style visual saat ini: sidebar navy gelap, aksen oranye, card putih rounded, tabel rapi, badge status berwarna, topbar Tahun Operasional, dan layout admin arsip.

FOKUS REVISI UTAMA
Perjelas konsep data:
- 1 baris pada tabel = 1 arsip / 1 box.
- Kolom “Jumlah” bukan jumlah box, tetapi jumlah berkas di dalam 1 box.
- Jadi setiap baris tetap mewakili 1 box, sedangkan kolom Jumlah berisi dummy 3–6 berkas.
- Contoh:
  Tanggal Entry: 13/3/2026
  Kode: PJ.01.02
  Uraian Dokumen: Perencanaan Penjualan Pupuk NPK Non Subsidi Dalam/Luar Negeri
  Tahun Arsip: 2021
  Pencipta: Dep Keselamatan & Kesehatan Kerja
  ROP: Gedung Arsip A Lt.3 Rak 20
  Jumlah: 3 berkas

GLOBAL
1. Tahun Operasional tetap menjadi filter global.
2. Semua tabel tetap mengikuti tahun yang dipilih di dropdown Tahun Operasional.
3. Semua menu menggunakan filter:
   - Cari nama dokumen
   - Semua Departemen
   - Semua Bulan
   - Status hanya jika menu tersebut membutuhkan status
4. Hapus filter tahun di dalam tabel/menu karena tahun sudah mengikuti dropdown global.
5. Gunakan istilah:
   - “box” untuk jumlah arsip/baris
   - “berkas” untuk isi di dalam 1 box pada kolom Jumlah

MENU USULAN MUSNAH
Revisi halaman Usulan Musnah:
1. Card statistik disesuaikan dengan dashboard:
   - Arsip Retensi Habis: 100 box
   - Usulan Musnah: 200 box
   - Dalam Pengajuan: 80 box
   - Total di TPS: sesuaikan dengan data TPS aktif
2. Tabel “Daftar Usulan Musnah” tetap menampilkan 200 arsip / 200 box.
3. Setiap baris tabel = 1 box.
4. Kolom “Jumlah” berisi jumlah berkas di dalam box, bukan jumlah box.
5. Isi dummy kolom Jumlah secara acak antara:
   - 3 berkas
   - 4 berkas
   - 5 berkas
   - 6 berkas
6. Contoh format badge pada kolom Jumlah:
   - “3 berkas”
   - “4 berkas”
   - “5 berkas”
   - “6 berkas”
7. Kolom tabel Usulan Musnah:
   - Checkbox
   - Tanggal Entry
   - Kode
   - Uraian Dokumen
   - Tahun Arsip
   - Pencipta
   - ROP
   - Jumlah
8. Pastikan data dummy bervariasi dan terlihat realistis.

MENU PENGAJUAN
Revisi halaman Pengajuan:
1. Kolom “Jumlah” juga berarti jumlah berkas dalam 1 box.
2. Setiap baris = 1 box.
3. Jumlah dummy per baris: 3–6 berkas.
4. Hapus kolom “Keterangan” dari tabel.
5. Tabel hanya memiliki kolom:
   - Checkbox
   - Tanggal Entry
   - Tanggal Pengajuan
   - Kode Klasifikasi
   - Uraian Dokumen
   - Tahun Arsip
   - Masa Retensi
   - Pencipta Arsip
   - ROP
   - Jumlah
   - Status
6. Status pada menu Pengajuan hanya 2:
   - Baru Masuk
   - Menunggu Persetujuan
7. Arsip yang baru dipindahkan dari Usulan Musnah ke Pengajuan otomatis berstatus “Baru Masuk”.
8. Setelah user klik tombol “Unduh Daftar Pengajuan (Excel)”, status otomatis berubah menjadi “Menunggu Persetujuan”.
9. Status “Ditolak” dan “Disetujui” tidak perlu tampil di menu Pengajuan, karena:
   - Jika disetujui, data pindah ke TPS
   - Jika ditolak/dikembalikan, data kembali ke Usulan Musnah
10. Filter Status di Pengajuan hanya berisi:
   - Semua Status
   - Baru Masuk
   - Menunggu Persetujuan
11. Revisi card statistik Pengajuan menjadi:
   - Total dalam Pengajuan: 80 box
   - Box Terpilih: mengikuti checkbox
   - Total Arsip Menunggu Persetujuan: jumlah box berstatus Menunggu Persetujuan
12. Hapus card “Total Dokumen”.
13. Tambahkan tombol aksi:
   - Unduh Daftar Pengajuan (Excel)
   - Setujui & Pindahkan ke TPS
   - Kembalikan
14. Panduan Alur Pengajuan direvisi menjadi:
   “Pilih arsip yang akan diajukan dengan mencentang checkbox.
   Klik tombol ‘Unduh Daftar Pengajuan (Excel)’ — status otomatis berubah menjadi ‘Menunggu Persetujuan’.
   Gunakan filter Status: Menunggu Persetujuan untuk melihat arsip yang sudah diajukan.
   Setelah mendapat persetujuan, pilih arsip lalu klik ‘Setujui & Pindahkan ke TPS’.
   Untuk arsip yang ditolak, klik tombol ‘Kembalikan’ untuk mengembalikan ke Usulan Musnah.”

MENU TEMPORARY STORAGE / TPS
Revisi halaman Temporary Storage:
1. Tambahkan filter Status.
2. Filter Status TPS berisi:
   - Semua Status
   - Baru Masuk
   - Dalam Antrian
3. Status TPS hanya 2:
   - Baru Masuk
   - Dalam Antrian
4. Hapus status lain selain dua status tersebut.
5. Kolom “Jumlah” berarti jumlah berkas dalam 1 box.
6. Jumlah dummy pada setiap baris: 3–6 berkas.
7. Tabel TPS menampilkan:
   - Checkbox
   - Tgl Masuk TPS
   - Kode
   - Uraian Dokumen
   - Tahun Arsip
   - Departemen/Pencipta
   - ROP
   - Jumlah
   - Status
8. Card statistik TPS:
   - Total Arsip di TPS
   - Box Baru Masuk
   - Box Dalam Antrian
   - Box Terpilih
9. Tombol aksi tetap:
   - Kembalikan
   - Pindahkan dan Konfirmasi Pencacahan
10. Fitur Kembalikan tetap berfungsi untuk mengembalikan data ke Pengajuan atau Usulan Musnah.
11. Saat klik “Pindahkan dan Konfirmasi Pencacahan”, munculkan modal konfirmasi pencacahan di TPS.
12. Setelah dikonfirmasi, data pindah ke menu Pencacahan dengan status “Siap Dicacah”.

MENU PENCACAHAN
Revisi halaman Pencacahan Arsip:
1. Tambahkan tombol “Kembalikan” pada daftar Antrian Pencacahan.
2. Tombol aksi di atas tabel menjadi:
   - Kembalikan
   - Proses Pencacahan
3. Fitur Kembalikan digunakan jika arsip batal dicacah dan perlu dikembalikan ke TPS.
4. Saat klik Kembalikan, tampilkan modal:
   - Judul: Konfirmasi Pengembalian ke TPS
   - Box dipilih
   - Total berkas
   - Alasan pengembalian
   - Tombol Batal
   - Tombol Simpan Pengembalian
5. Semua data di Antrian Pencacahan berstatus “Siap Dicacah”.
6. Jangan tampilkan status “Dipindahkan ke Pencacahan”.
7. Kolom “Jumlah” berarti jumlah berkas dalam 1 box.
8. Jumlah dummy per baris: 3–6 berkas.
9. Tabel Antrian Pencacahan:
   - Checkbox
   - Tgl Konfirmasi
   - Kode
   - Uraian Dokumen
   - Tahun Arsip
   - Departemen/Pencipta
   - ROP
   - Jumlah
   - Petugas
   - Status
10. Card statistik:
   - Total Box Dalam Antrian Pencacahan
   - Box Terpilih
   - Total Box Sudah Dimusnahkan
11. Filter:
   - Cari nama dokumen
   - Semua Departemen
   - Semua Bulan

RIWAYAT PEMUSNAHAN
Revisi Riwayat Pemusnahan:
1. Kolom “Jumlah” juga berarti jumlah berkas dalam 1 box.
2. Jumlah dummy per baris: 3–6 berkas.
3. Tambahkan juga fitur “Kembalikan” pada daftar Riwayat Pemusnahan jika data riwayat perlu dibatalkan/dikoreksi.
4. Tombol aksi di Riwayat Pemusnahan:
   - Ekspor Excel
   - Ekspor PDF
   - Kembalikan untuk baris tertentu atau data terpilih
5. Jika klik Kembalikan di Riwayat Pemusnahan, tampilkan modal:
   - Judul: Konfirmasi Koreksi Riwayat
   - Box dipilih
   - Total berkas
   - Alasan koreksi
   - Kembalikan ke: Pencacahan
   - Tombol Batal
   - Tombol Simpan Koreksi
6. Tabel Riwayat Pemusnahan:
   - Checkbox
   - No
   - Tanggal Dimusnahkan
   - Bulan
   - Tahun Operasional
   - Kode
   - Uraian Dokumen
   - Departemen/Pencipta
   - ROP
   - Jumlah
   - Petugas
   - Aksi
7. Filter Riwayat:
   - Cari nama dokumen
   - Semua Departemen
   - Semua Bulan
8. Ekspor Excel dan Ekspor PDF mengikuti data yang sedang tampil setelah filter/search.

PAGINATION / INTERAKTIF DATA
Perbaiki pagination agar benar-benar interaktif.
1. Jika data banyak, pagination angka 1, 2, 3, 4, 5 harus bisa diklik semua.
2. Setiap halaman pagination harus menampilkan data berbeda.
3. Jangan hanya halaman 1 yang berisi data.
4. Contoh:
   - Halaman 1 menampilkan data 1–20
   - Halaman 2 menampilkan data 21–40
   - Halaman 3 menampilkan data 41–60
   - Halaman 4 menampilkan data 61–80
   - Halaman 5 menampilkan data 81–100
5. Jika total 130 box, maka:
   - Halaman 1: 1–20
   - Halaman 2: 21–40
   - Halaman 3: 41–60
   - Halaman 4: 61–80
   - Halaman 5: 81–100
   - Halaman berikutnya: 101–120
   - Halaman terakhir: 121–130
6. Saat halaman pagination diklik:
   - Tabel berubah
   - Nomor halaman aktif berubah warna
   - Teks “Menampilkan 1–20 dari 130 box” ikut berubah sesuai halaman
7. Search dan filter harus tetap bekerja walaupun user sedang di halaman pagination lain.
8. Jika filter/search menghasilkan data lebih sedikit, pagination menyesuaikan otomatis.
9. Checkbox dan Box Terpilih juga harus tetap interaktif pada setiap halaman.

INTERAKSI STATUS
Buat workflow data interaktif:
1. Usulan Musnah → pilih checkbox → pindah ke Pengajuan.
2. Di Pengajuan:
   - Data baru masuk berstatus “Baru Masuk”.
   - Klik “Unduh Daftar Pengajuan (Excel)” mengubah status menjadi “Menunggu Persetujuan”.
   - Klik “Setujui & Pindahkan ke TPS” memindahkan data ke TPS.
   - Klik “Kembalikan” memindahkan data kembali ke Usulan Musnah.
3. Di TPS:
   - Status hanya “Baru Masuk” dan “Dalam Antrian”.
   - Klik “Pindahkan dan Konfirmasi Pencacahan” memindahkan data ke Pencacahan.
4. Di Pencacahan:
   - Data masuk berstatus “Siap Dicacah”.
   - Klik “Proses Pencacahan” memindahkan data ke Riwayat Pemusnahan.
   - Klik “Kembalikan” memindahkan data kembali ke TPS.
5. Di Riwayat Pemusnahan:
   - Data yang sudah dicacah tampil sebagai riwayat.
   - Export Excel/PDF sesuai filter aktif.
   - Fitur Kembalikan digunakan untuk koreksi data.

COPYWRITING
Pastikan semua label konsisten:
- “box” untuk jumlah arsip/baris
- “berkas” untuk isi dalam box di kolom Jumlah
- “Baru Masuk” dan “Menunggu Persetujuan” hanya di Pengajuan
- “Baru Masuk” dan “Dalam Antrian” hanya di TPS
- “Siap Dicacah” hanya di Pencacahan
- “Jumlah” tetap dipakai sebagai nama kolom, tetapi isinya “3 berkas”, “4 berkas”, “5 berkas”, atau “6 berkas”
- Gunakan tombol “Unduh Daftar Pengajuan (Excel)”
- Gunakan tombol “Setujui & Pindahkan ke TPS”
- Gunakan tombol “Pindahkan dan Konfirmasi Pencacahan”
- Gunakan tombol “Proses Pencacahan”
- Gunakan tombol “Ekspor Excel” dan “Ekspor PDF”

Hasil akhir harus berupa prototype yang interaktif, rapi, dan konsisten dengan desain ARDIS saat ini.