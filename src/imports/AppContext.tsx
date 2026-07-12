import { createContext, useContext, useState, ReactNode } from 'react';

interface Pegawai {
  id: string;
  nama: string;
  nomor: string;
  jabatan: string;
  unit: string;
  jumlah: number;
  avatar: string;
}

interface Arsip {
  id: string;
  tanggalEntry: string;
  kodeKlasifikasi: string;
  uraianDokumen: string;
  tahunArsip: string;
  masaRetensi: string;
  penciptaArsip: string;
  rop: string;
  jumlah: number;
  tanggalPengajuan?: string;
  tanggalPemindahan?: string;
  tanggalDimusnahkan?: string;
  petugas?: string;
}

interface AppContextType {
  pegawaiList: Pegawai[];
  usulanMusnahList: Arsip[];
  pengajuanList: Arsip[];
  tpsList: Arsip[];
  antrianPencacahanList: Arsip[];
  riwayatPemusnahanList: Arsip[];
  addUsulanMusnah: (arsip: Arsip) => void;
  moveToPengajuan: (ids: string[]) => void;
  moveToTPS: (ids: string[]) => void;
  moveToPencacahan: (ids: string[]) => void;
  processPencacahan: (ids: string[], tanggal: string, petugas: string) => void;
  addPegawai: (pegawai: Pegawai) => void;
  updatePegawai: (id: string, pegawai: Pegawai) => void;
  deletePegawai: (id: string) => void;
  returnToUsulan: (ids: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pegawaiList] = useState<Pegawai[]>([
    { id: '1', nama: 'Dedy Dwi A', nomor: '2115454', jabatan: 'SPr II Kearsipan', unit: 'Kearsipan', jumlah: 92, avatar: 'DD' },
    { id: '2', nama: 'Ari Riski H', nomor: '2180354', jabatan: 'PI. Kearsipan', unit: 'Kearsipan', jumlah: 78, avatar: 'AR' },
    { id: '3', nama: 'Donny Ariesta P', nomor: 'K.210060', jabatan: 'Staf Kearsipan', unit: 'Kearsipan', jumlah: 85, avatar: 'DA' },
    { id: '4', nama: 'Agung', nomor: 'K.230146', jabatan: 'Staf Kearsipan', unit: 'Kearsipan', jumlah: 67, avatar: 'AG' },
    { id: '5', nama: 'Moch. Imam L', nomor: 'K.250267', jabatan: 'Staf Kearsipan', unit: 'Kearsipan', jumlah: 94, avatar: 'MI' },
    { id: '6', nama: 'Dela Mili A', nomor: 'K.250141', jabatan: 'Staf Kearsipan', unit: 'Kearsipan', jumlah: 84, avatar: 'DM' },
  ]);

  const [usulanMusnahList, setUsulanMusnahList] = useState<Arsip[]>(() => generateUsulanMusnah());
  const [pengajuanList, setPengajuanList] = useState<Arsip[]>(() => generatePengajuan());
  const [tpsList, setTpsList] = useState<Arsip[]>(() => generateTPS());
  const [antrianPencacahanList, setAntrianPencacahanList] = useState<Arsip[]>(() => generateAntrianPencacahan());
  const [riwayatPemusnahanList, setRiwayatPemusnahanList] = useState<Arsip[]>(() => generateRiwayatPemusnahan());

  const addUsulanMusnah = (arsip: Arsip) => {
    setUsulanMusnahList(prev => [arsip, ...prev]);
  };

  const moveToPengajuan = (ids: string[]) => {
    const movedArsip = usulanMusnahList.filter(a => ids.includes(a.id));
    const today = new Date().toLocaleDateString('id-ID');
    const updatedArsip = movedArsip.map(a => ({ ...a, tanggalPengajuan: today }));

    setUsulanMusnahList(prev => prev.filter(a => !ids.includes(a.id)));
    setPengajuanList(prev => [...updatedArsip, ...prev]);
  };

  const returnToUsulan = (ids: string[]) => {
    const returned = pengajuanList.filter(a => ids.includes(a.id));
    const cleaned = returned.map(({ tanggalPengajuan, ...rest }) => rest);

    setPengajuanList(prev => prev.filter(a => !ids.includes(a.id)));
    setUsulanMusnahList(prev => [...cleaned, ...prev]);
  };

  const moveToTPS = (ids: string[]) => {
    const movedArsip = pengajuanList.filter(a => ids.includes(a.id));
    const today = new Date().toLocaleDateString('id-ID');
    const updatedArsip = movedArsip.map(a => ({ ...a, tanggalPemindahan: today }));

    setPengajuanList(prev => prev.filter(a => !ids.includes(a.id)));
    setTpsList(prev => [...updatedArsip, ...prev]);
  };

