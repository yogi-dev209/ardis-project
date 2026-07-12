import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'sonner';

export function PencacahanArsip() {
  const { antrianPencacahanList, riwayatPemusnahanList, processPencacahan, pegawaiList } = useAppContext();
  const [activeTab, setActiveTab] = useState<'antrian' | 'riwayat'>('antrian');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showLaporanModal, setShowLaporanModal] = useState(false);
  const [filterMonth, setFilterMonth] = useState('semua');
  const [filterYear, setFilterYear] = useState('semua');
  const [pencacahanData, setPencacahanData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    petugas: '',
  });

  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (activeTab === 'antrian') {
      if (selectedIds.length === antrianPencacahanList.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(antrianPencacahanList.map(a => a.id));
      }
    }
  };

  const handleProsesPencacahan = () => {
    if (!pencacahanData.petugas) {
      toast.error('Pilih petugas terlebih dahulu');
      return;
    }

    const selectedArsip = antrianPencacahanList.filter(a => selectedIds.includes(a.id));
    const totalBox = selectedArsip.length; // Count boxes, not berkas

    const dateParts = pencacahanData.tanggal.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    processPencacahan(selectedIds, formattedDate, pencacahanData.petugas);
    setSelectedIds([]);
    setShowModal(false);
    setPencacahanData({
      tanggal: new Date().toISOString().split('T')[0],
      petugas: '',
    });
    toast.success(`Pencacahan berhasil dicatat untuk ${totalBox} box`);
  };

  const totalBerkasAntrian = antrianPencacahanList.reduce((sum, arsip) => sum + arsip.jumlah, 0);
  const totalBoxDimusnahkan = riwayatPemusnahanList.length;
  const selectedDokumen = antrianPencacahanList
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.jumlah, 0);

  const filteredRiwayat = riwayatPemusnahanList.filter(arsip => {
    if (!arsip.tanggalDimusnahkan) return false;

    const [day, month, year] = arsip.tanggalDimusnahkan.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    const matchesMonth = filterMonth === 'semua' || monthNum === parseInt(filterMonth);
    const matchesYear = filterYear === 'semua' || yearNum === parseInt(filterYear);

    return matchesMonth && matchesYear;
  });

  const handleResetFilter = () => {
    setFilterMonth('semua');
    setFilterYear('semua');
  };

  const handleEksporExcel = () => {
    toast.success('File Excel berhasil diunduh');
  };

  const handleUnduhLaporan = () => {
    toast.success('Laporan Excel berhasil diunduh');
    setShowLaporanModal(false);
  };

  return (
    <div>
      <h1 className="text-[19px] font-bold text-gray-800 mb-3">Pencacahan Arsip</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total Berkas dalam Antrian</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-orange-600">{totalBerkasAntrian}</span>
            <span className="text-[11px] text-gray-600">berkas</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">({antrianPencacahanList.length} box)</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total Box Sudah Dimusnahkan</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-green-600">{totalBoxDimusnahkan}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-3">
        <button
          onClick={() => setActiveTab('antrian')}
          className={`px-4 py-2 text-[12px] font-medium border-b-2 transition-colors ${
            activeTab === 'antrian'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Antrian Pencacahan
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`px-4 py-2 text-[12px] font-medium border-b-2 transition-colors ${
            activeTab === 'riwayat'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Riwayat Pemusnahan
        </button>
      </div>

      {/* Tab Antrian Pencacahan */}
      {activeTab === 'antrian' && (
        <div>
          {/* Action Button */}
          {selectedIds.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mb-2.5 flex items-center justify-between">
              <span className="text-[12px] font-medium text-gray-700">
                {selectedIds.length} arsip dipilih — {selectedDokumen} dokumen
              </span>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1.5 text-[12px] rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors"
              >
                Proses Pencacahan
              </button>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-3 py-2.5">
              <h2 className="text-white text-[13px] font-semibold">Antrian Pencacahan — {antrianPencacahanList.length} box</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2.5 py-2 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === antrianPencacahanList.length && antrianPencacahanList.length > 0}
                        onChange={handleSelectAll}
                        className="w-3.5 h-3.5 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun Arsip</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode Klasifikasi</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Pencipta Arsip</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {antrianPencacahanList.slice(0, 20).map((arsip, idx) => (
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
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.tahunArsip}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono">{arsip.kodeKlasifikasi}</td>
                      <td className="px-2.5 py-1.5" style={{ minWidth: '220px' }}>
                        <div className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-[1.3]">{arsip.uraianDokumen}</div>
                        <div className="text-[10.5px] text-gray-500 mt-0.5 truncate">Dipindahkan ke antrian pencacahan</div>
                      </td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-600">{arsip.rop}</td>
                      <td className="px-2.5 py-1.5">
                        <span className="inline-block px-1.5 py-0.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-[10.5px] font-medium rounded">
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
                Menampilkan 1–20 dari {antrianPencacahanList.length}
              </div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">‹</button>
                <button className="px-2 py-1 text-[11px] bg-orange-600 text-white rounded">1</button>
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">2</button>
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">3</button>
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">4</button>
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">5</button>
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">›</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Riwayat Pemusnahan */}
      {activeTab === 'riwayat' && (
        <div>
          {/* Filters and Export */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex gap-2">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="semua">Semua Bulan</option>
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="semua">Semua Tahun</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>

              <button
                onClick={handleResetFilter}
                className="px-3 py-1.5 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Filter
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEksporExcel}
                className="bg-[#22a86e] text-white px-3 py-1.5 text-[12px] rounded-lg hover:bg-[#1d8f5e] transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Ekspor Excel
              </button>
              <button
                onClick={() => setShowLaporanModal(true)}
                className="bg-[#22a86e] text-white px-3 py-1.5 text-[12px] rounded-lg hover:bg-[#1d8f5e] transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Laporan Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#22a86e] px-3 py-2.5">
              <h2 className="text-white text-[13px] font-semibold">Riwayat Pemusnahan — {filteredRiwayat.length} box</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700 w-12">No</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tanggal Dimusnahkan</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Pencipta</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Petugas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRiwayat.slice(0, 20).map((arsip, idx) => (
                    <tr key={arsip.id} className={`border-b border-gray-100 hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-600">{idx + 1}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-[#22a86e] font-medium">{arsip.tanggalDimusnahkan}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.tahunArsip}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono">{arsip.kodeKlasifikasi}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800 line-clamp-2 leading-[1.3]" style={{ minWidth: '200px' }}>{arsip.uraianDokumen}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-600">{arsip.rop}</td>
                      <td className="px-2.5 py-1.5">
                        <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[10.5px] font-medium rounded">
                          {arsip.jumlah} box
                        </span>
                      </td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.petugas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Footer */}
            <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex items-center justify-between">
              <div className="text-[11px] text-gray-600">
                Menampilkan 1–20 dari {filteredRiwayat.length}
              </div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">‹</button>
                <button className="px-2 py-1 text-[11px] bg-[#22a86e] text-white rounded">1</button>
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">2</button>
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">3</button>
                <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded">›</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Pencacahan */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h2 className="text-[16px] font-bold text-gray-800 mb-3">Konfirmasi Pencacahan</h2>

            <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
              <p className="text-[11px] text-gray-600 mb-1">Box yang dipilih:</p>
              <p className="text-[16px] font-bold text-gray-800">{selectedIds.length} box</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Total berkas: {antrianPencacahanList.filter(a => selectedIds.includes(a.id)).reduce((sum, a) => sum + a.jumlah, 0)} berkas
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Tanggal Dimusnahkan</label>
                <input
                  type="date"
                  value={pencacahanData.tanggal}
                  onChange={(e) => setPencacahanData({ ...pencacahanData, tanggal: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Petugas yang Bertugas</label>
                <select
                  value={pencacahanData.petugas}
                  onChange={(e) => setPencacahanData({ ...pencacahanData, petugas: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Pilih Petugas</option>
                  {pegawaiList.map(pegawai => (
                    <option key={pegawai.id} value={pegawai.nama}>{pegawai.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPencacahanData({
                    tanggal: new Date().toISOString().split('T')[0],
                    petugas: '',
                  });
                }}
                className="flex-1 px-3 py-1.5 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleProsesPencacahan}
                className="flex-1 px-3 py-1.5 text-[12px] bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Konfirmasi Pencacahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Laporan Excel */}
      {showLaporanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-[16px] font-bold text-gray-800 mb-3">Laporan Riwayat Pemusnahan Arsip</h2>

            <div className="overflow-x-auto mb-4 border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">No</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tanggal</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Nama Box</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Pencipta</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Petugas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRiwayat.slice(0, 10).map((arsip, idx) => (
                    <tr key={arsip.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-600">{idx + 1}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-[#22a86e] font-medium">{arsip.tanggalDimusnahkan}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800 line-clamp-2 leading-[1.3]">{arsip.uraianDokumen}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono">{arsip.kodeKlasifikasi}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.jumlah} box</td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.petugas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRiwayat.length > 10 && (
              <p className="text-[11px] text-gray-500 text-center mb-3">
                Menampilkan 10 dari {filteredRiwayat.length} data. Download Excel untuk melihat semua data.
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowLaporanModal(false)}
                className="flex-1 px-3 py-1.5 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={handleUnduhLaporan}
                className="flex-1 px-3 py-1.5 text-[12px] bg-[#22a86e] text-white rounded-lg hover:bg-[#1d8f5e] transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh sebagai Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
