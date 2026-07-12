import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2, Plus, Eye, Download, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation, Link } from 'react-router';
import { RoleManagement } from './RoleManagement';

type RoleType = 'Admin' | 'Arsiparis Umum' | 'Petugas Pencacahan';

interface PegawaiWithRole {
  id: string;
  nama: string;
  nomor: string;
  jabatan: string;
  unit: string;
  jumlah: number;
  avatar: string;
  role: RoleType;
}

export function DataPegawai() {
  const { pegawaiList, riwayatPemusnahanList, addPegawai, updatePegawai, deletePegawai } = useAppContext();
  const { user } = useAuth();
  const location = useLocation();
  const userRole = user?.role || 'admin';
  const isAdmin = userRole === 'admin';

  // Determine active submenu based on route
  const isRolePage = location.pathname === '/pegawai/role';
  const activeTab = isRolePage ? 'role' : 'pegawai';

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<PegawaiWithRole | null>(null);
  const [editData, setEditData] = useState({ nama: '', nomor: '', jabatan: '', unit: '' });
  const [addData, setAddData] = useState({ nama: '', nomor: '', jabatan: '', unit: '', role: 'Arsiparis Umum' as RoleType });

  const handleLihatDetail = (pegawai: PegawaiWithRole) => {
    setSelectedPegawai(pegawai);
    setShowDetailModal(true);
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/octet-stream' },
        credentials: 'same-origin',
      });

      if (!res.ok) {
        let errorMessage = `Gagal mengunduh file (status ${res.status})`;

        const contentType = res.headers.get('content-type') || '';
        try {
          if (contentType.includes('application/json')) {
            const errJson = await res.json();
            errorMessage =
              errJson?.message ||
              errJson?.error ||
              JSON.stringify(errJson);
          } else {
            const errText = await res.text();
            if (errText) errorMessage = errText;
          }
        } catch {
          // body tidak bisa dibaca/di-parse, pakai fallback status code di atas
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
      const message =
        error instanceof Error ? error.message : 'Unduh Excel gagal. Silakan coba lagi.';
      toast.error(message);
    }
  };

  const handleUnduhExcel = () => {
    if (!selectedPegawai) {
      downloadFile('/api/pegawai/export', 'data-pegawai.xlsx');
      return;
    }

    downloadFile(
      `/api/pegawai/export?pegawai_id=${encodeURIComponent(selectedPegawai.id)}`,
      `riwayat-${selectedPegawai.nama.replace(/\s+/g, '-')}.xlsx`
    );
  };

  const handleEditClick = (pegawai: PegawaiWithRole) => {
    setSelectedPegawai(pegawai);
    setEditData({ nama: pegawai.nama, nomor: pegawai.nomor, jabatan: pegawai.jabatan, unit: pegawai.unit });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editData.nama || !editData.nomor || !editData.jabatan || !editData.unit) {
      toast.error('Semua field harus diisi');
      return;
    }
    if (selectedPegawai) {
      updatePegawai(selectedPegawai.id, { ...selectedPegawai, ...editData });
      setShowEditModal(false);
      toast.success('Data pegawai berhasil diperbarui');
    }
  };

  const handleSaveAdd = () => {
    if (!addData.nama || !addData.nomor || !addData.jabatan || !addData.unit) {
      toast.error('Semua field harus diisi');
      return;
    }
    addPegawai({
      id: '',
      nama: addData.nama,
      nomor: addData.nomor,
      jabatan: addData.jabatan,
      unit: addData.unit,
      jumlah: 0,
      avatar: '',
      role: addData.role,
    });
    setShowAddModal(false);
    toast.success('Pegawai baru berhasil ditambahkan');
  };

  const handleDeleteClick = (pegawai: PegawaiWithRole) => {
    setSelectedPegawai(pegawai);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPegawai) {
      deletePegawai(selectedPegawai.id);
      setShowDeleteModal(false);
      toast.success('Data pegawai berhasil dihapus');
    }
  };

  const pegawaiBoxList = selectedPegawai
    ? riwayatPemusnahanList.filter(r => r.petugas === selectedPegawai.nama)
    : [];

  const totalBoxDimusnahkan = riwayatPemusnahanList.length;
  const rataRataPerPegawai = pegawaiList.length > 0 ? Math.round(totalBoxDimusnahkan / pegawaiList.length) : 0;

  // Get current user's pegawai data for non-admin
  const currentUserPegawai = pegawaiList.find(p => p.nama === user?.nama);

  // Render different views based on role
  if (!isAdmin) {
    // Non-admin view: Data Pribadi only
    return (
      <div>
        <div className="mb-3">
          <h1 className="text-[19px] font-bold text-gray-900">Data Pegawai</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Rekap pegawai arsiparis dan dokumen yang telah dimusnahkan</p>
          <div className="mt-1 text-[10.5px] text-gray-500">
            Dashboard / Data Pegawai
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-blue-600">{pegawaiList.length}</span>
              <span className="text-[11px] text-gray-600">orang</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">Jumlah Pegawai</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-orange-600">{totalBoxDimusnahkan}</span>
              <span className="text-[11px] text-gray-600">box</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">Total Box Dimusnahkan</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-green-700">{rataRataPerPegawai}</span>
              <span className="text-[11px] text-gray-600">box/pegawai</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">Rata-rata per Pegawai</p>
          </div>
        </div>

        {/* Grafik Distribusi per Pegawai */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
          <h2 className="text-[12px] font-semibold text-gray-900 mb-0.5">Statistik Distribusi per Pegawai</h2>
          <div className="flex items-end justify-between gap-2 h-[130px] mt-2.5">
            {pegawaiList.map((pegawai) => {
              const maxJumlah = Math.max(...pegawaiList.map(p => p.jumlah), 1);
              const height = (pegawai.jumlah / maxJumlah) * 100;

              return (
                <div key={pegawai.id} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-[100px]">
                    <div
                      className="w-full bg-[#e8630a] rounded-t transition-all relative group"
                      style={{ height: `${height}%`, minHeight: height > 0 ? '8px' : '2px' }}
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10.5px] font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-3 text-[11px] text-blue-700">
          Anda hanya dapat melihat data pribadi Anda sesuai hak akses {userRole === 'arsiparis_umum' ? 'Arsiparis Umum' : 'Petugas Pencacahan'}.
        </div>

        {/* Data Pribadi Table */}
        {currentUserPegawai && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <h2 className="font-semibold text-white text-[12px]">Data Pribadi</h2>
              </div>
              <button
                onClick={() => toast.success('Export Excel berhasil')}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-[10.5px] transition-colors"
              >
                <Download className="w-3 h-3" />
                Export Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Nama Pegawai</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Nomor Pegawai</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jabatan</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Unit</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah Box Dicacah</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Hak Akses</th>
                    <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 bg-white">
                    <td className="px-2.5 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#e8630a] flex items-center justify-center text-white font-bold text-[10px]">
                          {currentUserPegawai.avatar}
                        </div>
                        <span className="text-[11px] text-gray-900 font-medium">{currentUserPegawai.nama}</span>
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5 text-[11px] text-blue-600">{currentUserPegawai.nomor}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-gray-700">{currentUserPegawai.jabatan}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-gray-700">{currentUserPegawai.unit}</td>
                    <td className="px-2.5 py-1.5">
                      <span className="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10.5px] font-semibold rounded-full">
                        {currentUserPegawai.jumlah} box
                      </span>
                    </td>
                    <td className="px-2.5 py-1.5">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        {currentUserPegawai.role}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleLihatDetail(currentUserPegawai)}
                        className="px-2 py-1 bg-blue-600 text-white text-[11px] rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Detail
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal - same for all roles */}
        {showDetailModal && selectedPegawai && (
          <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50 p-4 flex items-start justify-center">
            <div className="bg-white rounded-lg w-full max-w-4xl my-auto flex flex-col">
              <div className="flex items-start justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-800">Detail Box Dicacah — {selectedPegawai.nama}</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Daftar box arsip yang telah dicacah oleh pegawai ini</p>
                </div>
                <button
                  onClick={handleUnduhExcel}
                  className="bg-[#10b981] text-white px-3 py-1.5 rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-1.5 text-[13px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Excel
                </button>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-[52vh] flex-shrink-0">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700 w-12">No</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Tanggal</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Nama Box</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Kode Klasifikasi</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Jumlah</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pegawaiBoxList.map((box, idx) => (
                      <tr key={box.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-3 py-2 text-[13px] text-gray-600">{idx + 1}</td>
                        <td className="px-3 py-2 text-[13px] text-[#10b981] font-medium">{box.tanggalDimusnahkan}</td>
                        <td className="px-3 py-2 text-[13px] text-gray-800">{box.uraianDokumen}</td>
                        <td className="px-3 py-2 text-[13px] text-blue-600 font-mono">{box.kodeKlasifikasi}</td>
                        <td className="px-3 py-2">
                          <span className="inline-block px-2 py-0.5 bg-[#10b981] text-white text-[12px] font-medium rounded-full">
                            1 box
                          </span>
                        </td>
                        <td className="px-3 py-2 text-[13px] text-gray-600">Dicacah</td>
                      </tr>
                    ))}
                    {pegawaiBoxList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-[12px] text-gray-500">
                          Belum ada data untuk tahun operasional ini
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] text-gray-600">Total Box Dicacah oleh {selectedPegawai.nama} ({pegawaiBoxList.length} box):</span>
                  <span className="text-[20px] font-bold text-[#f97316]">{selectedPegawai.jumlah} box</span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-[13px] font-medium"
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

  // Admin view with submenu - Pegawai tab
  if (!isRolePage) {
    return (
      <div>
        <div className="mb-3">
          <h1 className="text-[19px] font-bold text-gray-900">Data Pegawai</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Rekap pegawai arsiparis dan dokumen yang telah dimusnahkan</p>
          <div className="mt-1 text-[10.5px] text-gray-500">
            Dashboard / Data Pegawai / Pegawai
          </div>
        </div>

        {/* Submenu Tabs */}
        <div className="flex gap-2 mb-3">
          <Link
            to="/pegawai"
            className={`px-4 py-2 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'pegawai'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Pegawai
          </Link>
          <Link
            to="/pegawai/role"
            className={`px-4 py-2 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'role'
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Role
          </Link>
        </div>

        <div className="flex items-center justify-end mb-3">
          <button
            onClick={() => {
              setAddData({ nama: '', nomor: '', jabatan: '', unit: '', role: 'Arsiparis Umum' });
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-[12px]"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Pegawai
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-blue-600">{pegawaiList.length}</span>
              <span className="text-[11px] text-gray-600">orang</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">Jumlah Pegawai</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-orange-600">{totalBoxDimusnahkan}</span>
              <span className="text-[11px] text-gray-600">box</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">Total Box Dimusnahkan</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-green-700">{rataRataPerPegawai}</span>
              <span className="text-[11px] text-gray-600">box/pegawai</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">Rata-rata per Pegawai</p>
          </div>
        </div>

        {/* Grafik Distribusi per Pegawai */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
          <h2 className="text-[12px] font-semibold text-gray-900 mb-0.5">Statistik Distribusi per Pegawai</h2>
          <div className="flex items-end justify-between gap-2 h-[130px] mt-2.5">
            {pegawaiList.map((pegawai) => {
              const maxJumlah = Math.max(...pegawaiList.map(p => p.jumlah), 1);
              const height = (pegawai.jumlah / maxJumlah) * 100;

              return (
                <div key={pegawai.id} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-[100px]">
                    <div
                      className="w-full bg-[#e8630a] rounded-t transition-all relative group"
                      style={{ height: `${height}%`, minHeight: height > 0 ? '8px' : '2px' }}
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10.5px] font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              <h2 className="font-semibold text-white text-[12px]">Daftar Pegawai Unit Kearsipan</h2>
            </div>
            <span className="text-[11px] text-white/90">Total: {pegawaiList.length} pegawai</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">No</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Nama Pegawai</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Nomor Pegawai</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jabatan</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Unit</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Jumlah Box Dicacah</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Hak Akses</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pegawaiList.map((pegawai, idx) => (
                  <tr key={pegawai.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                    <td className="px-2.5 py-1.5 text-[11px] text-gray-800">{idx + 1}</td>
                    <td className="px-2.5 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#e8630a] flex items-center justify-center text-white font-bold text-[10px]">
                          {pegawai.avatar}
                        </div>
                        <span className="text-[11px] text-gray-900 font-medium">{pegawai.nama}</span>
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5 text-[11px] text-blue-600">{pegawai.nomor}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-gray-700">{pegawai.jabatan}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-gray-700">{pegawai.unit}</td>
                    <td className="px-2.5 py-1.5">
                      <span className="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10.5px] font-semibold rounded-full">
                        {pegawai.jumlah} box
                      </span>
                    </td>
                    <td className="px-2.5 py-1.5">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        {pegawai.role}
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
                        <button
                          onClick={() => handleEditClick(pegawai)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit data pegawai"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pegawai)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Hapus data pegawai"
                        >
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

        {/* Modals - same as non-admin */}
        {/* Detail Modal */}
        {showDetailModal && selectedPegawai && (
          <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50 p-4 flex items-start justify-center">
            <div className="bg-white rounded-lg w-full max-w-4xl my-auto flex flex-col">
              <div className="flex items-start justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-800">Detail Box Dicacah — {selectedPegawai.nama}</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Daftar box arsip yang telah dicacah oleh pegawai ini</p>
                </div>
                <button
                  onClick={handleUnduhExcel}
                  className="bg-[#10b981] text-white px-3 py-1.5 rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-1.5 text-[13px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Excel
                </button>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-[52vh] flex-shrink-0">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700 w-12">No</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Tanggal</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Nama Box</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Kode Klasifikasi</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Jumlah</th>
                      <th className="px-3 py-2.5 text-left text-[12px] font-semibold text-gray-700">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pegawaiBoxList.map((box, idx) => (
                      <tr key={box.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-3 py-2 text-[13px] text-gray-600">{idx + 1}</td>
                        <td className="px-3 py-2 text-[13px] text-[#10b981] font-medium">{box.tanggalDimusnahkan}</td>
                        <td className="px-3 py-2 text-[13px] text-gray-800">{box.uraianDokumen}</td>
                        <td className="px-3 py-2 text-[13px] text-blue-600 font-mono">{box.kodeKlasifikasi}</td>
                        <td className="px-3 py-2">
                          <span className="inline-block px-2 py-0.5 bg-[#10b981] text-white text-[12px] font-medium rounded-full">
                            1 box
                          </span>
                        </td>
                        <td className="px-3 py-2 text-[13px] text-gray-600">Dicacah</td>
                      </tr>
                    ))}
                    {pegawaiBoxList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-[12px] text-gray-500">
                          Belum ada data untuk tahun operasional ini
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] text-gray-600">Total Box Dicacah oleh {selectedPegawai.nama} ({pegawaiBoxList.length} box):</span>
                  <span className="text-[20px] font-bold text-[#f97316]">{selectedPegawai.jumlah} box</span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-[13px] font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedPegawai && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 rounded-t-lg">
                <h2 className="text-[14px] font-bold text-white">Edit Data Pegawai</h2>
                <p className="text-[11px] text-blue-100 mt-0.5">Perbarui informasi pegawai arsiparis</p>
              </div>
              <div className="px-4 py-4">
                <div className="space-y-3">
                  {(['nama', 'nomor', 'jabatan', 'unit'] as const).map(field => (
                    <div key={field}>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1 capitalize">
                        {field === 'nomor' ? 'Nomor Pegawai' : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        value={editData[field]}
                        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                        className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-3 py-2 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedPegawai && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 rounded-t-lg">
                <h2 className="text-[14px] font-bold text-white">Hapus Data Pegawai</h2>
                <p className="text-[11px] text-red-100 mt-0.5">Konfirmasi penghapusan data</p>
              </div>
              <div className="px-4 py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-[12px] text-red-800">
                    Apakah Anda yakin ingin menghapus data pegawai <strong>{selectedPegawai.nama}</strong>?
                  </p>
                  <p className="text-[11px] text-red-700 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-3 py-2 text-[12px] bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 rounded-t-lg">
                <h2 className="text-[14px] font-bold text-white">Tambah Pegawai Baru</h2>
                <p className="text-[11px] text-blue-100 mt-0.5">Daftarkan akun pegawai baru</p>
              </div>
              <div className="px-4 py-4">
                <div className="space-y-3">
                  {(['nama', 'nomor', 'jabatan', 'unit'] as const).map(field => (
                    <div key={field}>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1 capitalize">
                        {field === 'nomor' ? 'Nomor Pegawai' : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        value={addData[field]}
                        onChange={(e) => setAddData({ ...addData, [field]: e.target.value })}
                        className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Masukkan ${field}`}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Hak Akses / Role
                    </label>
                    <select
                      value={addData.role}
                      onChange={(e) => setAddData({ ...addData, role: e.target.value as RoleType })}
                      className="w-full px-3 py-1.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Arsiparis Umum">Arsiparis Umum</option>
                      <option value="Petugas Pencacahan">Petugas Pencacahan</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveAdd}
                    className="flex-1 px-3 py-2 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin view - Role Management page
  return <RoleManagement />;
}
