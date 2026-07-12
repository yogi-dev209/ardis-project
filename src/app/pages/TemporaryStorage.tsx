import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { DEP_DEPARTMENTS } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftCircle, MoveRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Pagination } from '../components/Pagination';

const BULAN_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function getMonthFromIdDate(dateStr: string): number | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length < 2) return null;
  return parseInt(parts[1]);
}

export function TemporaryStorage() {
  const { tpsList, moveToPencacahan, returnFromTPS, pegawaiList, tahunOperasional } = useAppContext();
  const { user } = useAuth();
  const isViewOnly = user?.role === 'arsiparis_umum';
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('semua');
  const [selectedTahunArsip, setSelectedTahunArsip] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');

  const [showKonfirmasiModal, setShowKonfirmasiModal] = useState(false);
  const [konfirmasiData, setKonfirmasiData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    petugas: '',
  });

  const [showKembalikanModal, setShowKembalikanModal] = useState(false);
  const [kembalikanData, setKembalikanData] = useState({
    tujuan: 'usulan' as 'usulan',
    alasan: '',
  });

  const filteredData = useMemo(() => {
    setCurrentPage(1);
    return tpsList.filter(arsip => {
      const matchesSearch = !searchQuery ||
        arsip.uraianDokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        arsip.kodeKlasifikasi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'semua' || arsip.penciptaArsip === selectedDept;
      const matchesTahun = selectedTahunArsip === 'semua' || arsip.tahunArsip === selectedTahunArsip;
      const matchesStatus = selectedStatus === 'semua' ||
        (selectedStatus === 'baru' && arsip.statusTPS === 'baru') ||
        (selectedStatus === 'antrian' && arsip.statusTPS === 'antrian');
      return matchesSearch && matchesDept && matchesTahun && matchesStatus;
    });
  }, [tpsList, searchQuery, selectedDept, selectedTahunArsip, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const pagedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const countBaru = tpsList.filter(a => a.statusTPS === 'baru').length;
  const countAntrian = tpsList.filter(a => a.statusTPS === 'antrian').length;

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

  const handleKonfirmasiPencacahan = () => {
    if (!konfirmasiData.tanggal || !konfirmasiData.petugas) {
      toast.error('Tanggal dan Petugas harus diisi');
      return;
    }
    const [y, m, d] = konfirmasiData.tanggal.split('-');
    const formattedDate = `${d}/${m}/${y}`;
    moveToPencacahan(selectedIds, formattedDate, konfirmasiData.petugas);
    setShowKonfirmasiModal(false);
    setSelectedIds([]);
    setKonfirmasiData({ tanggal: new Date().toISOString().split('T')[0], petugas: '' });
    toast.success(`${selectedIds.length} box berhasil dipindahkan ke Antrian Pencacahan (Siap Dicacah)`);
  };

  const handleKembalikan = () => {
    if (!kembalikanData.alasan.trim()) {
      toast.error('Alasan pengembalian harus diisi');
      return;
    }
    const count = selectedIds.length;
    const tujuanLabel = kembalikanData.tujuan === 'pengajuan' ? 'Pengajuan' : 'Usulan Musnah';
    returnFromTPS(selectedIds, kembalikanData.tujuan, kembalikanData.alasan);
    setShowKembalikanModal(false);
    setSelectedIds([]);
    setKembalikanData({ tujuan: 'pengajuan', alasan: '' });
    toast.success(`${count} box berhasil dikembalikan ke ${tujuanLabel}`);
  };

  const selectedBoxes = tpsList.filter(a => selectedIds.includes(a.id));
  // Removed - not needed

  return (
    <div>
      <h1 className="text-[19px] font-bold text-gray-800 mb-1">Temporary Storage (TPS)</h1>
      <p className="text-[11px] text-gray-600 mb-3">
        Tempat penyimpanan sementara arsip yang telah disetujui dan menunggu proses pencacahan — Tahun {tahunOperasional}
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total Arsip di TPS</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-teal-600">{tpsList.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Box Baru Masuk</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-blue-600">{countBaru}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
          <div className="text-[9.5px] text-gray-400 mt-0.5">≤ 1×24 jam</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Box Dalam Antrian</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-orange-600">{countAntrian}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
          <div className="text-[9.5px] text-gray-400 mt-0.5">&gt; 1×24 jam</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Box Terpilih</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-purple-600">{selectedIds.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
          {selectedIds.length > 0 && (
            <div className="text-[9.5px] text-gray-400 mt-0.5"></div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-2.5 mb-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-teal-800">
          <span className="font-semibold">Baru Masuk</span> — arsip yang dipindahkan dalam 1×24 jam terakhir.{' '}
          <span className="font-semibold">Dalam Antrian</span> — arsip yang telah lebih dari 1×24 jam di TPS dan menunggu pencacahan.
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-5 gap-2 mb-2.5">
        <input
          type="text"
          placeholder="Cari nama dokumen..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="semua">Semua Departemen</option>
          {DEP_DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={selectedTahunArsip}
          onChange={e => setSelectedTahunArsip(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="semua">Tahun Arsip - Semua</option>
          {Array.from(new Set(tpsList.map(a => a.tahunArsip))).sort().map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ROP..."
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="semua">Semua Status</option>
          <option value="baru">Baru Masuk</option>
          <option value="antrian">Dalam Antrian</option>
        </select>
      </div>

      {/* Action Bar */}
      {selectedIds.length > 0 && !isViewOnly && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mb-2.5 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setShowKembalikanModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <ArrowLeftCircle className="w-3.5 h-3.5" />
              Kembalikan
            </button>
            <button
              onClick={() => setShowKonfirmasiModal(true)}
              className="flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 text-[12px] rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              <MoveRight className="w-3.5 h-3.5" />
              Pindahkan dan Konfirmasi Pencacahan
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-3 py-2.5">
          <h2 className="text-white text-[13px] font-semibold">
            Daftar Arsip di TPS — {filteredData.length} box
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {!isViewOnly && (
                  <th className="px-2.5 py-2 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                      className="w-3.5 h-3.5 rounded border-gray-300"
                    />
                  </th>
                )}
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tgl Masuk TPS</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Departemen/Pencipta</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((arsip, idx) => (
                <tr
                  key={arsip.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    selectedIds.includes(arsip.id) ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                  }`}
                >
                  {!isViewOnly && (
                    <td className="px-2.5 py-1.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(arsip.id)}
                        onChange={() => handleCheckboxChange(arsip.id)}
                        className="w-3.5 h-3.5 rounded border-gray-300"
                      />
                    </td>
                  )}
                  <td className="px-2.5 py-1.5 text-[11px] text-teal-600 font-medium whitespace-nowrap">
                    {arsip.tanggalPemindahan}
                  </td>
                  <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono whitespace-nowrap">
                    {arsip.kodeKlasifikasi}
                  </td>
                  <td className="px-2.5 py-1.5" style={{ minWidth: '200px' }}>
                    <div className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-[1.3]">
                      {arsip.uraianDokumen}
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.tahunArsip}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                  <td className="px-2.5 py-1.5 text-[10.5px] text-gray-500">{arsip.rop}</td>
                  <td className="px-2.5 py-1.5">
                    <span className="inline-block px-1.5 py-0.5 bg-teal-100 text-teal-700 text-[10.5px] font-medium rounded">
                      1 box
                    </span>
                  </td>
                  <td className="px-2.5 py-1.5">
                    {arsip.statusTPS === 'baru' ? (
                      <span className="inline-block px-1.5 py-0.5 bg-blue-500 text-white text-[10.5px] font-medium rounded">
                        Baru Masuk
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 bg-orange-500 text-white text-[10.5px] font-medium rounded">
                        Dalam Antrian
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[12px] text-gray-400">
                    Tidak ada data yang sesuai dengan filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={ITEMS_PER_PAGE}
          activeColorClass="bg-teal-600"
          unit="box"
        />
      </div>

      {/* ── Modal Konfirmasi Pencacahan ─────────────────────────────────────── */}
      {showKonfirmasiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-5 py-4">
              <h2 className="text-[15px] font-bold text-white">Pindahkan dan Konfirmasi Pencacahan</h2>
              <p className="text-[10.5px] text-teal-200 mt-0.5">Data akan masuk ke Antrian Pencacahan dengan status Siap Dicacah</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {/* Summary */}
              <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-gray-500">Box Dipilih</div>
                  <div className="text-[18px] font-bold text-teal-700">{selectedIds.length} box</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Total Berkas</div>
                  <div className="text-[18px] font-bold text-teal-700"></div>
                </div>
              </div>
              {/* Tanggal */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Tanggal Pencacahan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={konfirmasiData.tanggal}
                  onChange={e => setKonfirmasiData({ ...konfirmasiData, tanggal: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {/* Petugas */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Petugas Pencacah <span className="text-red-500">*</span>
                </label>
                <select
                  value={konfirmasiData.petugas}
                  onChange={e => setKonfirmasiData({ ...konfirmasiData, petugas: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Pilih Petugas</option>
                  {pegawaiList.map(p => (
                    <option key={p.id} value={p.nama}>{p.nama}</option>
                  ))}
                </select>
              </div>
              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowKonfirmasiModal(false);
                    setKonfirmasiData({ tanggal: new Date().toISOString().split('T')[0], petugas: '' });
                  }}
                  className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleKonfirmasiPencacahan}
                  className="flex-1 px-3 py-2 text-[12px] bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Simpan Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Kembalikan ────────────────────────────────────────────────── */}
      {showKembalikanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-700 px-5 py-4">
              <h2 className="text-[15px] font-bold text-white">Konfirmasi Pengembalian</h2>
              <p className="text-[10.5px] text-red-200 mt-0.5">Kembalikan box ke tahap sebelumnya</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {/* Summary */}
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <div className="text-[10px] text-gray-500 mb-0.5">Jumlah Box Terpilih</div>
                <div className="text-[18px] font-bold text-red-600">{selectedIds.length} box</div>
              </div>
              {/* Tujuan */}
              <div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-amber-900">
                    Tujuan Pengembalian: <span className="text-amber-700">Usulan Musnah</span>
                  </p>
                  <p className="text-[10px] text-amber-700 mt-1">
                    Box akan dikembalikan ke tahap Usulan Musnah untuk ditinjau ulang.
                  </p>
                </div>
              </div>
              {/* Alasan */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Alasan Pengembalian <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={kembalikanData.alasan}
                  onChange={e => setKembalikanData({ ...kembalikanData, alasan: e.target.value })}
                  placeholder="Tuliskan alasan pengembalian..."
                  rows={3}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>
              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowKembalikanModal(false);
                    setKembalikanData({ tujuan: 'pengajuan', alasan: '' });
                  }}
                  className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleKembalikan}
                  className="flex-1 px-3 py-2 text-[12px] bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Simpan Pengembalian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
