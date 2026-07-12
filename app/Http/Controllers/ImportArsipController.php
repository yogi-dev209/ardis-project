<?php

namespace App\Http\Controllers;

use App\Models\Arsip;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class ImportArsipController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'tahun_operasional' => 'required|string',
        ]);

        $file = $request->file('file');

        $rows = Excel::toArray([], $file);

        $data = $rows[0] ?? [];

        $created = [];

        foreach ($data as $index => $row) {
            if ($index === 0) continue;

            $kode = $row[0] ?? null;
            $uraian = $row[1] ?? null;
            $tahun = $row[2] ?? null;
            $pencipta = $row[3] ?? null;
            $rop = $row[4] ?? null;
            $jumlah = (int) ($row[5] ?? 1);

            if (!$kode || !$uraian) {
                continue;
            }

            $arsip = Arsip::create([
                'id' => 'import-' . Str::uuid(),
                'tanggal_entry' => now()->format('d/m/Y'),
                'kode_klasifikasi' => $kode,
                'uraian_dokumen' => $uraian,
                'tahun_arsip' => (string) $tahun,
                'masa_retensi' => '',
                'pencipta_arsip' => $pencipta,
                'rop' => $rop,
                'jumlah' => $jumlah,
                'tahun_operasional' => $request->tahun_operasional,
                'status' => 'usulan',
            ]);

            $created[] = $arsip->id;
        }

        return response()->json([
            'success' => true,
            'created' => count($created),
        ]);
    }
}