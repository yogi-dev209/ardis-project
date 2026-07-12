import { useState, useMemo, useRef } from 'react';
import { useAppContext, DEP_DEPARTMENTS } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Info, Plus, FilePlus, AlertTriangle, Upload, FileSpreadsheet, Download, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Pagination } from '../components/Pagination';

const deptList = DEP_DEPARTMENTS;

function generateMockPreviewData(tahunOp: string) {
  const y = parseInt(tahunOp);
  return [
    { no: 1, kode: 'PJ.02.03', uraian: 'Pelaksanaan Penjualan Pupuk Urea Non Subsidi Dalam Negeri', tahun: String(y - 10), pencipta: 'Dep Administrasi Pemasaran & Penjualan', rop: 'Gedung Arsip A Lt.1 Rak 01', jumlah: 6, valid: true },
    { no: 2, kode: 'PP.04.01', uraian: 'Laporan Realisasi Penjualan Bulanan', tahun: String(y - 5), pencipta: 'Dep Pengelolaan Pelanggan', rop: 'Ruang Arsip Keuangan Rak 03', jumlah: 4, valid: true },
    { no: 3, kode: 'PD.04.02', uraian: 'Proses Produksi Urea', tahun: String(y - 5), pencipta: 'Dep Operasi Pabrik I A', rop: 'Gedung Arsip B Lt.2 Rak 11', jumlah: 3, valid: true },
    { no: 4, kode: '', uraian: 'Pengadaan Bahan Baku NPK', tahun: String(y - 10), pencipta: 'Dep Pengadaan Barang', rop: '', jumlah: 5, valid: false },
    { no: 5, kode: 'EP.03.01', uraian: 'Detail Engineering Design', tahun: String(y - 10), pencipta: 'Dep Rancang Bangun', rop: 'Gedung Arsip C Lt.1 Rak 03', jumlah: 4, valid: true },
  ];
}

