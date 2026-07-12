import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

export function TemporaryStorage() {
  const { tpsList, moveToPencacahan } = useAppContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const totalArsipDiTPS = tpsList.length;
  const totalDokumenDiTPS = tpsList.reduce((sum, arsip) => sum + arsip.jumlah, 0);
  const selectedDokumen = tpsList
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.jumlah, 0);

  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tpsList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tpsList.map(a => a.id));
    }
  };

  const handleMoveToPencacahan = () => {
    if (selectedIds.length === 0) return;

    if (confirm(`Anda akan memindahkan ${selectedIds.length} arsip ke Antrian Pencacahan. Lanjutkan?`)) {
      moveToPencacahan(selectedIds);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} arsip berhasil dipindahkan ke Antrian Pencacahan`);
    }
  };

  return (
    <div>
      <h1 className="text-[19px] font-bold text-gray-800 mb-1">Temporary Storage (TPS)</h1>
      <p className="text-[11px] text-gray-600 mb-3">Tempat penyimpanan sementara arsip yang telah disetujui dan siap diproses ke pencacahan</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total Arsip di TPS</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-teal-600">{totalArsipDiTPS}</span>
            <span className="text-[11px] text-gray-600">arsip</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total Dokumen di TPS</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-purple-600">{totalDokumenDiTPS}</span>
            <span className="text-[11px] text-gray-600">berkas</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Terpilih</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-orange-600">{selectedIds.length}</span>
            <span className="text-[11px] text-gray-600">arsip</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-2.5 mb-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-teal-800">
          Arsip yang sudah disetujui dan menunggu untuk diproses ke tahap pencacahan
        </p>
      </div>

      {/* Action Button */}
      {selectedIds.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mb-2.5 flex items-center justify-between">
          <span className="text-[12px] font-medium text-gray-700">
            {selectedIds.length} arsip dipilih — {selectedDokumen} dokumen
          </span>
          <button
            onClick={handleMoveToPencacahan}
            className="bg-purple-600 text-white px-3 py-1.5 text-[12px] rounded-lg hover:bg-purple-700 transition-colors"
          >
            Pindahkan ke Pencacahan
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-purple-600 px-3 py-2.5">
          <h2 className="text-white text-[13px] font-semibold">Daftar Arsip di TPS — {tpsList.length} arsip</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2.5 py-2 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === tpsList.length && tpsList.length > 0}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-gray-300"
                  />
                </th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tanggal Entry</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tanggal Pemindahan</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode Klasifikasi</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Masa Retensi</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Pencipta Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {tpsList.slice(0, 20).map((arsip, idx) => (
                <tr
                  key={arsip.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${selectedIds.includes(arsip.id) ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
                >
                  <td className="px-2.5 py-1.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(arsip.id)}
                      onChange={() => handleCheckboxChange(arsip.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.tanggalEntry}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-teal-600 font-medium">{arsip.tanggalPemindahan}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono">{arsip.kodeKlasifikasi}</td>
                  <td className="px-2.5 py-1.5" style={{ minWidth: '220px' }}>
                    <div className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-[1.3]">{arsip.uraianDokumen}</div>
                    <div className="text-[10.5px] text-gray-500 mt-0.5 truncate">Siap untuk pencacahan</div>
                  </td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.tahunArsip}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.masaRetensi}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-600">{arsip.rop}</td>
                  <td className="px-2.5 py-1.5">
                    <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10.5px] font-medium rounded">
                      {arsip.jumlah} berkas
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex items-center justify-between">
          <div className="text-[11px] text-gray-600">
            Menampilkan 1–20 dari {tpsList.length}
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">‹</button>
            <button className="px-2 py-1 text-[11px] bg-teal-600 text-white rounded">1</button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">2</button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">3</button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">4</button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">5</button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
