import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Info, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function UsulanMusnah() {
  const { usulanMusnahList, addUsulanMusnah, moveToPengajuan } = useAppContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('semua');
  const [selectedYear, setSelectedYear] = useState('semua');
  const [showModal, setShowModal] = useState(false);
  const [newData, setNewData] = useState({
    tanggalEntry: '',
    kodeKlasifikasi: '',
    uraianDokumen: '',
    tahunArsip: '',
    masaRetensi: '',
    penciptaArsip: '',
    rop: '',
    jumlah: 4,
  });

  const filteredData = useMemo(() => {
    return usulanMusnahList.filter(arsip => {
      const matchesSearch = arsip.uraianDokumen.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'semua' || arsip.penciptaArsip === selectedDept;
      const matchesYear = selectedYear === 'semua' || arsip.tahunArsip === selectedYear;
      return matchesSearch && matchesDept && matchesYear;
    });
  }, [usulanMusnahList, searchQuery, selectedDept, selectedYear]);

  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(a => a.id));
    }
  };

  const handleMoveToPengajuan = () => {
    if (selectedIds.length === 0) return;

    if (confirm(`Anda akan memindahkan ${selectedIds.length} arsip ke Pengajuan. Lanjutkan?`)) {
      moveToPengajuan(selectedIds);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} arsip berhasil dipindahkan ke Pengajuan`);
    }
  };

  const handleSaveData = () => {
    const arsip = {
      id: `usulan-new-${Date.now()}`,
      ...newData,
    };

    addUsulanMusnah(arsip);
    setShowModal(false);
    setNewData({
      tanggalEntry: '',
      kodeKlasifikasi: '',
      uraianDokumen: '',
      tahunArsip: '',
      masaRetensi: '',
      penciptaArsip: '',
      rop: '',
      jumlah: 4,
    });
    toast.success('Data berhasil disimpan');
  };

  const arsipRetensiHabis = 200;
  const dalamPengajuan = 100;
  const totalDiTPS = 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[19px] font-bold text-gray-900">Usulan Musnah</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Arsip retensi habis yang diusulkan untuk dimusnahkan</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-[12px]"
        >
          <Plus className="w-3.5 h-3.5" />
          Entry Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Arsip Retensi Habis</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-red-600">{arsipRetensiHabis}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Usulan Musnah</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-orange-600">{usulanMusnahList.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Dalam Pengajuan</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-blue-600">{dalamPengajuan}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total di TPS</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-teal-600">{totalDiTPS}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 mb-2.5 flex items-start gap-2">
        <Info className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-orange-800">
          Arsip yang sudah melewati masa retensi. Pilih arsip yang akan diajukan untuk pemusnahan.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-2 mb-2.5">
        <input
          type="text"
          placeholder="Cari nama berkas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="semua">Semua Departemen</option>
          <option value="Dept Keuangan">Dept Keuangan</option>
          <option value="Dept SDM">Dept SDM</option>
          <option value="Dept Teknik">Dept Teknik</option>
          <option value="Dept Sekretariat">Dept Sekretariat</option>
          <option value="Dept Perencanaan">Dept Perencanaan</option>
          <option value="Dept Umum">Dept Umum</option>
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="semua">Semua Tahun</option>
          {Array.from({ length: 21 }, (_, i) => 2000 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Action Button */}
      {selectedIds.length > 0 && (
        <div className="mb-2.5">
          <button
            onClick={handleMoveToPengajuan}
            className="bg-orange-600 text-white px-4 py-1.5 rounded-lg hover:bg-orange-700 transition-colors text-[13px]"
          >
            Pindahkan ke Pengajuan ({selectedIds.length} arsip)
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-[#e8630a] px-3 py-2.5">
          <h2 className="text-white text-[13px] font-semibold">Daftar Usulan Musnah — {filteredData.length} arsip</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2.5 py-2 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-gray-300"
                  />
                </th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tanggal Entry</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Masa Retensi</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Pencipta</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 20).map((arsip, idx) => (
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
                  <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono">{arsip.kodeKlasifikasi}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800 line-clamp-2 leading-[1.3]" style={{ minWidth: '220px' }}>{arsip.uraianDokumen}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.tahunArsip}</td>
                  <td className="px-2.5 py-1.5">
                    <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-700 text-[10.5px] rounded">
                      {arsip.masaRetensi}
                    </span>
                  </td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-600">{arsip.rop}</td>
                  <td className="px-2.5 py-1.5">
                    <span className="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10.5px] font-medium rounded">
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
            Menampilkan 1–20 dari {filteredData.length}
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">‹</button>
            <button className="px-2 py-1 text-[11px] bg-orange-600 text-white rounded">1</button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">2</button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">3</button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">›</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-[16px] font-bold text-gray-800 mb-3">Entry Data Usulan Musnah</h2>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Tanggal Entry</label>
                <input
                  type="date"
                  value={newData.tanggalEntry}
                  onChange={(e) => setNewData({ ...newData, tanggalEntry: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Kode Klasifikasi</label>
                <input
                  type="text"
                  value={newData.kodeKlasifikasi}
                  onChange={(e) => setNewData({ ...newData, kodeKlasifikasi: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: NK.01.02 atau T-123456"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Uraian Dokumen</label>
                <input
                  type="text"
                  value={newData.uraianDokumen}
                  onChange={(e) => setNewData({ ...newData, uraianDokumen: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Tahun Arsip</label>
                <input
                  type="text"
                  value={newData.tahunArsip}
                  onChange={(e) => setNewData({ ...newData, tahunArsip: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Masa Retensi</label>
                <input
                  type="date"
                  value={newData.masaRetensi}
                  onChange={(e) => setNewData({ ...newData, masaRetensi: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Pencipta Arsip</label>
                <select
                  value={newData.penciptaArsip}
                  onChange={(e) => setNewData({ ...newData, penciptaArsip: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Departemen</option>
                  <option value="Dept Keuangan">Dept Keuangan</option>
                  <option value="Dept SDM">Dept SDM</option>
                  <option value="Dept Teknik">Dept Teknik</option>
                  <option value="Dept Sekretariat">Dept Sekretariat</option>
                  <option value="Dept Perencanaan">Dept Perencanaan</option>
                  <option value="Dept Umum">Dept Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">ROP (Ruang/Lokasi Penyimpanan)</label>
                <input
                  type="text"
                  value={newData.rop}
                  onChange={(e) => setNewData({ ...newData, rop: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Gedung A Lt.1 Rak 5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Jumlah Berkas dalam Box</label>
                <input
                  type="number"
                  value={newData.jumlah}
                  onChange={(e) => setNewData({ ...newData, jumlah: parseInt(e.target.value) })}
                  min={1}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 py-1.5 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveData}
                className="flex-1 px-3 py-1.5 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
