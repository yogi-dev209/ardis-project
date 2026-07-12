<?php

namespace App\Http\Controllers;

use App\Models\Arsip;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Pdf\Mpdf;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class ArsipController extends Controller
{
    /**
     * Display a listing of archives grouped by their categories.
     */
    public function index()
    {
        $arsips = Arsip::all();
        
        $mapped = $arsips->map(function ($a) {
            return $this->mapArsip($a);
        });

        // Group by status category for convenient consumption by React Context
        $usulan = $mapped->filter(fn($a) => $a['status_db'] === 'usulan')->values();
        $pengajuan = $mapped->filter(fn($a) => in_array($a['status_db'], ['pengajuan_baru', 'pengajuan_menunggu']))->values();
        $tps = $mapped->filter(fn($a) => in_array($a['status_db'], ['tps_baru', 'tps_antrian']))->values();
        $antrian = $mapped->filter(fn($a) => $a['status_db'] === 'siap_dicacah')->values();
        $riwayat = $mapped->filter(fn($a) => $a['status_db'] === 'dimusnahkan')->values();

        return response()->json([
            'usulan' => $usulan,
            'pengajuan' => $pengajuan,
            'tps' => $tps,
            'antrian' => $antrian,
            'riwayat' => $riwayat,
        ]);
    }

    /**
     * Store a newly created usulan.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|string',
            'tanggalEntry' => 'required|string',
            'kodeKlasifikasi' => 'required|string',
            'uraianDokumen' => 'required|string',
            'tahunArsip' => 'required|string',
            'masaRetensi' => 'required|string',
            'penciptaArsip' => 'required|string',
            'rop' => 'required|string',
            'jumlah' => 'required|integer',
            'tahunOperasional' => 'required|string',
        ]);

        $a = Arsip::create([
            'id' => $data['id'],
            'tanggal_entry' => $data['tanggalEntry'],
            'kode_klasifikasi' => $data['kodeKlasifikasi'],
            'uraian_dokumen' => $data['uraianDokumen'],
            'tahun_arsip' => $data['tahunArsip'],
            'masa_retensi' => $data['masaRetensi'],
            'pencipta_arsip' => $data['penciptaArsip'],
            'rop' => $data['rop'],
            'jumlah' => $data['jumlah'],
            'tahun_operasional' => $data['tahunOperasional'],
            'status' => 'usulan',
        ]);

        return response()->json($this->mapArsip($a), 201);
    }

    /**
     * Move archives to the Pengajuan phase.
     */
    public function moveToPengajuan(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        $today = date('d/m/Y');

        Arsip::whereIn('id', $request->ids)->update([
            'status' => 'pengajuan_baru',
            'tanggal_pengajuan' => $today,
            'alasan_pengembalian' => null,
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Move archives to the TPS phase.
     */
    public function moveToTPS(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        $today = date('d/m/Y');
        $now = date('d/m/Y H:i:s');

        Arsip::whereIn('id', $request->ids)->update([
            'status' => 'tps_baru',
            'tanggal_pemindahan' => $today,
            'tanggal_perubahan_status_tps' => $now,
            'alasan_pengembalian' => null,
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Move archives to the Pencacahan queue.
     */
    public function moveToPencacahan(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'tanggal' => 'required|string',
            'petugas' => 'required|string',
        ]);

        Arsip::whereIn('id', $request->ids)->update([
            'status' => 'siap_dicacah',
            'tanggal_konfirmasi_pencacahan' => $request->tanggal,
            'petugas' => $request->petugas,
            'alasan_pengembalian' => null,
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Process actual destruction.
     */
    public function processPencacahan(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'tanggal' => 'required|string',
            'petugas' => 'required|string',
        ]);

        Arsip::whereIn('id', $request->ids)->update([
            'status' => 'dimusnahkan',
            'tanggal_dimusnahkan' => $request->tanggal,
            'petugas' => $request->petugas,
        ]);

        // Increment employee counter
        \App\Models\User::where('name', $request->petugas)->increment('jumlah', count($request->ids));

        return response()->json(['success' => true]);
    }

    /**
     * Update status of archives inside Pengajuan.
     */
    public function updateStatusPengajuan(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'status' => 'required|in:baru_masuk,menunggu_persetujuan',
        ]);

        $status = $request->status === 'baru_masuk' ? 'pengajuan_baru' : 'pengajuan_menunggu';

        Arsip::whereIn('id', $request->ids)->update([
            'status' => $status,
        ]);

        return response()->json(['success' => true]);
    }

    public function exportPengajuanExcel(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array|min:1',
        ]);

        $records = Arsip::whereIn('id', $data['ids'])->get();

        if ($records->isEmpty()) {
            return response()->json([
                'message' => 'Data pengajuan tidak ditemukan.',
            ], 404);
        }

        Arsip::whereIn('id', $data['ids'])->update([
            'status' => 'pengajuan_menunggu',
        ]);

        $spreadsheet = $this->createPengajuanSpreadsheet($records);
        $filename = 'daftar-pengajuan-' . now()->format('Ymd-His') . '.xlsx';
        $writer = new Xlsx($spreadsheet);

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    /**
     * Handle return/pengembalian requests back to previous stages.
     */
    public function returnArsip(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'tahap_asal' => 'required|in:pengajuan,tps,pencacahan,riwayat',
            'tujuan' => 'nullable|string',
            'alasan' => 'nullable|string',
        ]);

        $ids = $request->ids;
        $asal = $request->tahap_asal;
        $tujuan = $request->tujuan;
        $alasan = $request->alasan;

        if ($asal === 'pengajuan') {
            // Return from Pengajuan to Usulan
            Arsip::whereIn('id', $ids)->update([
                'status' => 'usulan',
                'tanggal_pengajuan' => null,
                'keterangan_pengajuan' => null,
                'alasan_pengembalian' => $alasan,
            ]);
        } elseif ($asal === 'tps') {
            // Return from TPS to either Pengajuan or Usulan
            if ($tujuan === 'pengajuan') {
                Arsip::whereIn('id', $ids)->update([
                    'status' => 'pengajuan_menunggu',
                    'tanggal_pemindahan' => null,
                    'tanggal_perubahan_status_tps' => null,
                    'alasan_pengembalian' => $alasan,
                ]);
            } else {
                Arsip::whereIn('id', $ids)->update([
                    'status' => 'usulan',
                    'tanggal_pengajuan' => null,
                    'keterangan_pengajuan' => null,
                    'tanggal_pemindahan' => null,
                    'tanggal_perubahan_status_tps' => null,
                    'alasan_pengembalian' => $alasan,
                ]);
            }
        } elseif ($asal === 'pencacahan') {
            // Return from siap_dicacah to tps_antrian
            Arsip::whereIn('id', $ids)->update([
                'status' => 'tps_antrian',
                'tanggal_konfirmasi_pencacahan' => null,
                'petugas' => null,
                'alasan_pengembalian' => $alasan,
            ]);
        } elseif ($asal === 'riwayat') {
            // Return from dimusnahkan to siap_dicacah, decrement employee count
            $records = Arsip::whereIn('id', $ids)->get();
            foreach ($records as $r) {
                if ($r->petugas) {
                    \App\Models\User::where('name', $r->petugas)->decrement('jumlah', 1);
                }
            }

            Arsip::whereIn('id', $ids)->update([
                'status' => 'siap_dicacah',
                'tanggal_dimusnahkan' => null,
                'alasan_pengembalian' => $alasan,
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function exportExcel(Request $request)
    {
        $records = $this->buildRiwayatQuery($request)->get();
        $spreadsheet = $this->createRiwayatSpreadsheet($records);
        $filename = 'riwayat-pemusnahan-' . ($request->input('tahun_operasional', now()->format('Y'))) . '.xlsx';

        $writer = new Xlsx($spreadsheet);

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    public function exportPdf(Request $request)
    {
        $records = $this->buildRiwayatQuery($request)->get();
        $spreadsheet = $this->createRiwayatSpreadsheet($records);
        $spreadsheet->getActiveSheet()->getPageSetup()
            ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
            ->setPaperSize(PageSetup::PAPERSIZE_A4);

        $writer = new Mpdf($spreadsheet);
        $filename = 'riwayat-pemusnahan-' . ($request->input('tahun_operasional', now()->format('Y'))) . '.pdf';

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/pdf',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    private function buildRiwayatQuery(Request $request)
    {
        $query = Arsip::query()->where('status', 'dimusnahkan');

        if ($request->filled('tahun_operasional')) {
            $query->where('tahun_operasional', $request->input('tahun_operasional'));
        }

        if ($request->filled('pencipta_arsip') && $request->input('pencipta_arsip') !== 'semua') {
            $query->where('pencipta_arsip', $request->input('pencipta_arsip'));
        }

        if ($request->filled('tahun_arsip') && $request->input('tahun_arsip') !== 'semua') {
            $query->where('tahun_arsip', $request->input('tahun_arsip'));
        }

        if ($request->filled('rop')) {
            $query->where('rop', 'like', '%' . $request->input('rop') . '%');
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function (Builder $subQuery) use ($search) {
                $subQuery->where('uraian_dokumen', 'like', '%' . $search . '%')
                    ->orWhere('kode_klasifikasi', 'like', '%' . $search . '%');
            });
        }

        return $query->orderBy('tanggal_dimusnahkan')->orderBy('kode_klasifikasi');
    }

    private function createRiwayatSpreadsheet($records)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Riwayat Pemusnahan');

        $headings = [
            'No',
            'Tanggal Dimusnahkan',
            'Tahun Operasional',
            'Kode Klasifikasi',
            'Uraian Dokumen',
            'Pencipta Arsip',
            'ROP',
            'Jumlah',
            'Petugas',
            'Tanggal Entry',
            'Tahun Arsip',
            'Masa Retensi',
        ];

        $sheet->fromArray($headings, null, 'A1');

        $rows = [];
        foreach ($records as $index => $record) {
            $rows[] = [
                $index + 1,
                $record->tanggal_dimusnahkan,
                $record->tahun_operasional,
                $record->kode_klasifikasi,
                $record->uraian_dokumen,
                $record->pencipta_arsip,
                $record->rop,
                $record->jumlah,
                $record->petugas,
                $record->tanggal_entry,
                $record->tahun_arsip,
                $record->masa_retensi,
            ];
        }

        if (!empty($rows)) {
            $sheet->fromArray($rows, null, 'A2');
        }

        foreach (range('A', 'L') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $sheet->getStyle('A1:L1')->getFont()->setBold(true);

        return $spreadsheet;
    }

    private function createPengajuanSpreadsheet($records)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Pengajuan');

        $headings = [
            'No',
            'Tanggal Entry',
            'Tanggal Pengajuan',
            'Kode Klasifikasi',
            'Uraian Dokumen',
            'Tahun Arsip',
            'Pencipta Arsip',
            'ROP',
            'Jumlah',
            'Status',
        ];

        $sheet->fromArray($headings, null, 'A1');

        $rows = [];
        foreach ($records as $index => $record) {
            $statusPengajuan = $record->status === 'pengajuan_menunggu' ? 'Menunggu Persetujuan' : 'Baru Masuk';

            $rows[] = [
                $index + 1,
                $record->tanggal_entry,
                $record->tanggal_pengajuan,
                $record->kode_klasifikasi,
                $record->uraian_dokumen,
                $record->tahun_arsip,
                $record->pencipta_arsip,
                $record->rop,
                $record->jumlah,
                $statusPengajuan,
            ];
        }

        if (!empty($rows)) {
            $sheet->fromArray($rows, null, 'A2');
        }

        foreach (range('A', 'J') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $sheet->getStyle('A1:J1')->getFont()->setBold(true);

        return $spreadsheet;
    }

    /**
     * Map database columns (snake_case) to client properties (camelCase).
     */
    private function mapArsip(Arsip $a)
    {
        $statusPengajuan = null;
        if ($a->status === 'pengajuan_baru') {
            $statusPengajuan = 'baru_masuk';
        } elseif ($a->status === 'pengajuan_menunggu') {
            $statusPengajuan = 'menunggu_persetujuan';
        }

        $statusTPS = null;
        if ($a->status === 'tps_baru') {
            $statusTPS = 'baru';
        } elseif ($a->status === 'tps_antrian') {
            $statusTPS = 'antrian';
        }

        $statusPencacahan = null;
        if ($a->status === 'siap_dicacah') {
            $statusPencacahan = 'siap_dicacah';
        }

        return [
            'id' => $a->id,
            'tanggalEntry' => $a->tanggal_entry,
            'kodeKlasifikasi' => $a->kode_klasifikasi,
            'uraianDokumen' => $a->uraian_dokumen,
            'tahunArsip' => $a->tahun_arsip,
            'masaRetensi' => $a->masa_retensi,
            'penciptaArsip' => $a->pencipta_arsip,
            'rop' => $a->rop,
            'jumlah' => (int) $a->jumlah,
            'tahunOperasional' => $a->tahun_operasional,
            
            // Phase details
            'tanggalPengajuan' => $a->tanggal_pengajuan,
            'statusPengajuan' => $statusPengajuan,
            'keteranganPengajuan' => $a->keterangan_pengajuan,
            
            'tanggalPemindahan' => $a->tanggal_pemindahan,
            'statusTPS' => $statusTPS,
            'tanggalPerubahanStatusTPS' => $a->tanggal_perubahan_status_tps,
            
            'statusPencacahan' => $statusPencacahan,
            'tanggalKonfirmasiPencacahan' => $a->tanggal_konfirmasi_pencacahan,
            
            'tanggalDimusnahkan' => $a->tanggal_dimusnahkan,
            'petugas' => $a->petugas,
            'alasanPengembalian' => $a->alasan_pengembalian,
            
            // internal helper
            'status_db' => $a->status,
        ];
    }
}
