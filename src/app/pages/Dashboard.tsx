import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { TrendingUp, Package, Info } from 'lucide-react';

interface DashboardApiResponse {
  usulan: number;
  pengajuan: number;
  tps: number;
  antrian: number;
  riwayat: number;
  arsipRetensiHabis: number;
  chartData: { month: string; value: number }[];
}

function getMonthFromIdDate(dateStr: string): number | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length < 2) return null;
  return parseInt(parts[1]);
}

export function Dashboard() {
  const {
    usulanMusnahList,
    pengajuanList,
    tpsList,
    riwayatPemusnahanList,
    pegawaiList,
    antrianPencacahanList,
    tahunOperasional,
  } = useAppContext();

  const [dashboardData, setDashboardData] = useState<DashboardApiResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoadingDashboard(true);
      try {
        const res = await fetch(`/api/dashboard?tahun_operasional=${encodeURIComponent(tahunOperasional)}`, {
          headers: { Accept: 'application/json' },
          credentials: 'same-origin',
        });
        if (res.ok) {
          const data: DashboardApiResponse = await res.json();
          setDashboardData(data);
        } else {
          setDashboardData(null);
        }
      } catch (e) {
        console.error('Failed to load dashboard data', e);
        setDashboardData(null);
      } finally {
        setLoadingDashboard(false);
      }
    };

    void loadDashboard();
  }, [tahunOperasional]);

  const arsipRetensiHabis = dashboardData?.arsipRetensiHabis ?? 0;
  const chartData = dashboardData?.chartData ?? [];
  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  const currentMonth = new Date().getMonth() + 1;
  const musnahBulanIni = riwayatPemusnahanList.filter(a => {
    if (!a.tanggalDimusnahkan) return false;
    return getMonthFromIdDate(a.tanggalDimusnahkan) === currentMonth;
  }).length;

  const isEmptyYear = dashboardData ? false : tahunOperasional !== '2026';

  const stats = [
    {
      label: 'Arsip Retensi Habis',
      value: isEmptyYear ? 0 : arsipRetensiHabis,
      unit: 'box',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'Usulan Musnah',
      value: dashboardData?.usulan ?? usulanMusnahList.length,
      unit: 'box',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Dalam Pengajuan',
      value: dashboardData?.pengajuan ?? pengajuanList.length,
      unit: 'box',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Box di TPS',
      value: dashboardData?.tps ?? tpsList.length,
      unit: 'box',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      label: 'Box Dimusnahkan',
      value: dashboardData?.riwayat ?? riwayatPemusnahanList.length,
      unit: 'box',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Musnah Bulan Ini',
      value: musnahBulanIni,
      unit: 'box',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      label: 'Antrian Pencacahan',
      value: dashboardData?.antrian ?? antrianPencacahanList.length,
      unit: 'box',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Jumlah Pegawai',
      value: pegawaiList.length,
      unit: 'orang',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-700',
    },
  ];

  const statusAlur = [
    { label: 'Usulan Musnah', value: usulanMusnahList.length, max: Math.max(usulanMusnahList.length, 1), color: 'bg-orange-500' },
    { label: 'Dalam Pengajuan', value: pengajuanList.length, max: Math.max(usulanMusnahList.length, 1), color: 'bg-blue-500' },
    { label: 'Di TPS', value: tpsList.length, max: Math.max(usulanMusnahList.length, 1), color: 'bg-teal-600' },
    { label: 'Antrian Pencacahan', value: antrianPencacahanList.length, max: Math.max(usulanMusnahList.length, 1), color: 'bg-amber-700' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h1 className="text-[19px] font-bold text-gray-900">Dashboard</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Ringkasan dan statistik real-time sistem manajemen arsip ARDIS</p>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-[10.5px] text-blue-700">
            Data ditampilkan berdasarkan Tahun Operasional <strong>{tahunOperasional}</strong>
            {isEmptyYear && ' — Sistem baru dibuat tahun 2026'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-2.5 relative overflow-hidden">
            <div className={`absolute top-2 left-2 w-7 h-7 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Package className={`w-3 h-3 ${stat.iconColor}`} />
            </div>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className={`text-[24px] font-bold leading-none ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-[11px] text-gray-600">{stat.unit}</span>
              </div>
              <div className="text-[11px] text-gray-600 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Chart Arsip Dimusnahkan — 12 bulan penuh */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-[12px] font-semibold text-gray-900 mb-0.5">Arsip Dimusnahkan</h2>
          <p className="text-[10.5px] text-gray-600 mb-2.5">Januari – Desember {tahunOperasional}</p>

          {isEmptyYear ? (
            <div className="h-[130px] flex items-center justify-center">
              <p className="text-[11px] text-gray-400 text-center">
                Tidak ada data pemusnahan<br />pada tahun {tahunOperasional}
              </p>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-1 h-[130px]">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-[100px]">
                    {data.value > 0 ? (
                      <div
                        className="w-full bg-[#e8630a] rounded-t transition-all relative group"
                        style={{ height: `${(data.value / maxValue) * 100}%` }}
                      >
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.value}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-1 bg-gray-100 rounded-t" />
                    )}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1">{data.month}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Alur Arsip */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-[12px] font-semibold text-gray-900 mb-0.5">Status Alur Arsip</h2>
          <p className="text-[10.5px] text-gray-600 mb-2.5">Distribusi arsip per tahapan — {tahunOperasional}</p>

          <div className="space-y-3">
            {statusAlur.map((status, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-700">{status.label}</span>
                  <span className="text-[13px] font-bold text-[#e8630a]">
                    {status.value > 0 ? status.value : '—'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${status.color} rounded-full transition-all`}
                    style={{ width: `${status.value > 0 ? Math.min((status.value / status.max) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="bg-gradient-to-r from-[#1a2642] to-[#2a3652] rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#e8630a] flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <span className="text-[11px] text-white font-medium">Total Box Dimusnahkan</span>
                  <div className="text-[9.5px] text-white/60">Tahun {tahunOperasional}</div>
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                {riwayatPemusnahanList.length > 0 ? riwayatPemusnahanList.length : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Aktivitas Pemusnahan Terbaru */}
      <div className="bg-white rounded-lg border border-[#e8ddd5] overflow-hidden">
        <div className="bg-[#e8630a] px-3 py-2.5 flex items-center justify-between">
          <h2 className="text-white text-[13px] font-semibold">Aktivitas Pemusnahan Terbaru</h2>
          <span className="text-[10.5px] text-white/80">Tahun Operasional {tahunOperasional}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700 w-10">No</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tanggal</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode Klasifikasi</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Pencipta Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Petugas</th>
              </tr>
            </thead>
            <tbody>
              {riwayatPemusnahanList.slice(0, 5).map((arsip, idx) => (
                <tr
                  key={arsip.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
                >
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-600">{idx + 1}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-[#e8630a] font-medium">{arsip.tanggalDimusnahkan}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono">{arsip.kodeKlasifikasi}</td>
                  <td
                    className="px-2.5 py-1.5 text-[11px] text-gray-800 line-clamp-2 leading-[1.3]"
                    style={{ minWidth: '200px' }}
                  >
                    {arsip.uraianDokumen}
                  </td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-700">{arsip.tahunArsip}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-700">{arsip.rop}</td>
                  <td className="px-2.5 py-1.5">
                    <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[10.5px] font-semibold rounded">
                      1 box
                    </span>
                  </td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.petugas}</td>
                </tr>
              ))}
              {riwayatPemusnahanList.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <div className="text-gray-400 text-[12px]">
                      Belum ada aktivitas pemusnahan pada Tahun Operasional {tahunOperasional}
                    </div>
                    {isEmptyYear && (
                      <div className="text-gray-400 text-[11px] mt-1">
                        Data operasional dimulai dari Tahun 2026
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