export function UsulanMusnah() {
  const { usulanMusnahList, addUsulanMusnah, moveToPengajuan, pengajuanList, tpsList, tahunOperasional, refreshData } = useAppContext();
  const { user } = useAuth();
  const isViewOnly = user?.role === 'petugas_pencacahan';

  const BULAN_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const getMonthFromIdDate = (dateStr: string): number | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length < 2) return null;
    return parseInt(parts[1]);
  };

  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('semua');
  const [selectedTahunArsip, setSelectedTahunArsip] = useState('semua');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedArsip, setSelectedArsip] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  // Tambahkan 'file: File' di tipe datanya
  const [importFile, setImportFile] = useState<{ file: File; name: string; rows: number } | null>(null);
  const [importPreviewVisible, setImportPreviewVisible] = useState(false);
  // Tambahkan state isImporting
  const [isImporting, setIsImporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setCurrentPage(1);
    return usulanMusnahList.filter(arsip => {
      const matchesSearch = !searchQuery ||
        arsip.uraianDokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        arsip.kodeKlasifikasi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'semua' || arsip.penciptaArsip === selectedDept;
      const matchesTahun = selectedTahunArsip === 'semua' || arsip.tahunArsip === selectedTahunArsip;
      return matchesSearch && matchesDept && matchesTahun;
    });
  }, [usulanMusnahList, searchQuery, selectedDept, selectedTahunArsip]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const pagedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const mockPreview = useMemo(() => generateMockPreviewData(tahunOperasional), [tahunOperasional]);
  const validRows = mockPreview.filter(r => r.valid).length;
  const errorRows = mockPreview.filter(r => !r.valid).length;

  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
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
    setShowConfirmModal(true);
  };

  const handleConfirmMove = () => {
    moveToPengajuan(selectedIds);
    setShowConfirmModal(false);
    setSelectedIds([]);
    toast.success(`${selectedIds.length} arsip berhasil dipindahkan ke Pengajuan`);
  };

  const handleSaveData = async () => {
    if (!newData.masaRetensi.trim()) {
      toast.error('Masa Retensi wajib diisi');
      return;
    }

    const arsip = { id: `usulan-new-${Date.now()}`, ...newData };
    const success = await addUsulanMusnah(arsip);

    if (success) {
      setShowModal(false);
      setNewData({ tanggalEntry: '', kodeKlasifikasi: '', uraianDokumen: '', tahunArsip: '', masaRetensi: '', penciptaArsip: '', rop: '', jumlah: 4 });
      toast.success('Data berhasil disimpan');
    } else {
      toast.error('Gagal menyimpan data, cek kembali isian form');
    }
  };

  // Tambahkan parameter 'file'
  const handleFileSelect = (fileName: string, file: File) => {
    const totalRows = mockPreview.length + Math.floor(Math.random() * 10) + 5;
    setImportFile({ file: file, name: fileName, rows: totalRows }); // Simpan file ke state
    setImportPreviewVisible(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      handleFileSelect(file.name, file); // Kirim file kesini
    } else {
      toast.error('Hanya file .xlsx atau .xls yang diterima');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file.name, file); // Kirim file kesini
  };

  const handleImportConfirm = async () => {
    if (!importFile?.file) return;

    setIsImporting(true); // Mulai loading
    try {
      const formData = new FormData();
      formData.append('file', importFile.file);
      formData.append('tahun_operasional', tahunOperasional);

      const res = await fetch('/api/arsip/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        await refreshData();
        toast.success(`${data.created} data berhasil diimport`);
        closeImportModal();
      } else {
        toast.error(data.message || 'Import gagal');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengimport data');
    } finally {
      setIsImporting(false); // Matikan loading
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportPreviewVisible(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };  

  const arsipRetensiHabis = tahunOperasional === '2026' ? 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[19px] font-bold text-gray-900">Usulan Musnah</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Arsip retensi habis yang diusulkan untuk dimusnahkan</p>
        </div>
        {!isViewOnly && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 text-[12px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Import Excel
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-[12px]"
            >
              <Plus className="w-3.5 h-3.5" />
              Entry Data
            </button>
          </div>
        )}
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
            <span className="text-[24px] font-bold text-blue-600">{pengajuanList.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total di TPS</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-teal-600">{tpsList.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 mb-2.5 flex items-start gap-2">
        <Info className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-orange-800">
          Arsip yang sudah melewati masa retensi. Pilih arsip yang akan diajukan untuk pemusnahan. Data ditampilkan untuk Tahun Operasional <strong>{tahunOperasional}</strong>.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-2 mb-2.5">
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
          <option value="semua">Pencipta Arsip - Semua</option>
          {deptList.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={selectedTahunArsip}
          onChange={(e) => setSelectedTahunArsip(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="semua">Tahun Arsip - Semua</option>
          {Array.from(new Set(usulanMusnahList.map(a => a.tahunArsip))).sort().map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ROP..."
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Action Button */}
      {selectedIds.length > 0 && !isViewOnly && (
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
          <h2 className="text-white text-[13px] font-semibold">Daftar Usulan Musnah — {filteredData.length} box</h2>
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
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tanggal Entry</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode Klasifikasi</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Pencipta Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((arsip, idx) => (
                <tr
                  key={arsip.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${selectedIds.includes(arsip.id) ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
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
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.tanggalEntry}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-mono">{arsip.kodeKlasifikasi}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800 line-clamp-2 leading-[1.3]" style={{ minWidth: '220px' }}>{arsip.uraianDokumen}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.tahunArsip}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{arsip.penciptaArsip}</td>
                  <td className="px-2.5 py-1.5 text-[11px] text-gray-600">{arsip.rop}</td>
                  <td className="px-2.5 py-1.5">
                    <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[10.5px] font-semibold rounded">
                      1 box
                    </span>
                  </td>
                  <td className="px-2.5 py-1.5">
                    <button
                      onClick={() => { setSelectedArsip(arsip); setShowDetailModal(true); }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Lihat detail"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={isViewOnly ? 8 : 9} className="px-4 py-6 text-center text-[12px] text-gray-500">
                    Tidak ada data usulan musnah untuk Tahun Operasional {tahunOperasional}
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
          activeColorClass="bg-orange-600"
          unit="box"
        />
      </div>

      {/* Import Excel Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl my-4 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-white">Import Data Usulan Musnah dari Excel</h2>
                  <p className="text-[11px] text-emerald-200 mt-0.5">Tahun Operasional: {tahunOperasional}</p>
                </div>
              </div>
              <button onClick={closeImportModal} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {/* Drop Zone */}
              {!importPreviewVisible ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer mb-4 ${isDragOver ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragOver ? 'text-emerald-500' : 'text-gray-400'}`} />
                  <p className="text-[13px] font-medium text-gray-700 mb-1">Seret dan lepas file Excel di sini</p>
                  <p className="text-[11px] text-gray-500 mb-3">atau klik untuk memilih file</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[12px] rounded-lg hover:bg-emerald-700 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Pilih File
                  </div>
                  <p className="text-[10.5px] text-gray-400 mt-3">Format yang diterima: .xlsx, .xls</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  {/* File Info */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3 flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-[12px] font-semibold text-gray-800">{importFile?.name}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{importFile?.rows} baris terbaca</div>
                    </div>
                    <button onClick={() => { setImportFile(null); setImportPreviewVisible(false); }} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center">
                      <div className="text-[20px] font-bold text-gray-700">{importFile?.rows}</div>
                      <div className="text-[10.5px] text-gray-500">Total Baris</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-center">
                      <div className="text-[20px] font-bold text-green-600">{validRows}</div>
                      <div className="text-[10.5px] text-green-600">Data Valid</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-center">
                      <div className="text-[20px] font-bold text-red-600">{errorRows}</div>
                      <div className="text-[10.5px] text-red-600">Data Error</div>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-1">
                    <div className="bg-gray-100 px-3 py-2 text-[11px] font-semibold text-gray-700">Preview 5 Baris Pertama</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10.5px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">No</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Kode</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Uraian</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Tahun</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Pencipta</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Jml</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockPreview.map((row) => (
                            <tr key={row.no} className={`border-b border-gray-100 ${!row.valid ? 'bg-red-50' : ''}`}>
                              <td className="px-2 py-1.5 text-gray-600">{row.no}</td>
                              <td className="px-2 py-1.5 text-blue-600 font-mono">{row.kode || <span className="text-red-500 italic">kosong</span>}</td>
                              <td className="px-2 py-1.5 text-gray-800 max-w-[160px] truncate">{row.uraian}</td>
                              <td className="px-2 py-1.5 text-gray-700">{row.tahun}</td>
                              <td className="px-2 py-1.5 text-gray-700">{row.pencipta}</td>
                              <td className="px-2 py-1.5 text-gray-700">{row.jumlah}</td>
                              <td className="px-2 py-1.5">
                                {row.valid
                                  ? <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3 h-3" /> Valid</span>
                                  : <span className="flex items-center gap-1 text-red-600"><AlertCircle className="w-3 h-3" /> Error</span>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {errorRows > 0 && (
                    <p className="text-[10.5px] text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorRows} baris memiliki error (kode arsip atau ROP kosong) dan tidak akan diimport.
                    </p>
                  )}
                </div>
              )}

              {/* Template Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold text-blue-800 mb-1">Kolom wajib dalam template:</p>
                    <p className="text-[10.5px] text-blue-700">Kode Arsip · Uraian Dokumen · Tahun · Pencipta Arsip · ROP · Jumlah</p>
                    <p className="text-[10.5px] text-blue-600 mt-1">Tahun data harus sesuai dengan Tahun Operasional <strong>{tahunOperasional}</strong></p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11px] rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                    <Download className="w-3 h-3" />
                    Download Template
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}

              <div className="flex gap-2">
                <button
                  onClick={closeImportModal}
                  disabled={isImporting}
                  className="flex-1 px-4 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                {importPreviewVisible && (
                  <button
                    onClick={() => { setImportFile(null); setImportPreviewVisible(false); }}
                    disabled={isImporting}
                    className="px-4 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ganti File
                  </button>
                )}
                <button
                  onClick={importPreviewVisible ? handleImportConfirm : () => fileInputRef.current?.click()}
                  disabled={isImporting || (importPreviewVisible && validRows === 0)}
                  className="flex-1 px-4 py-2 text-[12px] bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting
                    ? 'Mengimport...'
                    : importPreviewVisible
                      ? `Import ${validRows} Data Valid`
                      : 'Preview Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entry Data Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-[16px] font-bold text-gray-800 mb-3">Entry Data Usulan Musnah</h2>

            <div className="space-y-2.5">
              {[
                { key: 'tanggalEntry', label: 'Tanggal Entry', type: 'date' },
                { key: 'kodeKlasifikasi', label: 'Kode Klasifikasi', type: 'text', placeholder: 'Contoh: NK.01.02 atau T-123456' },
                { key: 'uraianDokumen', label: 'Uraian Dokumen', type: 'text' },
                { key: 'tahunArsip', label: 'Tahun Arsip', type: 'text' },
                { key: 'masaRetensi', label: 'Masa Retensi', type: 'text', placeholder: 'Contoh: 5 tahun' },
                { key: 'rop', label: 'ROP (Ruang/Lokasi Penyimpanan)', type: 'text', placeholder: 'Contoh: Gedung A Lt.1 Rak 5' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(newData as any)[key]}
                    onChange={(e) => setNewData({ ...newData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Pencipta Arsip</label>
                <select
                  value={newData.penciptaArsip}
                  onChange={(e) => setNewData({ ...newData, penciptaArsip: e.target.value })}
                  className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Departemen</option>
                  {deptList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
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
              <button onClick={() => setShowModal(false)} className="flex-1 px-3 py-1.5 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={handleSaveData} className="flex-1 px-3 py-1.5 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Move Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <FilePlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-white">Pindahkan ke Pengajuan</h2>
                <p className="text-[10px] text-blue-100 mt-0.5">Konfirmasi pemindahan arsip</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Anda akan memindahkan <span className="font-bold">{selectedIds.length} arsip</span> dari Usulan Musnah ke tahap <span className="font-bold">Pengajuan</span>. Arsip tidak dapat dikembalikan secara otomatis.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Batal
                </button>
                <button onClick={handleConfirmMove} className="flex-1 px-3 py-2 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Ya, Pindahkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedArsip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 rounded-t-lg">
              <h2 className="text-[14px] font-bold text-white">Detail Arsip</h2>
              <p className="text-[11px] text-blue-100 mt-0.5">Informasi lengkap dokumen arsip</p>
            </div>
            <div className="px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Tanggal Entry</label>
                  <p className="text-[12px] text-gray-800">{selectedArsip.tanggalEntry}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Kode Klasifikasi</label>
                  <p className="text-[12px] text-blue-600 font-mono">{selectedArsip.kodeKlasifikasi}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Uraian Dokumen</label>
                  <p className="text-[12px] text-gray-800">{selectedArsip.uraianDokumen}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Tahun Arsip</label>
                  <p className="text-[12px] text-gray-800">{selectedArsip.tahunArsip}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Jumlah</label>
                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-semibold rounded">1 box</span>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Pencipta Arsip</label>
                  <p className="text-[12px] text-gray-800">{selectedArsip.penciptaArsip}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">ROP (Ruang/Objek Penyimpanan)</label>
                  <p className="text-[12px] text-gray-800">{selectedArsip.rop}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-[12px] font-medium"
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
