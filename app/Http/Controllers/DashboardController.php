<?php

namespace App\Http\Controllers;

use App\Models\Arsip;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('tahun_operasional', '2026');

        $arsips = Arsip::where('tahun_operasional', $year)->get();

        $usulanCount = $arsips->where('status', 'usulan')->count();
        $pengajuanCount = $arsips->whereIn('status', ['pengajuan_baru', 'pengajuan_menunggu'])->count();
        $tpsCount = $arsips->whereIn('status', ['tps_baru', 'tps_antrian'])->count();
        $antrianCount = $arsips->where('status', 'siap_dicacah')->count();
        $riwayatCount = $arsips->where('status', 'dimusnahkan')->count();

        $monthlyChart = collect(range(1, 12))->map(function ($month) use ($arsips) {
            $value = $arsips->filter(function ($arsip) use ($month) {
                if (empty($arsip->tanggal_dimusnahkan)) {
                    return false;
                }
                $parts = explode('/', $arsip->tanggal_dimusnahkan);
                return isset($parts[1]) && intval($parts[1]) === $month;
            })->count();

            $labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
            return [
                'month' => $labels[$month - 1],
                'value' => $value,
            ];
        })->all();

        $arsipRetensiHabis = $arsips->where('retensi', '<=', 0)->count();

        return response()->json([
            'usulan' => $usulanCount,
            'pengajuan' => $pengajuanCount,
            'tps' => $tpsCount,
            'antrian' => $antrianCount,
            'riwayat' => $riwayatCount,
            'arsipRetensiHabis' => $arsipRetensiHabis,
            'chartData' => $monthlyChart,
        ]);
    }
}
