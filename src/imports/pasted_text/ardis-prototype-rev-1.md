Revisi prototype dashboard ARDIS — Archive Records Destruction Information System berdasarkan desain yang sudah ada. Pertahankan gaya visual saat ini: sidebar navy gelap, aksen oranye, card putih rounded, tabel rapi, badge status berwarna, top bar dengan dropdown “Tahun Operasional”, dan layout dashboard admin.

GLOBAL
1. Dropdown Tahun Operasional sudah benar dan tetap berisi:
   - Tahun 2024
   - Tahun 2025
   - Tahun 2026
2. Karena sistem baru dibuat tahun 2026, maka untuk Tahun 2024 dan 2025 kosongkan semua data statistik arsip.
   - Tampilkan card statistik sebagai 0 atau “—”
   - Grafik bulanan kosong dari Januari–Desember
   - Data yang tetap tampil hanya Jumlah Pegawai: 6 orang
3. Tahun yang dipilih di dropdown menjadi filter global untuk semua halaman.
4. Hapus filter “per tahun” di semua menu. Ganti menjadi filter:
   - Cari nama dokumen
   - Filter Departemen
   - Filter Bulan
5. Tahun data mengikuti pilihan global di dropdown Tahun Operasional.

DASHBOARD — Tahun 2026
Revisi data card dashboard menjadi:
- Arsip Retensi Habis: 100 box
- Usulan Musnah: 200 box
- Dalam Pengajuan: 80 box
- Box di TPS: 150 box
- Box Dimusnahkan: total per tahun sesuai tahun dipilih
- Musnah Bulan Ini: 100 box
- Antrian Pencacahan Bulan Ini: 85 box
- Jumlah Pegawai: 6 orang

Grafik “Arsip Dimusnahkan” harus menampilkan 12 bulan penuh dari Januari sampai Desember.
Data dummy tahun 2026:
- Januari: 95 box
- Februari: 80 box
- Maret: 105 box
- April: 110 box
- Mei: 100 box sementara
- Juni–Desember: kosong karena belum ada data

Total Box Dimusnahkan Tahun 2026 = 490 box, dihitung dari total bulan Januari sampai Mei.
Pada area “Status Alur Arsip”, tampilkan:
- Usulan Musnah: 200
- Dalam Pengajuan: 80
- Di TPS: 150
- Antrian Pencacahan: 85
- Total Box Dimusnahkan: 490

TEMPORARY STORAGE / TPS
Revisi halaman Temporary Storage:
1. Status TPS cukup 2 status saja:
   - Baru Masuk: 1x24 jam sejak pemindahan
   - Dalam Antrian: lebih dari 1x24 jam
2. Hapus status “Siap Dicacah” dari TPS.
3. Hapus card “Total Dokumen di TPS”.
4. Buat card statistik TPS:
   - Total Arsip di TPS: 150 box
   - Box Baru Masuk: 50 box
   - Box Dalam Antrian: 80 box
   - Box Terpilih: mengikuti checkbox yang dipilih user
5. Buat data dummy tabel:
   - 50 baris/box status Baru Masuk
   - 80 baris/box status Dalam Antrian
6. Pada tabel TPS, setiap baris memiliki checkbox.
7. Tambahkan tombol aksi:
   - Kembalikan
   - Pindahkan dan Konfirmasi Pencacahan
8. Fitur “Kembalikan”:
   - Dipakai untuk dokumen/box yang sudah masuk TPS tetapi batal dicacah
   - Saat tombol diklik, tampilkan modal “Konfirmasi Pengembalian”
   - Modal berisi:
     - Jumlah box terpilih
     - Pilihan tujuan pengembalian: Pengajuan atau Usulan Musnah
     - Input alasan pengembalian
     - Tombol Batal
     - Tombol Simpan Pengembalian
9. Revisi tombol “Pindahkan ke Pencacahan” menjadi:
   “Pindahkan dan Konfirmasi Pencacahan”
