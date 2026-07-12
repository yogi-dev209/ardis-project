import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Pegawai {
  id: string;
  nama: string;
  nomor: string;
  jabatan: string;
  unit: string;
  jumlah: number;
  avatar: string;
  role: 'Admin' | 'Arsiparis Umum' | 'Petugas Pencacahan';
}

export interface Arsip {
  id: string;
  tanggalEntry: string;
  kodeKlasifikasi: string;
  uraianDokumen: string;
  tahunArsip: string;
  masaRetensi: string;
  penciptaArsip: string;
  rop: string;
  jumlah: number;
  tahunOperasional?: string;
  tanggalPengajuan?: string;
  tanggalPemindahan?: string;
  tanggalDimusnahkan?: string;
  petugas?: string;
  statusPengajuan?: 'baru_masuk' | 'menunggu_persetujuan';
  keteranganPengajuan?: string;
  statusTPS?: 'baru' | 'antrian';
  tanggalPerubahanStatusTPS?: string;
  statusPencacahan?: 'siap_dicacah';
  tanggalKonfirmasiPencacahan?: string;
  alasanPengembalian?: string;
}

interface AppContextType {
  tahunOperasional: string;
  setTahunOperasional: (year: string) => void;
  isChangingYear: boolean;
  pegawaiList: Pegawai[];
  usulanMusnahList: Arsip[];
  pengajuanList: Arsip[];
  tpsList: Arsip[];
  antrianPencacahanList: Arsip[];
  riwayatPemusnahanList: Arsip[];
  addUsulanMusnah: (arsip: Arsip) => Promise<boolean>;
  moveToPengajuan: (ids: string[]) => Promise<void>;
  moveToTPS: (ids: string[]) => Promise<void>;
  moveToPencacahan: (ids: string[], tanggal: string, petugas: string) => Promise<void>;
  processPencacahan: (ids: string[], tanggal: string, petugas: string) => Promise<void>;
  addPegawai: (pegawai: Pegawai) => Promise<void>;
  updatePegawai: (id: string, pegawai: Pegawai) => Promise<void>;
  deletePegawai: (id: string) => Promise<void>;
  returnToUsulan: (ids: string[]) => Promise<void>;
  returnFromTPS: (ids: string[], tujuan: 'pengajuan' | 'usulan', alasan: string) => Promise<void>;
  returnFromPencacahan: (ids: string[], alasan: string) => Promise<void>;
  returnFromRiwayat: (ids: string[], alasan: string) => Promise<void>;
  updateStatusPengajuan: (ids: string[], status: 'baru_masuk' | 'menunggu_persetujuan') => Promise<void>;
  refreshData: () => Promise<void>;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const DEP_DEPARTMENTS = [
  'Dep Keuangan',
  'Dep Pelaporan Keuangan & Manajemen',
  'Dep Akuntansi Biaya',
  'Dep Anggaran',
  'Dep Pengadaan Barang',
  'Dep Pengadaan Jasa',
  'Dep Perencanaan Pengadaan Barang/Jasa',
  'Dep Pengelolaan Persediaan Suku Cadang & Bahan Baku',
  'Dep Pengelolaan Produk',
  'Dep Pengelolaan Pelanggan',
  'Dep Administrasi Pemasaran & Penjualan',
  'Dep Operasi Pabrik I A',
  'Dep Operasi Pabrik I B',
  'Dep Operasi Pabrik II A',
  'Dep Operasi Pabrik II B',
  'Dep Pemeliharaan Mekanik I',
  'Dep Pemeliharaan Mekanik II',
  'Dep Pemeliharaan Listrik',
  'Dep Pemeliharaan Instrumen',
  'Dep Inspeksi Teknik Rotating & Khusus',
  'Dep Inspeksi Teknik Statik',
  'Dep Laboratorium',
  'Dep Keselamatan & Kesehatan Kerja',
  'Dep Lingkungan Hidup',
  'Dep Rancang Bangun',
  'Dep Riset',
  'Dep Operasional SDM',
  'Dep Manajemen & Pengembangan SDM',
  'Dep Manajemen Aset',
  'Dep Manajemen Risiko Korporasi',
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [tahunOperasional, _setTahunOperasional] = useState('2026');
  const [isChangingYear, setIsChangingYear] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const [_allUsulanMusnahList, _setAllUsulanMusnahList] = useState<Arsip[]>([]);
  const [_allPengajuanList, _setAllPengajuanList] = useState<Arsip[]>([]);
  const [_allTpsList, _setAllTpsList] = useState<Arsip[]>([]);
  const [_allAntrianPencacahanList, _setAllAntrianPencacahanList] = useState<Arsip[]>([]);
  const [_allRiwayatPemusnahanList, _setAllRiwayatPemusnahanList] = useState<Arsip[]>([]);

  const usulanMusnahList = useMemo(
    () => _allUsulanMusnahList.filter(a => a.tahunOperasional === tahunOperasional),
    [_allUsulanMusnahList, tahunOperasional]
  );
  const pengajuanList = useMemo(
    () => _allPengajuanList.filter(a => a.tahunOperasional === tahunOperasional),
    [_allPengajuanList, tahunOperasional]
  );
  const tpsList = useMemo(
    () => _allTpsList.filter(a => a.tahunOperasional === tahunOperasional),
    [_allTpsList, tahunOperasional]
  );
  const antrianPencacahanList = useMemo(
    () => _allAntrianPencacahanList.filter(a => a.tahunOperasional === tahunOperasional),
    [_allAntrianPencacahanList, tahunOperasional]
  );
  const riwayatPemusnahanList = useMemo(
    () => _allRiwayatPemusnahanList.filter(a => a.tahunOperasional === tahunOperasional),
    [_allRiwayatPemusnahanList, tahunOperasional]
  );

  const loadData = async () => {
    if (!user) {
      setPegawaiList([]);
      _setAllUsulanMusnahList([]);
      _setAllPengajuanList([]);
      _setAllTpsList([]);
      _setAllAntrianPencacahanList([]);
      _setAllRiwayatPemusnahanList([]);
      return;
    }

    try {
      const isAdmin = user.role === 'admin';

      const resArsip = await fetch('/api/arsip', {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      if (resArsip.ok) {
        const data = await resArsip.json();
        _setAllUsulanMusnahList(data.usulan ?? []);
        _setAllPengajuanList(data.pengajuan ?? []);
        _setAllTpsList(data.tps ?? []);
        _setAllAntrianPencacahanList(data.antrian ?? []);
        _setAllRiwayatPemusnahanList(data.riwayat ?? []);
      }

      const pegawaiUrl = isAdmin ? '/api/pegawai' : '/api/pegawai/me';
      const resPegawai = await fetch(pegawaiUrl, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      if (resPegawai.ok) {
        const data = await resPegawai.json();
        setPegawaiList(isAdmin ? (data ?? []) : (data ? [data] : []));
      }
    } catch (e) {
      console.error('Failed to load database data', e);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      void loadData();
    }
  }, [authLoading, user]);

  const setTahunOperasional = (year: string) => {
    setIsChangingYear(true);
    setTimeout(() => {
      _setTahunOperasional(year);
      setIsChangingYear(false);
    }, 350);
  };

  const addUsulanMusnah = async (arsip: Arsip): Promise<boolean> => {
    try {
      const res = await fetch('/api/arsip/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...arsip, tahunOperasional }),
      });
      if (res.ok) {
        await loadData();
        return true;
      }

      const responseText = await res.text();
      console.error('Gagal menyimpan usulan musnah:', res.status, responseText);
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const moveToPengajuan = async (ids: string[]) => {
    try {
      const res = await fetch('/api/arsip/move-to-pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const returnToUsulan = async (ids: string[]) => {
    try {
      const res = await fetch('/api/arsip/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, tahap_asal: 'pengajuan' }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatusPengajuan = async (ids: string[], status: 'baru_masuk' | 'menunggu_persetujuan') => {
    try {
      const res = await fetch('/api/arsip/update-status-pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const moveToTPS = async (ids: string[]) => {
    try {
      const res = await fetch('/api/arsip/move-to-tps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const returnFromTPS = async (ids: string[], tujuan: 'pengajuan' | 'usulan', alasan: string) => {
    try {
      const res = await fetch('/api/arsip/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, tahap_asal: 'tps', tujuan, alasan }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const moveToPencacahan = async (ids: string[], tanggal: string, petugas: string) => {
    try {
      const res = await fetch('/api/arsip/move-to-pencacahan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, tanggal, petugas }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const returnFromPencacahan = async (ids: string[], alasan: string) => {
    try {
      const res = await fetch('/api/arsip/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, tahap_asal: 'pencacahan', alasan }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const returnFromRiwayat = async (ids: string[], alasan: string) => {
    try {
      const res = await fetch('/api/arsip/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, tahap_asal: 'riwayat', alasan }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const processPencacahan = async (ids: string[], tanggal: string, petugas: string) => {
    try {
      const res = await fetch('/api/arsip/process-pencacahan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, tanggal, petugas }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addPegawai = async (pegawai: Pegawai) => {
    try {
      const res = await fetch('/api/pegawai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pegawai),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updatePegawai = async (id: string, pegawai: Pegawai) => {
    try {
      const res = await fetch(`/api/pegawai/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pegawai),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deletePegawai = async (id: string) => {
    try {
      const res = await fetch(`/api/pegawai/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider value={{
      tahunOperasional,
      setTahunOperasional,
      isChangingYear,
      pegawaiList,
      usulanMusnahList,
      pengajuanList,
      tpsList,
      antrianPencacahanList,
      riwayatPemusnahanList,
      addUsulanMusnah,
      moveToPengajuan,
      moveToTPS,
      moveToPencacahan,
      processPencacahan,
      addPegawai,
      updatePegawai,
      deletePegawai,
      returnToUsulan,
      returnFromTPS,
      returnFromPencacahan,
      returnFromRiwayat,
      updateStatusPengajuan,
      refreshData: loadData,
    }}>
  
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
