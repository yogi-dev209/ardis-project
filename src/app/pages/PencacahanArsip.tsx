import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { DEP_DEPARTMENTS } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FileSpreadsheet, FileText, ArrowLeftCircle } from 'lucide-react';
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

function getBulanName(dateStr: string): string {
  const m = getMonthFromIdDate(dateStr);
  if (m === null || m < 1 || m > 12) return '-';
  return BULAN_NAMES[m - 1];
}

const ITEMS_PER_PAGE = 20;

export function PencacahanArsip() {
  const {
    antrianPencacahanList,
    riwayatPemusnahanList,
    processPencacahan,
    returnFromPencacahan,
    returnFromRiwayat,
    pegawaiList,
    tahunOperasional,
  } = useAppContext();
  const { user } = useAuth();
  const isViewOnly = user?.role === 'arsiparis_umum';

  const [activeTab, setActiveTab] = useState<'antrian' | 'riwayat'>('antrian');

  // ── Antrian state ────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPageAntrian, setCurrentPageAntrian] = useState(1);
  const [showProsesModal, setShowProsesModal] = useState(false);
  const [showKembalikanAntrianModal, setShowKembalikanAntrianModal] = useState(false);
  const [prosesData, setProsesData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    petugas: '',
  });
  const [kembalikanAntrianAlasan, setKembalikanAntrianAlasan] = useState('');
  const [searchAntrian, setSearchAntrian] = useState('');
  const [filterDeptAntrian, setFilterDeptAntrian] = useState('semua');
  const [filterTahunArsipAntrian, setFilterTahunArsipAntrian] = useState('semua');
  const [filterROPAntrian, setFilterROPAntrian] = useState('');

  // ── Riwayat state ────────────────────────────────────────────────────────
  const [selectedRiwayatIds, setSelectedRiwayatIds] = useState<string[]>([]);
  const [currentPageRiwayat, setCurrentPageRiwayat] = useState(1);
  const [showKembalikanRiwayatModal, setShowKembalikanRiwayatModal] = useState(false);
  const [kembalikanRiwayatAlasan, setKembalikanRiwayatAlasan] = useState('');
  const [searchRiwayat, setSearchRiwayat] = useState('');
  const [filterDeptRiwayat, setFilterDeptRiwayat] = useState('semua');
  const [filterTahunArsipRiwayat, setFilterTahunArsipRiwayat] = useState('semua');
  const [filterROPRiwayat, setFilterROPRiwayat] = useState('');

  // ── Antrian Filter ────────────────────────────────────────────────────────
  const filteredAntrian = useMemo(() => {
    setCurrentPageAntrian(1);
    return antrianPencacahanList.filter(a => {
      const matchesSearch = !searchAntrian ||
        a.uraianDokumen.toLowerCase().includes(searchAntrian.toLowerCase()) ||
        a.kodeKlasifikasi.toLowerCase().includes(searchAntrian.toLowerCase());
      const matchesDept = filterDeptAntrian === 'semua' || a.penciptaArsip === filterDeptAntrian;
      const matchesTahun = filterTahunArsipAntrian === 'semua' || a.tahunArsip === filterTahunArsipAntrian;
      const matchesROP = !filterROPAntrian ||
        a.rop.toLowerCase().includes(filterROPAntrian.toLowerCase());
      return matchesSearch && matchesDept && matchesTahun && matchesROP;
    });
  }, [antrianPencacahanList, searchAntrian, filterDeptAntrian, filterTahunArsipAntrian, filterROPAntrian]);

  const totalPagesAntrian = Math.max(1, Math.ceil(filteredAntrian.length / ITEMS_PER_PAGE));
  const pagedAntrian = filteredAntrian.slice(
    (currentPageAntrian - 1) * ITEMS_PER_PAGE,
    currentPageAntrian * ITEMS_PER_PAGE
  );

  // ── Riwayat Filter ────────────────────────────────────────────────────────
  const filteredRiwayat = useMemo(() => {
    setCurrentPageRiwayat(1);
    return riwayatPemusnahanList.filter(a => {
      const matchesSearch = !searchRiwayat ||
        a.uraianDokumen.toLowerCase().includes(searchRiwayat.toLowerCase()) ||
        a.kodeKlasifikasi.toLowerCase().includes(searchRiwayat.toLowerCase());
      const matchesDept = filterDeptRiwayat === 'semua' || a.penciptaArsip === filterDeptRiwayat;
      const matchesTahun = filterTahunArsipRiwayat === 'semua' || a.tahunArsip === filterTahunArsipRiwayat;
      const matchesROP = !filterROPRiwayat ||
        a.rop.toLowerCase().includes(filterROPRiwayat.toLowerCase());
      return matchesSearch && matchesDept && matchesTahun && matchesROP;
    });
  }, [riwayatPemusnahanList, searchRiwayat, filterDeptRiwayat, filterTahunArsipRiwayat, filterROPRiwayat]);

  const totalPagesRiwayat = Math.max(1, Math.ceil(filteredRiwayat.length / ITEMS_PER_PAGE));
  const pagedRiwayat = filteredRiwayat.slice(
    (currentPageRiwayat - 1) * ITEMS_PER_PAGE,
    currentPageRiwayat * ITEMS_PER_PAGE
  );

  // ── Antrian handlers ──────────────────────────────────────────────────────
  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAntrian.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAntrian.map(a => a.id));
    }
  };

  const handleConfirmProses = () => {
    if (!prosesData.tanggal) { toast.error('Tanggal harus diisi'); return; }
    const [y, m, d] = prosesData.tanggal.split('-');
    const formattedDate = `${d}/${m}/${y}`;
    const count = selectedIds.length;
    processPencacahan(selectedIds, formattedDate, prosesData.petugas);
    setSelectedIds([]);
    setShowProsesModal(false);
    setProsesData({ tanggal: new Date().toISOString().split('T')[0], petugas: '' });
    toast.success(`Pencacahan berhasil dicatat untuk ${count} box. Data dipindahkan ke Riwayat Pemusnahan.`);
  };

  const handleKembalikanAntrian = () => {
    if (!kembalikanAntrianAlasan.trim()) { toast.error('Alasan pengembalian harus diisi'); return; }
    const count = selectedIds.length;
    returnFromPencacahan(selectedIds, kembalikanAntrianAlasan);
    setSelectedIds([]);
    setShowKembalikanAntrianModal(false);
    setKembalikanAntrianAlasan('');
    toast.success(`${count} box berhasil dikembalikan ke TPS`);
  };

  const selectedBoxes = antrianPencacahanList.filter(a => selectedIds.includes(a.id));
  // Removed - not needed

  // ── Riwayat handlers ──────────────────────────────────────────────────────
  const handleRiwayatCheckboxChange = (id: string) => {
    setSelectedRiwayatIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAllRiwayat = () => {
    if (selectedRiwayatIds.length === filteredRiwayat.length) {
      setSelectedRiwayatIds([]);
    } else {
      setSelectedRiwayatIds(filteredRiwayat.map(a => a.id));
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/octet-stream' },
        credentials: 'same-origin',
      });
      if (!res.ok) {
        throw new Error('Gagal mengunduh file');
      }
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error(error);
      toast.error('Ekspor gagal. Silakan coba lagi.');
    }
  };

  const collectExportQuery = () => {
    const params = new URLSearchParams();
    params.set('tahun_operasional', tahunOperasional);
    if (searchRiwayat.trim()) params.set('search', searchRiwayat.trim());
    if (filterDeptRiwayat && filterDeptRiwayat !== 'semua') params.set('pencipta_arsip', filterDeptRiwayat);
    if (filterTahunArsipRiwayat && filterTahunArsipRiwayat !== 'semua') params.set('tahun_arsip', filterTahunArsipRiwayat);
    if (filterROPRiwayat.trim()) params.set('rop', filterROPRiwayat.trim());
    return params.toString();
  };

  const handleEksporExcel = () => {
    const query = collectExportQuery();
    downloadFile(`/api/arsip/export-excel?${query}`, `riwayat-pemusnahan-${tahunOperasional}.xlsx`);
  };

  const handleEksporPDF = () => {
    const query = collectExportQuery();
    downloadFile(`/api/arsip/export-pdf?${query}`, `riwayat-pemusnahan-${tahunOperasional}.pdf`);
  };

  return (
    <div>
      <h1 className="text-[19px] font-bold text-gray-800 mb-3">Pencacahan Arsip</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total Box Dalam Antrian Pencacahan</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-orange-600">{antrianPencacahanList.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
          <div className="text-[9.5px] text-gray-400 mt-0.5">Semua berstatus Siap Dicacah</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Box Terpilih</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-blue-600">{selectedIds.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
          {selectedIds.length > 0 && (
            <div className="text-[9.5px] text-gray-400 mt-0.5"></div>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total Box Sudah Dimusnahkan</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-green-600">{riwayatPemusnahanList.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
          <div className="text-[9.5px] text-gray-400 mt-0.5">Tahun {tahunOperasional}</div>
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
          {antrianPencacahanList.length > 0 && (
            <span className="ml-1.5 inline-block px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] rounded-full">
              {antrianPencacahanList.length}
            </span>
          )}
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
          {riwayatPemusnahanList.length > 0 && (
            <span className="ml-1.5 inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full">
              {riwayatPemusnahanList.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Tab Antrian ─────────────────────────────────────────────────────── */}
      {activeTab === 'antrian' && (
        <div>
          {/* Filters */}
          <div className="grid grid-cols-5 gap-2 mb-2.5">
            <input
              type="text"
              placeholder="Cari nama dokumen..."
              value={searchAntrian}
              onChange={e => setSearchAntrian(e.target.value)}
              className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={filterDeptAntrian}
              onChange={e => setFilterDeptAntrian(e.target.value)}
              className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="semua">Pencipta Arsip - Semua</option>
              {DEP_DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={filterTahunArsipAntrian}
              onChange={e => setFilterTahunArsipAntrian(e.target.value)}
              className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="semua">Tahun Arsip - Semua</option>
              {Array.from(new Set(antrianPencacahanList.map(a => a.tahunArsip))).sort().map(tahun => (
                <option key={tahun} value={tahun}>{tahun}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Cari ROP..."
              value={filterROPAntrian}
              onChange={e => setFilterROPAntrian(e.target.value)}
              className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 col-span-2"
            />
          </div>

          {/* Action Bar */}
          {selectedIds.length > 0 && !isViewOnly && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mb-2.5 flex items-center justify-between">
              <span className="text-[12px] font-medium text-gray-700">
                {selectedIds.length} box dipilih
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowKembalikanAntrianModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  <ArrowLeftCircle className="w-3.5 h-3.5" />
                  Kembalikan
                </button>
                <button
                  onClick={() => setShowProsesModal(true)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1.5 text-[12px] rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors font-medium"
                >
                  Proses Pencacahan
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-3 py-2.5">
              <h2 className="text-white text-[13px] font-semibold">
                Antrian Pencacahan — {filteredAntrian.length} box
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
                          checked={selectedIds.length === filteredAntrian.length && filteredAntrian.length > 0}
                          onChange={handleSelectAll}
                          className="w-3.5 h-3.5 rounded border-gray-300"
                        />
                      </th>
                    )}
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tgl Konfirmasi</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun Arsip</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Departemen/Pencipta</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Petugas</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedAntrian.map((arsip, idx) => (
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
                      <td className="px-2.5 py-1.5 text-[11px] text-orange-600 font-medium whitespace-nowrap">
                        {arsip.tanggalKonfirmasiPencacahan || '-'}
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
                        <span className="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10.5px] font-medium rounded">
                          1 box
                        </span>
                      </td>
                      <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.petugas || '-'}</td>
                      <td className="px-2.5 py-1.5">
                        <span className="inline-block px-1.5 py-0.5 bg-green-500 text-white text-[10.5px] font-medium rounded">
                          Siap Dicacah
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredAntrian.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-[12px] text-gray-400">
                        Tidak ada data yang sesuai dengan filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPageAntrian}
              totalPages={totalPagesAntrian}
              onPageChange={setCurrentPageAntrian}
              totalItems={filteredAntrian.length}
              itemsPerPage={ITEMS_PER_PAGE}
              activeColorClass="bg-orange-600"
              unit="box"
            />
          </div>
        </div>
      )}

      {/* ── Tab Riwayat Pemusnahan ─────────────────────────────────────────── */}
      {activeTab === 'riwayat' && (
        <div>
          {/* Filters + Export */}
          <div className="flex items-center justify-between mb-2.5 gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Cari nama dokumen..."
                value={searchRiwayat}
                onChange={e => setSearchRiwayat(e.target.value)}
                className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 w-44"
              />
              <select
                value={filterDeptRiwayat}
                onChange={e => setFilterDeptRiwayat(e.target.value)}
                className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="semua">Pencipta Arsip - Semua</option>
                {DEP_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={filterTahunArsipRiwayat}
                onChange={e => setFilterTahunArsipRiwayat(e.target.value)}
                className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="semua">Tahun Arsip - Semua</option>
                {Array.from(new Set(riwayatPemusnahanList.map(a => a.tahunArsip))).sort().map(tahun => (
                  <option key={tahun} value={tahun}>{tahun}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Cari ROP..."
                value={filterROPRiwayat}
                onChange={e => setFilterROPRiwayat(e.target.value)}
                className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 w-60"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEksporExcel}
                className="flex items-center gap-1.5 bg-[#22a86e] text-white px-3 py-1.5 text-[12px] rounded-lg hover:bg-[#1d8f5e] transition-colors font-medium"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Ekspor Excel
              </button>
              <button
                onClick={handleEksporPDF}
                className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 text-[12px] rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                Ekspor PDF
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#22a86e] px-3 py-2.5 flex items-center justify-between">
              <h2 className="text-white text-[13px] font-semibold">
                Riwayat Pemusnahan — {filteredRiwayat.length} box
              </h2>
              <span className="text-[10.5px] text-white/80">Tahun Operasional {tahunOperasional}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2.5 py-2 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedRiwayatIds.length === filteredRiwayat.length && filteredRiwayat.length > 0}
                        onChange={handleSelectAllRiwayat}
                        className="w-3.5 h-3.5 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700 w-10">No</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700 whitespace-nowrap">Tanggal Dimusnahkan</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700 whitespace-nowrap">Tahun Operasional</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700 whitespace-nowrap">Pencipta Arsip</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Petugas</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRiwayat.map((arsip, idx) => {
                    const rowNum = (currentPageRiwayat - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <tr
                        key={arsip.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          selectedRiwayatIds.includes(arsip.id) ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                        }`}
                      >
                        <td className="px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            checked={selectedRiwayatIds.includes(arsip.id)}
                            onChange={() => handleRiwayatCheckboxChange(arsip.id)}
                            className="w-3.5 h-3.5 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-2.5 py-1.5 text-[11px] text-gray-500">{rowNum}</td>
                        <td className="px-2.5 py-1.5 text-[11px] text-[#22a86e] font-medium whitespace-nowrap">
                          {arsip.tanggalDimusnahkan}
                        </td>
                        <td className="px-2.5 py-1.5 text-[11px] text-gray-700 text-center">
                          {arsip.tahunOperasional}
                        </td>
                        <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono whitespace-nowrap">
                          {arsip.kodeKlasifikasi}
                        </td>
                        <td className="px-2.5 py-1.5 text-[11px] text-gray-800 line-clamp-2 leading-[1.3]" style={{ minWidth: '180px' }}>
                          {arsip.uraianDokumen}
                        </td>
                        <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                        <td className="px-2.5 py-1.5 text-[10.5px] text-gray-500">{arsip.rop}</td>
                        <td className="px-2.5 py-1.5">
                          <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[10.5px] font-medium rounded">
                            1 box
                          </span>
                        </td>
                        <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.petugas}</td>
                      </tr>
                    );
                  })}
                  {filteredRiwayat.length === 0 && (
                    <tr>
                      <td colSpan={11} className="px-4 py-8 text-center text-[12px] text-gray-400">
                        Tidak ada data yang sesuai dengan filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPageRiwayat}
              totalPages={totalPagesRiwayat}
              onPageChange={setCurrentPageRiwayat}
              totalItems={filteredRiwayat.length}
              itemsPerPage={ITEMS_PER_PAGE}
              activeColorClass="bg-[#22a86e]"
              unit="box"
            />
          </div>
        </div>
      )}

      {/* ── Modal Proses Pencacahan ──────────────────────────────────────────── */}
      {showProsesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-5 py-4">
              <h2 className="text-[15px] font-bold text-white">Proses Pencacahan</h2>
              <p className="text-[10.5px] text-orange-200 mt-0.5">Arsip akan dipindahkan ke Riwayat Pemusnahan</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-gray-500">Box Dipilih</div>
                  <div className="text-[18px] font-bold text-orange-700">{selectedIds.length} box</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Total Berkas</div>
                  <div className="text-[18px] font-bold text-orange-700"></div>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Tanggal Pencacahan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={prosesData.tanggal}
                  onChange={e => setProsesData({ ...prosesData, tanggal: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Petugas Pencacah</label>
                <select
                  value={prosesData.petugas}
                  onChange={e => setProsesData({ ...prosesData, petugas: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Gunakan petugas yang sudah ditetapkan</option>
                  {pegawaiList.map(p => (
                    <option key={p.id} value={p.nama}>{p.nama}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowProsesModal(false); setProsesData({ tanggal: new Date().toISOString().split('T')[0], petugas: '' }); }}
                  className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmProses}
                  className="flex-1 px-3 py-2 text-[12px] bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Ya, Proses Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Kembalikan ke TPS ──────────────────────────────────────────── */}
      {showKembalikanAntrianModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-700 px-5 py-4">
              <h2 className="text-[15px] font-bold text-white">Konfirmasi Pengembalian ke TPS</h2>
              <p className="text-[10.5px] text-red-200 mt-0.5">Arsip akan dikembalikan ke Temporary Storage</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-gray-500">Box Dipilih</div>
                  <div className="text-[18px] font-bold text-red-600">{selectedIds.length} box</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Total Berkas</div>
                  <div className="text-[18px] font-bold text-red-600"></div>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Alasan Pengembalian <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={kembalikanAntrianAlasan}
                  onChange={e => setKembalikanAntrianAlasan(e.target.value)}
                  placeholder="Tuliskan alasan pengembalian ke TPS..."
                  rows={3}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowKembalikanAntrianModal(false); setKembalikanAntrianAlasan(''); }}
                  className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleKembalikanAntrian}
                  className="flex-1 px-3 py-2 text-[12px] bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Simpan Pengembalian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Kembalikan Riwayat ke Pencacahan ──────────────────────────── */}
      {showKembalikanRiwayatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-4">
              <h2 className="text-[15px] font-bold text-white">Konfirmasi Koreksi Riwayat</h2>
              <p className="text-[10.5px] text-amber-100 mt-0.5">Data akan dikembalikan ke Antrian Pencacahan</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-gray-500">Box Dipilih</div>
                    <div className="text-[18px] font-bold text-amber-700">{selectedRiwayatIds.length} box</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500">Kembalikan ke</div>
                    <div className="text-[13px] font-semibold text-amber-700">Pencacahan</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Alasan Koreksi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={kembalikanRiwayatAlasan}
                  onChange={e => setKembalikanRiwayatAlasan(e.target.value)}
                  placeholder="Tuliskan alasan koreksi riwayat..."
                  rows={3}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowKembalikanRiwayatModal(false); setKembalikanRiwayatAlasan(''); }}
                  className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleKembalikanRiwayat}
                  className="flex-1 px-3 py-2 text-[12px] bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Simpan Koreksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
