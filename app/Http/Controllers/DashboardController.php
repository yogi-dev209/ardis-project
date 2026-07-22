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

        // Statistik berdasarkan status
        $usulanCount = $arsips->where('status', 'usulan')->count();

        $pengajuanCount = $arsips
            ->whereIn('status', ['pengajuan_baru', 'pengajuan_menunggu'])
            ->count();

        $tpsCount = $arsips
            ->whereIn('status', ['tps_baru', 'tps_antrian'])
            ->count();

        $antrianCount = $arsips
            ->where('status', 'siap_dicacah')
            ->count();

        $riwayatCount = $arsips
            ->where('status', 'dimusnahkan')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Arsip Retensi Habis
        |--------------------------------------------------------------------------
        | Disamakan dengan jumlah arsip yang berstatus "usulan"
        |--------------------------------------------------------------------------
        */
        $arsipRetensiHabis = $usulanCount;

        // Grafik pemusnahan per bulan
        $labels = [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
        ];

        $monthlyChart = [];

        for ($month = 1; $month <= 12; $month++) {

            $value = $arsips->filter(function ($arsip) use ($month) {

                if (empty($arsip->tanggal_dimusnahkan)) {
                    return false;
                }

                $parts = explode('/', $arsip->tanggal_dimusnahkan);

                return isset($parts[1]) && intval($parts[1]) === $month;

            })->count();

            $monthlyChart[] = [
                'month' => $labels[$month - 1],
                'value' => $value,
            ];
        }

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