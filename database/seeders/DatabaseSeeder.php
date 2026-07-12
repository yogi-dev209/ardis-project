<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Arsip;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (7 default accounts matching credentials and employees)
        $password = Hash::make('Arsipar!s2026');
        
        $users = [
            [
                'name' => 'Dedy Dwi A',
                'username' => 'dedy_arsiparis',
                'email' => 'dedy@ardis.local',
                'password' => $password,
                'nomor' => '2115454',
                'jabatan' => 'SPr II Kearsipan',
                'unit' => 'Kearsipan',
                'jumlah' => 0,
                'avatar' => 'DD',
                'role' => 'Admin',
            ],
            [
                'name' => 'Ari Riski H',
                'username' => 'ari_arsiparis',
                'email' => 'ari@ardis.local',
                'password' => $password,
                'nomor' => '2180354',
                'jabatan' => 'PI. Kearsipan',
                'unit' => 'Kearsipan',
                'jumlah' => 0,
                'avatar' => 'AR',
                'role' => 'Arsiparis Umum',
            ],
            [
                'name' => 'Donny Ariesta P',
                'username' => 'donny_arsiparis',
                'email' => 'donny@ardis.local',
                'password' => $password,
                'nomor' => 'K.210060',
                'jabatan' => 'Staf Kearsipan',
                'unit' => 'Kearsipan',
                'jumlah' => 0,
                'avatar' => 'DA',
                'role' => 'Arsiparis Umum',
            ],
            [
                'name' => 'Dela Mili A',
                'username' => 'dela_arsiparis',
                'email' => 'dela@ardis.local',
                'password' => $password,
                'nomor' => 'K.250141',
                'jabatan' => 'Staf Kearsipan',
                'unit' => 'Kearsipan',
                'jumlah' => 0,
                'avatar' => 'DM',
                'role' => 'Arsiparis Umum',
            ],
            [
                'name' => 'Agung',
                'username' => 'agung_arsiparis',
                'email' => 'agung@ardis.local',
                'password' => $password,
                'nomor' => 'K.230146',
                'jabatan' => 'Staf Kearsipan',
                'unit' => 'Kearsipan',
                'jumlah' => 252,
                'avatar' => 'AG',
                'role' => 'Petugas Pencacahan',
            ],
            [
                'name' => 'Moch. Imam L',
                'username' => 'imam_arsiparis',
                'email' => 'imam@ardis.local',
                'password' => $password,
                'nomor' => 'K.250267',
                'jabatan' => 'Staf Kearsipan',
                'unit' => 'Kearsipan',
                'jumlah' => 238,
                'avatar' => 'MI',
                'role' => 'Petugas Pencacahan',
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // 2. Mock Data Helper Arrays
        $masterKlasifikasi = [
            ['kode' => 'LB.01.01', 'uraian' => 'Analisis Produk — Log Sheet Pemeriksaan', 'retensi' => 5],
            ['kode' => 'LB.01.01', 'uraian' => 'Analisis Produk — Hasil Analisis', 'retensi' => 5],
            ['kode' => 'LB.01.02', 'uraian' => 'Analisis Bahan Baku Proses Laboratorium — Log Sheet Pemeriksaan', 'retensi' => 5],
            ['kode' => 'LB.01.02', 'uraian' => 'Analisis Bahan Baku Proses Laboratorium — Hasil Analisis', 'retensi' => 5],
            ['kode' => 'LB.01.03', 'uraian' => 'Analisis Bahan Penolong Proses Laboratorium — Log Sheet Pemeriksaan', 'retensi' => 5],
            ['kode' => 'LB.01.03', 'uraian' => 'Analisis Bahan Penolong Proses Laboratorium — Hasil Analisis', 'retensi' => 5],
            ['kode' => 'LB.01.04', 'uraian' => 'Analisis Buangan Pabrik Proses Laboratorium — Log Sheet Pemeriksaan', 'retensi' => 5],
            ['kode' => 'LB.01.04', 'uraian' => 'Analisis Buangan Pabrik Proses Laboratorium — Hasil Analisis', 'retensi' => 5],
            ['kode' => 'LB.02.01', 'uraian' => 'Analisis Proses Produk — Hasil Analisis', 'retensi' => 5],
            ['kode' => 'LB.02.02', 'uraian' => 'Analisis Bahan Baku Uji Mutu — Hasil Analisis', 'retensi' => 5],
            ['kode' => 'PP.01.01', 'uraian' => 'Riset dan Analisis Pasar Pupuk Subsidi', 'retensi' => 5],
            ['kode' => 'PP.01.02', 'uraian' => 'Riset dan Analisis Pasar Pupuk Non Subsidi', 'retensi' => 5],
            ['kode' => 'PP.01.03', 'uraian' => 'Analisis Kompetitor dan Tren Pasar', 'retensi' => 5],
            ['kode' => 'PP.02.01', 'uraian' => 'Program Promosi Pupuk Bersubsidi', 'retensi' => 5],
            ['kode' => 'PP.02.02', 'uraian' => 'Program Promosi Pupuk Non Subsidi', 'retensi' => 5],
            ['kode' => 'PP.02.03', 'uraian' => 'Kegiatan Pameran dan Demonstrasi Produk', 'retensi' => 5],
            ['kode' => 'PP.03.01', 'uraian' => 'Perencanaan Distribusi Wilayah Pemasaran', 'retensi' => 5],
            ['kode' => 'PP.03.02', 'uraian' => 'Evaluasi Kinerja Distributor', 'retensi' => 5],
            ['kode' => 'PP.04.01', 'uraian' => 'Laporan Realisasi Penjualan Bulanan', 'retensi' => 5],
            ['kode' => 'PP.04.02', 'uraian' => 'Laporan Kinerja Pemasaran Tahunan', 'retensi' => 5],
            ['kode' => 'PD.01.02', 'uraian' => 'Rencana Kerja dan Anggaran Produksi Non Subsidi (PSO)', 'retensi' => 5],
            ['kode' => 'PD.02.01', 'uraian' => 'Pengadaan Gas', 'retensi' => 10],
            ['kode' => 'PD.02.02', 'uraian' => 'Pengadaan Bahan Baku NPK', 'retensi' => 10],
            ['kode' => 'PD.02.03', 'uraian' => 'Pengadaan Bahan Penunjang (Batubara, dan Lain-lain)', 'retensi' => 10],
            ['kode' => 'PD.02.04', 'uraian' => 'Pengadaan Bahan Baku Lainnya', 'retensi' => 10],
            ['kode' => 'PD.03.01', 'uraian' => 'Kontrol Bahan Baku dan Bahan Penunjang', 'retensi' => 5],
            ['kode' => 'PD.04.01', 'uraian' => 'Persiapan Proses Produksi Urea', 'retensi' => 5],
            ['kode' => 'PD.04.02', 'uraian' => 'Proses Produksi Urea', 'retensi' => 5],
            ['kode' => 'PD.04.03', 'uraian' => 'Persiapan Proses Produksi Amoniak', 'retensi' => 5],
            ['kode' => 'PD.04.04', 'uraian' => 'Proses Produksi Amoniak', 'retensi' => 5],
            ['kode' => 'PJ.01.02', 'uraian' => 'Perencanaan Penjualan Pupuk NPK Non Subsidi Dalam/Luar Negeri', 'retensi' => 5],
            ['kode' => 'PJ.02.01', 'uraian' => 'Penunjukan dan Evaluasi Distributor Non Subsidi/Retail', 'retensi' => 3],
            ['kode' => 'PJ.02.02', 'uraian' => 'Pelaksanaan Penjualan Pupuk Urea Non Subsidi Luar Negeri', 'retensi' => 10],
            ['kode' => 'PJ.02.03', 'uraian' => 'Pelaksanaan Penjualan Pupuk Urea Non Subsidi Dalam Negeri', 'retensi' => 10],
            ['kode' => 'PJ.02.04', 'uraian' => 'Pelaksanaan Penjualan Pupuk NPK Non Subsidi Luar Negeri', 'retensi' => 10],
            ['kode' => 'PJ.02.05', 'uraian' => 'Pelaksanaan Penjualan Pupuk NPK Non Subsidi Dalam Negeri', 'retensi' => 10],
            ['kode' => 'PJ.02.06', 'uraian' => 'Pelaksanaan Penjualan Pupuk Organik Non Subsidi', 'retensi' => 10],
            ['kode' => 'PJ.02.09', 'uraian' => 'Pelaksanaan Penjualan Amoniak Luar Negeri', 'retensi' => 10],
            ['kode' => 'PJ.02.10', 'uraian' => 'Pelaksanaan Penjualan Amoniak Dalam Negeri', 'retensi' => 10],
            ['kode' => 'PJ.03.01', 'uraian' => 'Penjualan Produk Lain', 'retensi' => 10],
            ['kode' => 'TK.01.01', 'uraian' => 'Perencanaan Teknik', 'retensi' => 5],
            ['kode' => 'TK.02.01', 'uraian' => 'Estimasi/Owner Estimate (OE) Sipil', 'retensi' => 5],
            ['kode' => 'TK.02.02', 'uraian' => 'Estimasi/Owner Estimate (OE) Mekanikal', 'retensi' => 5],
            ['kode' => 'TK.02.03', 'uraian' => 'Estimasi/Owner Estimate (OE) Instrumen & Listrik', 'retensi' => 5],
            ['kode' => 'TK.02.04', 'uraian' => 'Referensi Engineering', 'retensi' => 5],
            ['kode' => 'TK.03.01', 'uraian' => 'History Card/Equipment File (Rotating)', 'retensi' => 5],
            ['kode' => 'TK.03.02', 'uraian' => 'Laporan Vibrasi Hasil Perbaikan', 'retensi' => 5],
            ['kode' => 'TK.03.03', 'uraian' => 'Laporan Inspeksi Rotating Equipment', 'retensi' => 5],
            ['kode' => 'TK.04.01', 'uraian' => 'History Card/Equipment File (Statik)', 'retensi' => 5],
            ['kode' => 'TK.04.02', 'uraian' => 'Laporan Inspeksi Statik Equipment', 'retensi' => 5],
            ['kode' => 'EP.01.01', 'uraian' => 'Studi Kelayakan Proyek', 'retensi' => 10],
            ['kode' => 'EP.01.02', 'uraian' => 'Basic Engineering Design', 'retensi' => 10],
            ['kode' => 'EP.02.01', 'uraian' => 'Proposal Project — Prequalification', 'retensi' => 5],
            ['kode' => 'EP.02.01', 'uraian' => 'Proposal Project — Proposal Teknis', 'retensi' => 5],
            ['kode' => 'EP.02.01', 'uraian' => 'Proposal Project — Proposal Komersial', 'retensi' => 5],
            ['kode' => 'EP.03.01', 'uraian' => 'Detail Engineering Design', 'retensi' => 10],
            ['kode' => 'EP.03.02', 'uraian' => 'Konstruksi dan Commissioning', 'retensi' => 10],
            ['kode' => 'EP.04.01', 'uraian' => 'Laporan Progress Proyek Bulanan', 'retensi' => 5],
            ['kode' => 'EP.04.02', 'uraian' => 'Laporan Penyelesaian Proyek (Project Completion)', 'retensi' => 10],
            ['kode' => 'EP.05.01', 'uraian' => 'Evaluasi dan Lessons Learned Proyek', 'retensi' => 5],
        ];

        $depFokus = [
            'Dep Keuangan',
            'Dep Pelaporan Keuangan & Manajemen',
            'Dep Administrasi Pemasaran & Penjualan',
            'Dep Pengelolaan Pelanggan',
            'Dep Pengelolaan Produk',
        ];

        $depAll = [
            'Dep Keuangan', 'Dep Pelaporan Keuangan & Manajemen', 'Dep Akuntansi Biaya', 'Dep Anggaran',
            'Dep Pengadaan Barang', 'Dep Pengadaan Jasa', 'Dep Perencanaan Pengadaan Barang/Jasa',
            'Dep Pengelolaan Persediaan Suku Cadang & Bahan Baku', 'Dep Pengelolaan Produk', 'Dep Pengelolaan Pelanggan',
            'Dep Administrasi Pemasaran & Penjualan', 'Dep Operasi Pabrik I A', 'Dep Operasi Pabrik I B',
            'Dep Operasi Pabrik II A', 'Dep Operasi Pabrik II B', 'Dep Pemeliharaan Mekanik I',
            'Dep Pemeliharaan Mekanik II', 'Dep Pemeliharaan Listrik', 'Dep Pemeliharaan Instrumen',
            'Dep Inspeksi Teknik Rotating & Khusus', 'Dep Inspeksi Teknik Statik', 'Dep Laboratorium',
            'Dep Keselamatan & Kesehatan Kerja', 'Dep Lingkungan Hidup', 'Dep Rancang Bangun', 'Dep Riset',
            'Dep Operasional SDM', 'Dep Manajemen & Pengembangan SDM', 'Dep Manajemen Aset',
            'Dep Manajemen Risiko Korporasi',
        ];

        $ropLocations = [
            'Gedung A Penyimpanan 1', 'Gedung A Penyimpanan 2', 'Gedung A Penyimpanan 3',
            'Gedung B Penyimpanan 4', 'Gedung B Penyimpanan 5', 'Gedung C Penyimpanan 6',
        ];

        $ropSlots = [
            'A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5',
            'C1', 'C2', 'C3', 'C4', 'C5', 'D1', 'D2', 'D3', 'D4', 'D5',
            'E1', 'E2', 'E3', 'E4', 'E5', 'F1', 'F2', 'F3', 'F4', 'F5',
        ];

        $petugasList = ['Dedy Dwi A', 'Ari Riski H', 'Donny Ariesta P', 'Dela Mili A', 'Moch. Imam L', 'Agung'];

        // Helper random functions
        $pickMaster = function() use ($masterKlasifikasi) {
            return $masterKlasifikasi[array_rand($masterKlasifikasi)];
        };

        $pickDept = function() use ($depFokus, $depAll) {
            if (mt_rand(0, 99) < 60) {
                return $depFokus[array_rand($depFokus)];
            }
            return $depAll[array_rand($depAll)];
        };

        $pickRop = function() use ($ropLocations, $ropSlots) {
            $gedung = $ropLocations[array_rand($ropLocations)];
            $rak = mt_rand(1, 160);
            $slot = $ropSlots[array_rand($ropSlots)];
            $box = mt_rand(1, 6);
            return "{$gedung} • Rak {$rak} • {$slot} • Box {$box}";
        };

        $makeMasaRetensi = function($record) {
            $aktif = $record['retensi'] <= 5 ? $record['retensi'] - 3 : $record['retensi'] - 8;
            $aktif = max($aktif, 1);
            $inaktif = $record['retensi'] - $aktif;
            return "Aktif {$aktif} thn + Inaktif {$inaktif} thn";
        };

        $randomDate = function($start, $end) {
            $startTimestamp = strtotime($start);
            $endTimestamp = strtotime($end);
            $randomTimestamp = mt_rand($startTimestamp, $endTimestamp);
            return date('d/m/Y', $randomTimestamp);
        };

        // 3. Seed 200 Usulan Musnah for 2026
        for ($i = 0; $i < 200; $i++) {
            $record = $pickMaster();
            $tahunArsip = 2026 - $record['retensi'];
            
            Arsip::create([
                'id' => "usulan-2026-{$i}",
                'tanggal_entry' => $randomDate('2026-01-01', '2026-04-30'),
                'kode_klasifikasi' => $record['kode'],
                'uraian_dokumen' => $record['uraian'],
                'tahun_arsip' => (string) $tahunArsip,
                'masa_retensi' => $makeMasaRetensi($record),
                'pencipta_arsip' => $pickDept(),
                'rop' => $pickRop(),
                'jumlah' => 1,
                'tahun_operasional' => '2026',
                'status' => 'usulan',
            ]);
        }

        // 4. Seed 80 Pengajuan for 2026 (40 baru_masuk, 40 menunggu_persetujuan)
        for ($i = 0; $i < 80; $i++) {
            $record = $pickMaster();
            $tahunArsip = 2026 - $record['retensi'];
            $status = $i < 40 ? 'pengajuan_baru' : 'pengajuan_menunggu';
            
            Arsip::create([
                'id' => "pengajuan-2026-{$i}",
                'tanggal_entry' => $randomDate('2026-01-01', '2026-04-30'),
                'tanggal_pengajuan' => $randomDate('2026-02-01', '2026-04-30'),
                'kode_klasifikasi' => $record['kode'],
                'uraian_dokumen' => $record['uraian'],
                'tahun_arsip' => (string) $tahunArsip,
                'masa_retensi' => $makeMasaRetensi($record),
                'pencipta_arsip' => $pickDept(),
                'rop' => $pickRop(),
                'jumlah' => 1,
                'tahun_operasional' => '2026',
                'status' => $status,
            ]);
        }

        // 5. Seed 130 TPS for 2026 (50 baru, 80 antrian)
        $todayStr = date('d/m/Y');
        $nowStr = date('d/m/Y H:i:s');
        
        // 50 TPS Baru
        for ($i = 0; $i < 50; $i++) {
            $record = $pickMaster();
            $tahunArsip = 2026 - $record['retensi'];
            
            Arsip::create([
                'id' => "tps-2026-bm-{$i}",
                'tanggal_entry' => $randomDate('2026-01-01', '2026-05-01'),
                'tanggal_pengajuan' => $randomDate('2026-01-15', '2026-05-10'),
                'tanggal_pemindahan' => $todayStr,
                'kode_klasifikasi' => $record['kode'],
                'uraian_dokumen' => $record['uraian'],
                'tahun_arsip' => (string) $tahunArsip,
                'masa_retensi' => $makeMasaRetensi($record),
                'pencipta_arsip' => $pickDept(),
                'rop' => $pickRop(),
                'jumlah' => 1,
                'tahun_operasional' => '2026',
                'status' => 'tps_baru',
                'tanggal_perubahan_status_tps' => $nowStr,
            ]);
        }

        // 80 TPS Antrian
        for ($i = 0; $i < 80; $i++) {
            $record = $pickMaster();
            $tahunArsip = 2026 - $record['retensi'];
            $pemindahanDate = $randomDate('2026-01-20', '2026-04-30');
            
            Arsip::create([
                'id' => "tps-2026-da-{$i}",
                'tanggal_entry' => $randomDate('2026-01-01', '2026-04-01'),
                'tanggal_pengajuan' => $randomDate('2026-01-15', '2026-04-15'),
                'tanggal_pemindahan' => $pemindahanDate,
                'kode_klasifikasi' => $record['kode'],
                'uraian_dokumen' => $record['uraian'],
                'tahun_arsip' => (string) $tahunArsip,
                'masa_retensi' => $makeMasaRetensi($record),
                'pencipta_arsip' => $pickDept(),
                'rop' => $pickRop(),
                'jumlah' => 1,
                'tahun_operasional' => '2026',
                'status' => 'tps_antrian',
                'tanggal_perubahan_status_tps' => $pemindahanDate,
            ]);
        }

        // 6. Seed 85 Antrian Pencacahan
        for ($i = 0; $i < 85; $i++) {
            $record = $pickMaster();
            $tahunArsip = 2026 - $record['retensi'];
            
            Arsip::create([
                'id' => "antrian-2026-{$i}",
                'tanggal_entry' => $randomDate('2026-01-01', '2026-04-30'),
                'kode_klasifikasi' => $record['kode'],
                'uraian_dokumen' => $record['uraian'],
                'tahun_arsip' => (string) $tahunArsip,
                'masa_retensi' => $makeMasaRetensi($record),
                'pencipta_arsip' => $pickDept(),
                'rop' => $pickRop(),
                'jumlah' => 1,
                'tahun_operasional' => '2026',
                'status' => 'siap_dicacah',
                'tanggal_konfirmasi_pencacahan' => $randomDate('2026-04-01', '2026-05-20'),
                'petugas' => $petugasList[array_rand($petugasList)],
            ]);
        }

        // 7. Seed 490 Riwayat Pemusnahan (Jan-Mei 2026)
        $monthlyTargets = [
            ['count' => 95, 'start' => '2026-01-01', 'end' => '2026-01-31'],
            ['count' => 80, 'start' => '2026-02-01', 'end' => '2026-02-28'],
            ['count' => 105, 'start' => '2026-03-01', 'end' => '2026-03-31'],
            ['count' => 110, 'start' => '2026-04-01', 'end' => '2026-04-30'],
            ['count' => 100, 'start' => '2026-05-01', 'end' => '2026-05-28'],
        ];

        $counter = 0;
        foreach ($monthlyTargets as $target) {
            for ($i = 0; $i < $target['count']; $i++) {
                $record = $pickMaster();
                $tahunArsip = 2026 - $record['retensi'];
                
                Arsip::create([
                    'id' => "riwayat-2026-{$counter}",
                    'tanggal_entry' => '01/01/2026',
                    'tanggal_dimusnahkan' => $randomDate($target['start'], $target['end']),
                    'kode_klasifikasi' => $record['kode'],
                    'uraian_dokumen' => $record['uraian'],
                    'tahun_arsip' => (string) $tahunArsip,
                    'masa_retensi' => $makeMasaRetensi($record),
                    'pencipta_arsip' => $pickDept(),
                    'rop' => $pickRop(),
                    'jumlah' => 1,
                    'tahun_operasional' => '2026',
                    'status' => 'dimusnahkan',
                    'petugas' => $petugasList[array_rand($petugasList)],
                ]);
                $counter++;
            }
        }

        // 8. Seed default role permissions matrix
        $this->call(RolePermissionSeeder::class);
    }
}
