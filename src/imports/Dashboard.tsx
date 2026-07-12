import { useAppContext } from '../context/AppContext';
import { TrendingUp, Package, Users } from 'lucide-react';

export function Dashboard() {
  const {
    usulanMusnahList,
    pengajuanList,
    tpsList,
    riwayatPemusnahanList,
    pegawaiList,
    antrianPencacahanList,
  } = useAppContext();

  const arsipRetensiHabis = 200;
  const musnahBulanIni = 0;

  const totalDokumenTPS = tpsList.reduce((sum, arsip) => sum + arsip.jumlah, 0);

  const stats = [
    { label: 'Arsip Retensi Habis', value: arsipRetensiHabis, unit: 'box', color: 'text-red-600', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { label: 'Usulan Musnah', value: usulanMusnahList.length, unit: 'box', color: 'text-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
    { label: 'Dalam Pengajuan', value: pengajuanList.length, unit: 'box', color: 'text-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Box di TPS', value: tpsList.length, unit: 'box', color: 'text-teal-600', bgColor: 'bg-teal-50', iconColor: 'text-teal-600' },
    { label: 'Box Dimusnahkan', value: riwayatPemusnahanList.length, unit: 'box', color: 'text-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { label: 'Musnah Bulan Ini', value: musnahBulanIni, unit: 'box', color: 'text-cyan-600', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600' },
    { label: 'Antrian Pencacahan', value: antrianPencacahanList.length, unit: 'box', color: 'text-amber-600', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'Jumlah Pegawai', value: pegawaiList.length, unit: 'orang', color: 'text-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-700' },
  ];

  // Data untuk grafik (6 bulan terakhir)
  const chartData = [
    { month: 'Nov', value: 120 },
    { month: 'Des', value: 105 },
    { month: 'Jan', value: 140 },
    { month: 'Feb', value: 125 },
    { month: 'Mar', value: 130 },
    { month: 'Apr', value: 145 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  // Status alur arsip
  const statusAlur = [
    { label: 'Usulan Musnah', value: usulanMusnahList.length, max: 200, color: 'bg-orange-500' },
    { label: 'Dalam Pengajuan', value: pengajuanList.length, max: 200, color: 'bg-blue-500' },
    { label: 'Di TPS (arsip)', value: tpsList.length, max: 200, color: 'bg-teal-600' },
    { label: 'Antrian Pencacahan', value: antrianPencacahanList.length, max: 200, color: 'bg-amber-700' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-3.5">
        <h1 className="text-[21px] font-semibold text-gray-900">Dashboard</h1>
        <p className="text-[12px] text-gray-600 mt-0.5">Ringkasan dan statistik real-time sistem manajemen arsip ARDIS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2.5 mb-3.5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-[#e8ddd5] p-3 relative overflow-hidden">
            <div className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Package className={`w-3.5 h-3.5 ${stat.iconColor}`} />
            </div>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className={`text-[26px] font-bold leading-none ${stat.color}`}>{stat.value}</span>
                <span className="text-[12px] text-gray-600">{stat.unit}</span>
              </div>
              <div className="text-[12px] text-gray-600 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        {/* Chart Arsip Dimusnahkan */}
        <div className="bg-white rounded-lg border border-[#e8ddd5] p-4">
          <h2 className="text-[13px] font-semibold text-gray-900 mb-0.5">Arsip Dimusnahkan</h2>
          <p className="text-[11px] text-gray-600 mb-3">6 bulan terakhir (arsip)</p>

          <div className="flex items-end justify-between gap-2 h-[140px]">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-[110px]">
                  <div
                    className="w-full bg-[#e8630a] rounded-t transition-all relative group"
                    style={{ height: `${(data.value / maxValue) * 100}%` }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.value}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-600 mt-1.5">{data.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Alur Arsip */}
        <div className="bg-white rounded-lg border border-[#e8ddd5] p-4">
          <h2 className="text-[13px] font-semibold text-gray-900 mb-0.5">Status Alur Arsip</h2>
          <p className="text-[11px] text-gray-600 mb-3">Distribusi arsip per tahapan</p>

          <div className="space-y-3">
            {statusAlur.map((status, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-700">{status.label}</span>
                  <span className="text-[13px] font-bold text-[#e8630a]">{status.value}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${status.color} rounded-full transition-all`}
                    style={{ width: `${(status.value / status.max) * 100}%` }}
                  ></div>
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
                <span className="text-[11px] text-white font-medium">Total Box Dimusnahkan</span>
              </div>
              <span className="text-xl font-bold text-white">{riwayatPemusnahanList.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
