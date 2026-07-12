<?php

namespace App\Http\Controllers;

use App\Models\Arsip;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class PegawaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        
        return response()->json($users->map(function ($u) {
            return [
                'id' => (string) $u->id,
                'nama' => $u->name,
                'nomor' => $u->nomor ?? '',
                'jabatan' => $u->jabatan ?? '',
                'unit' => $u->unit ?? '',
                'jumlah' => (int) $u->jumlah,
                'avatar' => $u->avatar ?? '',
                'role' => $u->role,
            ];
        }));
    }

    /**
     * Return the authenticated user's own employee record.
     */
    public function me(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthorized. Silakan login terlebih dahulu.',
            ], 401);
        }

        return response()->json([
            'id' => (string) $user->id,
            'nama' => $user->name,
            'nomor' => $user->nomor ?? '',
            'jabatan' => $user->jabatan ?? '',
            'unit' => $user->unit ?? '',
            'jumlah' => (int) $user->jumlah,
            'avatar' => $user->avatar ?? '',
            'role' => $user->role,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            'nomor' => 'required|string',
            'jabatan' => 'required|string',
            'unit' => 'required|string',
            'role' => 'required|in:Admin,Arsiparis Umum,Petugas Pencacahan',
        ]);

        // Auto-generate username from name
        $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $data['nama']));
        $username = $cleanName . '_arsiparis';
        
        // Auto-generate avatar initials
        $words = explode(' ', $data['nama']);
        $avatar = '';
        foreach ($words as $w) {
            $avatar .= strtoupper(substr($w, 0, 1));
        }
        $avatar = substr($avatar, 0, 2);

        $user = User::create([
            'name' => $data['nama'],
            'username' => $username,
            'email' => $username . '@ardis.local',
            'password' => Hash::make('Arsipar!s2026'), // default password
            'nomor' => $data['nomor'],
            'jabatan' => $data['jabatan'],
            'unit' => $data['unit'],
            'avatar' => $avatar,
            'role' => $data['role'],
            'jumlah' => 0,
        ]);

        return response()->json([
            'id' => (string) $user->id,
            'nama' => $user->name,
            'nomor' => $user->nomor,
            'jabatan' => $user->jabatan,
            'unit' => $user->unit,
            'jumlah' => $user->jumlah,
            'avatar' => $user->avatar,
            'role' => $user->role,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'nama' => 'required|string',
            'nomor' => 'required|string',
            'jabatan' => 'required|string',
            'unit' => 'required|string',
            'role' => 'required|in:Admin,Arsiparis Umum,Petugas Pencacahan',
        ]);

        // Auto-generate avatar initials
        $words = explode(' ', $data['nama']);
        $avatar = '';
        foreach ($words as $w) {
            $avatar .= strtoupper(substr($w, 0, 1));
        }
        $avatar = substr($avatar, 0, 2);

        $user->update([
            'name' => $data['nama'],
            'nomor' => $data['nomor'],
            'jabatan' => $data['jabatan'],
            'unit' => $data['unit'],
            'avatar' => $avatar,
            'role' => $data['role'],
        ]);

        return response()->json([
            'id' => (string) $user->id,
            'nama' => $user->name,
            'nomor' => $user->nomor,
            'jabatan' => $user->jabatan,
            'unit' => $user->unit,
            'jumlah' => $user->jumlah,
            'avatar' => $user->avatar,
            'role' => $user->role,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true
        ]);
    }

public function exportExcel(Request $request)
    {
        // 401 - cek user login/izin

        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized. Silakan login terlebih dahulu.',
            ], 401);
        }

        $employeeId = $request->query('pegawai_id');

        try {
            if ($employeeId) {
                // 404 - pegawai tidak ditemukan
                $employee = User::find($employeeId);

                if (!$employee) {
                    return response()->json([
                        'message' => "Pegawai dengan ID {$employeeId} tidak ditemukan.",
                    ], 404);
                }

                $records = Arsip::where('status', 'dimusnahkan')
                    ->where('petugas', $employee->name)
                    ->get();

                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();
                $sheet->setTitle($employee->name);

                $headings = [
                    'No',
                    'Tanggal Dimusnahkan',
                    'Tahun Operasional',
                    'Kode Klasifikasi',
                    'Uraian Dokumen',
                    'Pencipta Arsip',
                    'ROP',
                    'Jumlah',
                    'Tanggal Entry',
                    'Tahun Arsip',
                    'Masa Retensi',
                ];
                $sheet->fromArray($headings, null, 'A1');

                foreach ($records as $index => $record) {
                    $sheet->fromArray([
                        $index + 1,
                        $record->tanggal_dimusnahkan,
                        $record->tahun_operasional,
                        $record->kode_klasifikasi,
                        $record->uraian_dokumen,
                        $record->pencipta_arsip,
                        $record->rop,
                        $record->jumlah,
                        $record->tanggal_entry,
                        $record->tahun_arsip,
                        $record->masa_retensi,
                    ], null, 'A' . ($index + 2));
                }

                foreach (range('A', 'K') as $column) {
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                }
                $sheet->getStyle('A1:K1')->getFont()->setBold(true);

                $filename = 'pegawai-' . preg_replace('/[^a-z0-9]+/i', '-', strtolower($employee->name)) . '-riwayat.xlsx';
            } else {
                $employees = User::all();
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();
                $sheet->setTitle('Data Pegawai');

                $headings = [
                    'No',
                    'Nama Pegawai',
                    'Nomor Pegawai',
                    'Jabatan',
                    'Unit',
                    'Jumlah Box Dicacah',
                    'Role',
                    'Email',
                ];
                $sheet->fromArray($headings, null, 'A1');

                foreach ($employees as $index => $user) {
                    $sheet->fromArray([
                        $index + 1,
                        $user->name,
                        $user->nomor ?? '',
                        $user->jabatan ?? '',
                        $user->unit ?? '',
                        $user->jumlah,
                        $user->role,
                        $user->email,
                    ], null, 'A' . ($index + 2));
                }

                foreach (range('A', 'H') as $column) {
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                }
                $sheet->getStyle('A1:H1')->getFont()->setBold(true);

                $filename = 'data-pegawai.xlsx';
            }

            $writer = new Xlsx($spreadsheet);

            // 500 - gagal generate file excel, tangkap saat build response
            $tempPath = tempnam(sys_get_temp_dir(), 'excel_');
            $writer->save($tempPath);

            return response()->download($tempPath, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control' => 'max-age=0',
            ])->deleteFileAfterSend(true);

        } catch (\Throwable $e) {
            Log::error('Export Excel gagal: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Gagal membuat file Excel. Silakan coba lagi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