10. Saat tombol “Pindahkan dan Konfirmasi Pencacahan” diklik, tampilkan modal konfirmasi di menu TPS, bukan di menu Pencacahan.
11. Modal konfirmasi pencacahan berisi:
   - Box yang dipilih
   - Total berkas
   - Tanggal pencacahan
   - Petugas pencacah
   - Tombol Batal
   - Tombol Simpan Konfirmasi
12. Setelah dikonfirmasi dari TPS, data otomatis berpindah ke menu Pencacahan dengan status “Siap Dicacah”.

PENCACAHAN ARSIP
Revisi halaman Pencacahan Arsip:
1. Hapus tombol/fitur “Konfirmasi Pencacahan”, karena sudah digabung ke TPS.
2. Card statistik bagian atas tidak menampilkan total antrian per berkas.
3. Card statistik yang tampil:
   - Total Box Dalam Antrian Pencacahan: 85 box
   - Box Terpilih: mengikuti checkbox yang dipilih user
   - Total Box Sudah Dimusnahkan Tahun 2026: 490 box
4. Tambahkan filter:
   - Cari nama dokumen
   - Semua Departemen
   - Semua Bulan
5. Hapus filter tahun di halaman ini.
6. Semua data yang masuk dari TPS ke pencacahan memiliki status:
   - Siap Dicacah
7. Jangan tampilkan status “Dipindahkan ke Pencacahan”.
8. Tabel antrian pencacahan berisi checkbox dan tombol utama:
   - Proses Pencacahan
9. Saat data dipilih dan tombol “Proses Pencacahan” diklik:
   - Tampilkan modal konfirmasi proses pencacahan
   - Setelah disimpan, data pindah ke tab atau halaman Riwayat Pemusnahan
   - Total box dimusnahkan ikut bertambah sesuai bulan dan tahun operasional yang dipilih.

RIWAYAT PEMUSNAHAN
Revisi halaman Riwayat Pemusnahan:
1. Filter hanya:
   - Cari nama dokumen
   - Semua Departemen
   - Semua Bulan
2. Hapus filter tahun, karena tahun mengikuti dropdown global Tahun Operasional.
3. Tambahkan tombol:
   - Ekspor Excel
   - Ekspor PDF
4. Export bisa berdasarkan:
   - Data per bulan
   - Data per departemen
   - Data hasil pencarian dokumen
   - Data yang sedang tampil di tabel
5. Tabel riwayat menampilkan:
   - No
   - Tanggal Dimusnahkan
   - Bulan
   - Tahun Operasional
   - Kode
   - Uraian Dokumen
   - Departemen/Pencipta
   - ROP
   - Jumlah Box
   - Petugas
   - Aksi unduh/detail

INTERAKSI ANTAR MENU
1. Usulan Musnah → Pengajuan → TPS → Pencacahan → Riwayat Pemusnahan harus terasa sebagai workflow berurutan.
2. Tahun Operasional di top bar mengontrol semua data.
3. Data tahun 2024 dan 2025 kosong, kecuali Jumlah Pegawai.
4. Data tahun 2026 memakai dummy data revisi.
5. Saat user memilih bulan pada filter, tabel dan statistik menyesuaikan bulan tersebut.
6. Saat user memilih dokumen dengan checkbox, card “Box Terpilih” langsung berubah.
7. Saat data dikembalikan dari TPS, data masuk kembali ke Pengajuan atau Usulan Musnah sesuai pilihan modal.
8. Saat data dipindahkan dari TPS ke Pencacahan, statusnya langsung “Siap Dicacah”.
9. Saat data diproses pencacahan, data pindah ke Riwayat Pemusnahan dan masuk ke statistik box dimusnahkan.

Perbaiki copywriting agar konsisten:
- Gunakan istilah “box”, bukan campuran “berkas” untuk statistik utama.
- Gunakan “Pindahkan dan Konfirmasi Pencacahan”.
- Gunakan “Siap Dicacah” hanya di menu Pencacahan.
- Gunakan “Baru Masuk” dan “Dalam Antrian” hanya di menu TPS.
- Gunakan “Ekspor Excel” dan “Ekspor PDF” di Riwayat Pemusnahan.

Buat hasil prototype tetap mirip dengan desain awal, tetapi lebih konsisten, bersih, dan mudah dipahami oleh admin arsip.