  const moveToPencacahan = (ids: string[]) => {
    const movedArsip = tpsList.filter(a => ids.includes(a.id));

    setTpsList(prev => prev.filter(a => !ids.includes(a.id)));
    setAntrianPencacahanList(prev => [...movedArsip, ...prev]);
  };

  const processPencacahan = (ids: string[], tanggal: string, petugas: string) => {
    const processed = antrianPencacahanList.filter(a => ids.includes(a.id));
    const updatedArsip = processed.map(a => ({ ...a, tanggalDimusnahkan: tanggal, petugas }));

    setAntrianPencacahanList(prev => prev.filter(a => !ids.includes(a.id)));
    setRiwayatPemusnahanList(prev => [...updatedArsip, ...prev]);
  };

  const addPegawai = (pegawai: Pegawai) => {
    // Implementation
  };

  const updatePegawai = (id: string, pegawai: Pegawai) => {
    // Implementation
  };

  const deletePegawai = (id: string) => {
    // Implementation
  };

  return (
    <AppContext.Provider value={{
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

// Helper functions to generate initial data
function generateUsulanMusnah(): Arsip[] {
  const data: Arsip[] = [];
  const deptList = ['Dept Keuangan', 'Dept SDM', 'Dept Teknik', 'Dept Sekretariat', 'Dept Perencanaan', 'Dept Umum'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

  const templates = [
    (year: number) => ({
      uraian: `Laporan Keuangan ${year} ${months[randomNum(0, 5)]} s/d ${months[randomNum(6, 11)]}`,
      jumlah: 6
    }),
    (year: number) => ({
      uraian: `Surat Keputusan Kepegawaian ${year} Semester ${randomNum(1, 2)}`,
      jumlah: randomNum(4, 5)
    }),
    (year: number) => ({
      uraian: `Memo Verifikasi Pembayaran ${months[randomNum(0, 11)]} Tgl ${randomNum(1, 28)} s/d ${randomNum(1, 30)} ${year}`,
      jumlah: randomNum(3, 4)
    }),
    (year: number) => ({
      uraian: `Dokumen Pengadaan Barang ${year} Triwulan ${randomNum(1, 4)}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Arsip Kontrak Proyek ${year} Periode ${months[randomNum(0, 5)]}-${months[randomNum(6, 11)]}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Laporan Bulanan Operasional ${year} ${months[randomNum(0, 11)]}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Berkas Kepegawaian ${year} Batch ${randomNum(1, 12)}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Surat Menyurat Eksternal ${year} ${months[randomNum(0, 5)]} s/d ${months[randomNum(6, 11)]}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Dokumen Anggaran ${year} Revisi ${randomNum(1, 5)}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Laporan Tahunan ${year} Lengkap`,
      jumlah: randomNum(3, 6)
    }),
  ];

  for (let i = 0; i < 200; i++) {
    const template = templates[randomNum(0, templates.length - 1)];
    const tahunArsip = randomNum(2000, 2015);
    const boxData = template(tahunArsip);

    data.push({
      id: `usulan-${i}`,
      tanggalEntry: randomDate('2026-01-01', '2026-04-30'),
      kodeKlasifikasi: Math.random() > 0.5 ? `NK.${randomNum(10, 99)}.${randomNum(10, 99)}` : `T-${randomNum(100000, 999999)}`,
      uraianDokumen: boxData.uraian,
      tahunArsip: String(tahunArsip),
      masaRetensi: randomDate('2010-01-01', '2020-12-31'),
      penciptaArsip: deptList[randomNum(0, deptList.length - 1)],
      rop: `Gedung ${['A', 'B', 'C'][randomNum(0, 2)]} Lt.${randomNum(1, 3)} Rak ${randomNum(1, 20)}`,
      jumlah: boxData.jumlah,
    });
  }
  return data;
}

function generatePengajuan(): Arsip[] {
  const data: Arsip[] = [];
  const deptList = ['Dept Keuangan', 'Dept SDM', 'Dept Teknik', 'Dept Sekretariat', 'Dept Perencanaan', 'Dept Umum'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

  const templates = [
    (year: number) => ({
      uraian: `Laporan Keuangan ${year} ${months[randomNum(0, 5)]} s/d ${months[randomNum(6, 11)]}`,
      jumlah: 6
    }),
    (year: number) => ({
      uraian: `Surat Keputusan Kepegawaian ${year} Semester ${randomNum(1, 2)}`,
      jumlah: randomNum(4, 5)
    }),
    (year: number) => ({
      uraian: `Memo Verifikasi Pembayaran ${months[randomNum(0, 11)]} Tgl ${randomNum(1, 28)} s/d ${randomNum(1, 30)} ${year}`,
      jumlah: randomNum(3, 4)
    }),
    (year: number) => ({
      uraian: `Dokumen Pengadaan Barang ${year} Triwulan ${randomNum(1, 4)}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Berkas Kepegawaian ${year} Batch ${randomNum(1, 12)}`,
      jumlah: randomNum(3, 6)
    }),
  ];

  for (let i = 0; i < 100; i++) {
    const template = templates[randomNum(0, templates.length - 1)];
    const tahunArsip = randomNum(2000, 2015);
    const boxData = template(tahunArsip);

    data.push({
      id: `pengajuan-${i}`,
      tanggalEntry: randomDate('2026-01-01', '2026-04-30'),
      tanggalPengajuan: randomDate('2026-02-01', '2026-04-30'),
      kodeKlasifikasi: Math.random() > 0.5 ? `NK.${randomNum(10, 99)}.${randomNum(10, 99)}` : `T-${randomNum(100000, 999999)}`,
      uraianDokumen: boxData.uraian,
      tahunArsip: String(tahunArsip),
      masaRetensi: randomDate('2010-01-01', '2020-12-31'),
      penciptaArsip: deptList[randomNum(0, deptList.length - 1)],
      rop: `Gedung ${['A', 'B', 'C'][randomNum(0, 2)]} Lt.${randomNum(1, 3)} Rak ${randomNum(1, 20)}`,
      jumlah: boxData.jumlah,
    });
  }
  return data;
}

function generateTPS(): Arsip[] {
  const data: Arsip[] = [];
  const deptList = ['Dept Keuangan', 'Dept SDM', 'Dept Teknik', 'Dept Sekretariat', 'Dept Perencanaan', 'Dept Umum'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

  const templates = [
    (year: number) => ({
      uraian: `Laporan Keuangan ${year} ${months[randomNum(0, 5)]} s/d ${months[randomNum(6, 11)]}`,
      jumlah: 6
    }),
    (year: number) => ({
      uraian: `Surat Keputusan Kepegawaian ${year} Semester ${randomNum(1, 2)}`,
      jumlah: randomNum(4, 5)
    }),
    (year: number) => ({
      uraian: `Memo Verifikasi Pembayaran ${months[randomNum(0, 11)]} Tgl ${randomNum(1, 28)} s/d ${randomNum(1, 30)} ${year}`,
      jumlah: randomNum(3, 4)
    }),
    (year: number) => ({
      uraian: `Arsip Kontrak Proyek ${year} Periode ${months[randomNum(0, 5)]}-${months[randomNum(6, 11)]}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Dokumen Anggaran ${year} Revisi ${randomNum(1, 5)}`,
      jumlah: randomNum(3, 6)
    }),
  ];

  for (let i = 0; i < 100; i++) {
    const template = templates[randomNum(0, templates.length - 1)];
    const tahunArsip = randomNum(2000, 2015);
    const boxData = template(tahunArsip);

    data.push({
      id: `tps-${i}`,
      tanggalEntry: randomDate('2026-01-01', '2026-03-31'),
      tanggalPengajuan: randomDate('2026-01-15', '2026-04-15'),
      tanggalPemindahan: randomDate('2026-02-01', '2026-04-20'),
      kodeKlasifikasi: Math.random() > 0.5 ? `NK.${randomNum(10, 99)}.${randomNum(10, 99)}` : `T-${randomNum(100000, 999999)}`,
      uraianDokumen: boxData.uraian,
      tahunArsip: String(tahunArsip),
      masaRetensi: randomDate('2010-01-01', '2020-12-31'),
      penciptaArsip: deptList[randomNum(0, deptList.length - 1)],
      rop: `Gedung ${['A', 'B', 'C'][randomNum(0, 2)]} Lt.${randomNum(1, 3)} Rak ${randomNum(1, 20)}`,
      jumlah: boxData.jumlah,
    });
  }
  return data;
}

function generateAntrianPencacahan(): Arsip[] {
  const data: Arsip[] = [];
  const deptList = ['Dept Keuangan', 'Dept SDM', 'Dept Teknik', 'Dept Sekretariat', 'Dept Perencanaan', 'Dept Umum'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

  const templates = [
    (year: number) => ({
      uraian: `Laporan Keuangan ${year} ${months[randomNum(0, 5)]} s/d ${months[randomNum(6, 11)]}`,
      jumlah: 6
    }),
    (year: number) => ({
      uraian: `Surat Keputusan Kepegawaian ${year} Semester ${randomNum(1, 2)}`,
      jumlah: randomNum(4, 5)
    }),
    (year: number) => ({
      uraian: `Memo Verifikasi Pembayaran ${months[randomNum(0, 11)]} Tgl ${randomNum(1, 28)} s/d ${randomNum(1, 30)} ${year}`,
      jumlah: randomNum(3, 4)
    }),
    (year: number) => ({
      uraian: `Dokumen Pengadaan Barang ${year} Triwulan ${randomNum(1, 4)}`,
      jumlah: randomNum(3, 6)
    }),
    (year: number) => ({
      uraian: `Berkas Kepegawaian ${year} Batch ${randomNum(1, 12)}`,
      jumlah: randomNum(3, 6)
    }),
  ];

  for (let i = 0; i < 100; i++) {
    const template = templates[randomNum(0, templates.length - 1)];
    const tahunArsip = randomNum(2000, 2015);
    const boxData = template(tahunArsip);

    data.push({
      id: `antrian-${i}`,
      tanggalEntry: randomDate('2026-01-01', '2026-03-31'),
      kodeKlasifikasi: Math.random() > 0.5 ? `NK.${randomNum(10, 99)}.${randomNum(10, 99)}` : `T-${randomNum(100000, 999999)}`,
      uraianDokumen: boxData.uraian,
      tahunArsip: String(tahunArsip),
      masaRetensi: randomDate('2010-01-01', '2020-12-31'),
      penciptaArsip: deptList[randomNum(0, deptList.length - 1)],
      rop: `Gedung ${['A', 'B', 'C'][randomNum(0, 2)]} Lt.${randomNum(1, 3)} Rak ${randomNum(1, 20)}`,
      jumlah: boxData.jumlah,
    });
  }
  return data;
}

function generateRiwayatPemusnahan(): Arsip[] {
  const data: Arsip[] = [];
  const deptList = ['Dept Keuangan', 'Dept SDM', 'Dept Teknik', 'Dept Sekretariat'];
  const petugasList = ['Dedy Dwi A', 'Ari Riski H', 'Donny Ariesta P', 'Agung', 'Moch. Imam L', 'Dela Mili A'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

  const templates = [
    (year: number) => `Laporan Keuangan ${year} ${months[randomNum(0, 5)]} s/d ${months[randomNum(6, 11)]}`,
    (year: number) => `Surat Keputusan Kepegawaian ${year} Semester ${randomNum(1, 2)}`,
    (year: number) => `Memo Verifikasi Pembayaran ${months[randomNum(0, 11)]} Tgl ${randomNum(1, 28)} s/d ${randomNum(1, 30)} ${year}`,
    (year: number) => `Dokumen Pengadaan Barang ${year} Triwulan ${randomNum(1, 4)}`,
    (year: number) => `Arsip Kontrak Proyek ${year} Periode ${months[randomNum(0, 5)]}-${months[randomNum(6, 11)]}`,
    (year: number) => `Laporan Bulanan Operasional ${year} ${months[randomNum(0, 11)]}`,
    (year: number) => `Berkas Kepegawaian ${year} Batch ${randomNum(1, 12)}`,
    (year: number) => `Surat Menyurat Eksternal ${year} ${months[randomNum(0, 5)]} s/d ${months[randomNum(6, 11)]}`,
    (year: number) => `Dokumen Anggaran ${year} Revisi ${randomNum(1, 5)}`,
  ];

  const dates = [
    '2/1/2026', '3/1/2026', '6/1/2026', '9/1/2026', '13/1/2026',
    '3/2/2026', '5/2/2026', '10/2/2026', '14/2/2026', '20/2/2026',
    '5/3/2026', '10/3/2026', '15/3/2026', '20/3/2026', '25/3/2026',
    '2/4/2026', '8/4/2026', '15/4/2026', '22/4/2026', '26/4/2026',
  ];

  let counter = 0;
  for (const date of dates) {
    for (let i = 0; i < 25; i++) {
      const tahunArsip = randomNum(2000, 2015);
      const template = templates[randomNum(0, templates.length - 1)];

      data.push({
        id: `riwayat-${counter}`,
        tanggalEntry: '1/1/2026',
        tanggalDimusnahkan: date,
        tahunArsip: String(tahunArsip),
        kodeKlasifikasi: Math.random() > 0.5 ? `NK-${randomNum(100000, 999999)}` : `T-${randomNum(100000, 999999)}`,
        uraianDokumen: template(tahunArsip),
        penciptaArsip: deptList[randomNum(0, deptList.length - 1)],
        rop: `Gedung ${['A', 'B'][randomNum(0, 1)]} Lt.${randomNum(1, 3)} Rak ${randomNum(1, 15)}`,
        jumlah: 1, // Each row represents 1 box
        petugas: petugasList[randomNum(0, petugasList.length - 1)],
        masaRetensi: '',
      });
      counter++;
    }
  }

  return data;
}

function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  return date.toLocaleDateString('id-ID');
}
