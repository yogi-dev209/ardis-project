import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { DEP_DEPARTMENTS } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Info, FileSpreadsheet, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';
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

const ITEMS_PER_PAGE = 20;

export function Pengajuan() {
  const { pengajuanList, returnToUsulan, moveToTPS, updateStatusPengajuan } = useAppContext();
  const { user } = useAuth();
  const isViewOnly = user?.role === 'petugas_pencacahan';
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('semua');
  const [selectedTahunArsip, setSelectedTahunArsip] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmTPS, setShowConfirmTPS] = useState(false);
  const [showConfirmReturn, setShowConfirmReturn] = useState(false);

  const filteredData = useMemo(() => {
    setCurrentPage(1);
    return pengajuanList.filter(arsip => {
      const matchesSearch = !searchQuery ||
        arsip.uraianDokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        arsip.kodeKlasifikasi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'semua' || arsip.penciptaArsip === selectedDept;
      const matchesTahun = selectedTahunArsip === 'semua' || arsip.tahunArsip === selectedTahunArsip;
      const matchesStatus = selectedStatus === 'semua' || arsip.statusPengajuan === selectedStatus;
      return matchesSearch && matchesDept && matchesTahun && matchesStatus;
    });
  }, [pengajuanList, searchQuery, selectedDept, selectedTahunArsip, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const pagedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const countMenunggu = pengajuanList.filter(a => a.statusPengajuan === 'menunggu_persetujuan').length;

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

  const handleApproveToTPS = () => {
    if (selectedIds.length === 0) return;
    setShowConfirmTPS(true);
  };

  const handleConfirmTPS = () => {
    moveToTPS(selectedIds);
    setShowConfirmTPS(false);
    setSelectedIds([]);
    toast.success(`${selectedIds.length} arsip berhasil dipindahkan ke TPS`);
  };

  const handleReturn = () => {
    if (selectedIds.length === 0) return;
    setShowConfirmReturn(true);
  };

  const handleConfirmReturn = () => {
    returnToUsulan(selectedIds);
    setShowConfirmReturn(false);
    setSelectedIds([]);
    toast.success(`${selectedIds.length} arsip berhasil dikembalikan ke Usulan Musnah`);
  };

  const downloadFile = async (url: string, filename: string, payload: unknown) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/octet-stream' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = `Gagal mengunduh file (status ${res.status})`;
        const contentType = res.headers.get('content-type') || '';
        try {
          if (contentType.includes('application/json')) {
            const errJson = await res.json();
            errorMessage = errJson?.message || errJson?.error || JSON.stringify(errJson);
          } else {
            const errText = await res.text();
            if (errText) errorMessage = errText;
          }
        } catch {
          // fallback status message
        }
        throw new Error(errorMessage);
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
      toast.error(error instanceof Error ? error.message : 'Unduh Excel gagal. Silakan coba lagi.');
      return false;
    }

    return true;
  };

  const handleUnduhPengajuan = async () => {
    if (selectedIds.length === 0) return;

    const success = await downloadFile('/api/arsip/export-pengajuan', 'daftar-pengajuan.xlsx', { ids: selectedIds });

    if (success) {
      updateStatusPengajuan(selectedIds, 'menunggu_persetujuan');
      toast.success(`File Excel berhasil diunduh. Status ${selectedIds.length} arsip diubah menjadi "Menunggu Persetujuan"`);
      setSelectedIds([]);
    }
  };

  return (
    <div>
      <h1 className="text-[19px] font-bold text-gray-800 mb-1">Pengajuan</h1>
      <p className="text-[11px] text-gray-600 mb-3">Arsip sedang dalam proses review dan persetujuan pemusnahan</p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total dalam Pengajuan</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-blue-600">{pengajuanList.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Box Terpilih</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-orange-600">{selectedIds.length}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <div className="text-[11px] text-gray-600 mb-1">Total Arsip Menunggu Persetujuan</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-yellow-600">{countMenunggu}</span>
            <span className="text-[11px] text-gray-600">box</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-blue-900 mb-1">Panduan Alur Pengajuan:</p>
            <ol className="text-[10.5px] text-blue-800 space-y-0.5 pl-4 list-decimal">
              <li>Pilih arsip yang akan diajukan dengan mencentang checkbox.</li>
              <li>Klik tombol <strong>"Unduh Daftar Pengajuan (Excel)"</strong> — status otomatis berubah menjadi <strong className="text-yellow-700">"Menunggu Persetujuan"</strong>.</li>
              <li>Gunakan filter <strong>Status: Menunggu Persetujuan</strong> untuk melihat arsip yang sudah diajukan.</li>
              <li>Setelah mendapat persetujuan, pilih arsip lalu klik <strong>"Setujui & Pindahkan ke TPS"</strong>.</li>
              <li>Untuk arsip yang ditolak, klik tombol <strong>"Kembalikan"</strong> untuk mengembalikan ke Usulan Musnah.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="grid grid-cols-5 gap-2 mb-2.5">
        <input
          type="text"
          placeholder="Cari nama dokumen..."
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
          {DEP_DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={selectedTahunArsip}
          onChange={(e) => setSelectedTahunArsip(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="semua">Tahun Arsip - Semua</option>
          {Array.from(new Set(pengajuanList.map(a => a.tahunArsip))).sort().map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ROP..."
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="semua">Status - Semua</option>
          <option value="baru_masuk">Baru Masuk</option>
          <option value="menunggu_persetujuan">Menunggu Persetujuan</option>
        </select>
      </div>

      {/* Action Buttons */}
      {selectedIds.length > 0 && !isViewOnly && (
        <div className="mb-2.5 flex items-center justify-end gap-2">
            <button
              onClick={handleUnduhPengajuan}
              className="px-3 py-1.5 border border-gray-300 text-[12px] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Unduh Daftar Pengajuan (Excel)
            </button>
            <button
              onClick={handleReturn}
              className="px-3 py-1.5 border border-red-300 text-[12px] text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              Kembalikan
            </button>
            <button
              onClick={handleApproveToTPS}
              className="px-3 py-1.5 bg-green-600 text-[12px] text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Setujui & Pindahkan ke TPS
            </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-3 py-2.5">
          <h2 className="text-white text-[13px] font-semibold">Daftar Pengajuan — {filteredData.length} box</h2>
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
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tanggal Pengajuan</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Kode Klasifikasi</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Uraian Dokumen</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Tahun Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Pencipta Arsip</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">ROP</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Status</th>
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
                  <td className="px-2.5 py-1.5 text-[11px] text-blue-600 font-medium">{arsip.tanggalPengajuan}</td>
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
                    {arsip.statusPengajuan === 'baru_masuk' && (
                      <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[10.5px] font-medium rounded">
                        Baru Masuk
                      </span>
                    )}
                    {arsip.statusPengajuan === 'menunggu_persetujuan' && (
                      <span className="inline-block px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10.5px] font-medium rounded">
                        Menunggu Persetujuan
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-[12px] text-gray-500">
                    Tidak ada data pengajuan
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
          activeColorClass="bg-blue-600"
          unit="box"
        />
      </div>

      {/* Confirm Approve to TPS Modal */}
      {showConfirmTPS && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-white">Setujui & Pindahkan ke TPS</h2>
                <p className="text-[10px] text-emerald-100 mt-0.5">Konfirmasi persetujuan arsip</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Anda akan menyetujui dan memindahkan <span className="font-bold">{selectedIds.length} box</span> ke <span className="font-bold">Temporary Storage (TPS)</span> untuk diproses lebih lanjut.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowConfirmTPS(false)} className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Batal
                </button>
                <button onClick={handleConfirmTPS} className="flex-1 px-3 py-2 text-[12px] bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                  Ya, Setujui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Return to Usulan Modal */}
      {showConfirmReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-white">Kembalikan ke Usulan Musnah</h2>
                <p className="text-[10px] text-amber-100 mt-0.5">Konfirmasi pengembalian arsip</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Anda akan mengembalikan <span className="font-bold">{selectedIds.length} box</span> ke tahap <span className="font-bold">Usulan Musnah</span>. Arsip perlu diajukan ulang untuk disetujui.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowConfirmReturn(false)} className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Batal
                </button>
                <button onClick={handleConfirmReturn} className="flex-1 px-3 py-2 text-[12px] bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium">
                  Ya, Kembalikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
