import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Pencil, Trash2, Plus, Eye, Download, Users } from 'lucide-react';
import { toast } from 'sonner';

export function DataPegawai() {
  const { pegawaiList, riwayatPemusnahanList } = useAppContext();
  const [selectedMonth, setSelectedMonth] = useState('semua');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<any>(null);

  const handleLihatDetail = (pegawai: any) => {
    setSelectedPegawai(pegawai);
    setShowDetailModal(true);
  };

  const handleUnduhExcel = () => {
    toast.success(`Laporan Excel ${selectedPegawai?.nama} berhasil diunduh`);
  };

  const pegawaiBoxList = selectedPegawai
    ? riwayatPemusnahanList.filter(r => r.petugas === selectedPegawai.nama)
    : [];

  const totalBoxDimusnahkan = 500;
  const rataRataPerPegawai = 30;

  return (
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h1 className="text-[21px] font-semibold text-gray-900">Data Pegawai</h1>
          <p className="text-[12px] text-gray-600 mt-0.5">Rekap pegawai arsiparis dan dokumen yang telah dimusnahkan</p>
        </div>
        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-[13px]">
          <Plus className="w-3.5 h-3.5" />
          Tambah Pegawai
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-3.5">
        <div className="bg-white rounded-lg border border-[#e8ddd5] p-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] font-bold text-blue-600">{pegawaiList.length}</span>
            <span className="text-[12px] text-gray-600">orang</span>
          </div>
          <p className="text-[12px] text-gray-600 mt-0.5">Total Pegawai</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e8ddd5] p-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] font-bold text-orange-600">{totalBoxDimusnahkan}</span>
            <span className="text-[12px] text-gray-600">box</span>
          </div>
          <p className="text-[12px] text-gray-600 mt-0.5">Total Box Dimusnahkan</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e8ddd5] p-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] font-bold text-green-700">{rataRataPerPegawai}</span>
            <span className="text-[12px] text-gray-600">box/bulan</span>
          </div>
          <p className="text-[12px] text-gray-600 mt-0.5">Rata-rata per Pegawai</p>
        </div>
      </div>

      {/* Grafik Distribusi */}
      <div className="bg-white rounded-lg border border-[#e8ddd5] p-4 mb-3.5">
        <h2 className="text-[13px] font-semibold text-gray-900 mb-0.5">Distribusi Box Dicacah per Pegawai</h2>
        <div className="flex items-end justify-between gap-2 h-[150px] mt-3">
          {pegawaiList.map((pegawai, idx) => {
            const maxJumlah = Math.max(...pegawaiList.map(p => p.jumlah));
            const height = (pegawai.jumlah / maxJumlah) * 100;

            return (
              <div key={pegawai.id} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-[120px]">
                  <div
                    className="w-full bg-[#e8630a] rounded-t transition-all relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {pegawai.jumlah}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-gray-600 mt-1.5 text-center truncate w-full px-0.5">
                  {pegawai.nama.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pegawai Table */}
      <div className="bg-white rounded-lg border border-[#e8ddd5] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            <h2 className="font-semibold text-white text-[13px]">Daftar Pegawai Arsiparis</h2>
          </div>
          <span className="text-[11px] text-white/90">Total: {pegawaiList.length} pegawai</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-700">No</th>
                <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-700">Nama Pegawai</th>
                <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-700">Nomor Pegawai</th>
                <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-700">Jabatan</th>
                <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-700">Unit</th>
                <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-700">Jumlah Box Dicacah</th>
                <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pegawaiList.map((pegawai, idx) => (
                <tr key={pegawai.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                  <td className="px-3 py-2 text-[12px] text-gray-800">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#e8630a] flex items-center justify-center text-white font-bold text-[10px]">
                        {pegawai.avatar}
                      </div>
                      <span className="text-[12px] text-gray-900 font-medium">{pegawai.nama}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[12px] text-blue-600">{pegawai.nomor}</td>
                  <td className="px-3 py-2 text-[12px] text-gray-700">{pegawai.jabatan}</td>
                  <td className="px-3 py-2 text-[12px] text-gray-700">{pegawai.unit}</td>
                  <td className="px-3 py-2">
                    <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-semibold rounded-full">
                      {pegawai.jumlah} box
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleLihatDetail(pegawai)}
                        className="px-2 py-1 bg-blue-600 text-white text-[11px] rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Detail
                      </button>
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPegawai && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Detail Box Dicacah — {selectedPegawai.nama}
              </h2>
              <button
                onClick={handleUnduhExcel}
                className="bg-[#22a86e] text-white px-4 py-2 rounded-lg hover:bg-[#1d8f5e] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Unduh Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">No</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Nama Box</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Kode Klasifikasi</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Jumlah Box</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pegawaiBoxList.map((box, idx) => (
                    <tr key={box.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{box.tanggalDimusnahkan}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{box.uraianDokumen}</td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-mono">{box.kodeKlasifikasi}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{box.jumlah} box</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{box.penciptaArsip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
