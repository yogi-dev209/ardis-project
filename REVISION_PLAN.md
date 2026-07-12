# ARDIS System - Major Revision Plan

## 🔄 Perubahan Utama

### 1. **Konsep Data Baru**
- ✅ Setiap baris tabel = 1 box fisik arsip
- ✅ Kolom "Uraian Dokumen" = nama box lengkap + periode waktu
- ✅ Kolom "Jumlah" = jumlah berkas DALAM box (4-6 berkas)
- ✅ Satuan "box" HANYA untuk Riwayat Pemusnahan
- ✅ Satuan "berkas" untuk menu lainnya

### 2. **Perubahan Visual - More Compact**
**Typography:**
- Judul halaman: 18-20px (dari 21px)
- Subjudul: 11-12px (dari 12px)
- Header tabel: 11-12px
- Isi tabel: 11-12px
- Stats number: 22-24px (dari 26px)

**Spacing:**
- Card padding: p-2.5 atau p-3 (dari p-3/p-4)
- Content padding: p-3 (dari p-4)
- Gap: gap-2 (dari gap-2.5)
- Margin: mb-2.5 atau mb-3 (dari mb-3.5)

**Table:**
- Cell padding: px-2.5 py-1.5 (dari px-3 py-2)
- Row height: 40-48px normal, 52-58px dengan deskripsi
- Uraian Dokumen: maksimal 2 baris
- Pagination: "Menampilkan 1-20 dari 100"

### 3. **Perubahan Data**

**Usulan Musnah (200 rows):**
```
Uraian: "Laporan Keuangan 2015 Jan s/d Jun"
Jumlah: 6 berkas (dalam 1 box)
```

**Pengajuan (100 rows):**
```
Same format as Usulan Musnah
```

**TPS (100 rows):**
```
Same format as Usulan Musnah
```

**Riwayat Pemusnahan (500 rows):**
```
Uraian: Same format
Jumlah: "4 box" (box yang dicacah)
Header: "Total: 500 box dimusnahkan"
```

**Data Pegawai:**
```
Kolom: "Jumlah Box Dicacah"
Format: "92 box"
Total: 500 box
Rata-rata: 30 box/bulan
```

### 4. **Fitur Baru**

**Riwayat Pemusnahan:**
- ✅ Tombol "Unduh Laporan Excel" (hijau #22a86e)
- ✅ Modal preview laporan dengan tabel
- ✅ Download as Excel

**Data Pegawai:**
- ✅ Tombol "Lihat Detail" per pegawai
- ✅ Modal "Detail Box Dicacah - [Nama]"
- ✅ Tabel detail dengan No, Tanggal, Nama Box, Kode, Jumlah
- ✅ Tombol "Unduh Excel" dalam modal

**Sidebar:**
- ✅ Logout button (merah) di bawah
- ✅ Dialog konfirmasi logout

**Login:**
- ✅ Halaman login lengkap 45%-55%
- ✅ 7 user credentials
- ✅ Error handling
- ✅ Logout kembali ke login

### 5. **Layout Changes**

**Header:**
- Height: 60px (dari 50px)
- Logo + text + subjudul
- Badge "Tahun Operasional: 2026"
- Garis oranye 3px di bawah

**Sidebar:**
- Width: 240px permanent (dari 220px)
- Fixed, no collapse, no scroll
- More compact items
- Profile area: avatar + nama + "Tahun Operasional: 2026"
- Logout button at bottom

**Content:**
- Margin-left: 240px
- Padding: p-3
- Background: #f4f5f7

### 6. **Data Examples**

**Uraian Dokumen Templates:**
```
1. "Laporan Keuangan [tahun] [bulan] s/d [bulan]" → 6 berkas
2. "Surat Keputusan Kepegawaian [tahun] Semester [1/2]" → 4-5 berkas
3. "Memo Verifikasi Pembayaran [bulan] Tgl [tanggal] s/d [tanggal] [tahun]" → 3-4 berkas
4. "Dokumen Pengadaan Barang [tahun] Triwulan [1/2/3/4]" → 3-6 berkas
5. "Arsip Kontrak Proyek [tahun] Periode [bulan]-[bulan]" → 3-6 berkas
6. "Laporan Bulanan Operasional [tahun] [bulan]" → 3-6 berkas
7. "Berkas Kepegawaian [tahun] Batch [nomor]" → 3-6 berkas
8. "Surat Menyurat Eksternal [tahun] [bulan] s/d [bulan]" → 3-6 berkas
9. "Dokumen Anggaran [tahun] Revisi [nomor]" → 3-6 berkas
10. "Laporan Tahunan [tahun] Lengkap" → 3-6 berkas
```

### 7. **Statistik Dashboard**

```
- Arsip Retensi Habis: 200 (merah)
- Usulan Musnah: 200 (oranye)
- Dalam Pengajuan: 100 (biru)
- Dokumen di TPS: 100 (teal)
- Arsip Dimusnahkan: 500 (hijau)
- Musnah Bulan Ini: 125 (ungu)
- Jumlah Pegawai: 6 (abu biru)
- Total Arsip Masuk: 8 (coklat)
```

### 8. **Navigation Structure**

**UTAMA:**
- Dashboard (ikon grid, "Ringkasan & Statistik")
- Data Pegawai (ikon orang, "Rekap Pegawai & Aktivitas")

**ARSIP:**
- Usulan Musnah (ikon tempat sampah, "Arsip Retensi Habis", badge 200)
- Pengajuan (ikon plus-kotak, "Review & Persetujuan", badge 100)
- Temporary Storage (ikon gembok, "TPS – Penampungan")
- Pencacahan Arsip (ikon roda gigi, "Proses Pemusnahan")

**BOTTOM:**
- Pengaturan
- Keluar (merah, dengan konfirmasi)

---

## ⚠️ Breaking Changes

1. **Data Structure**: Semua data perlu diupdate dengan format baru
2. **Satuan**: Berubah dari "box" ke "berkas" kecuali Riwayat
3. **Visual**: Semua ukuran lebih kecil
4. **Features**: Banyak fitur baru ditambahkan

## 🎯 Implementation Priority

1. Update AppContext with new data structure
2. Update Layout (header 60px, sidebar 240px)
3. Update Dashboard dengan stats baru
4. Update semua page dengan compact design
5. Add pagination ke semua tabel
6. Add new features (Unduh Excel, Lihat Detail, etc)

