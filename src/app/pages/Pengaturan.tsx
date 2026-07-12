import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
// import { useAppContext } from '../context/AppContext'; // Disarankan jika Anda pakai context global untuk tahunOperasional

export function Pengaturan() {
  const { user, updateUser } = useAuth();
  
  // Role & Permissions
  const userRole = user?.role || 'admin';
  const isAdmin = userRole === 'admin';

  // Computed Values
  const userInitials = user?.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AA';
  // State Management
  const [isSaving, setIsSaving] = useState(false);
  
  // State: System (Admin Only)
  const [tahunOperasional, setTahunOperasional] = useState('2026');
  const [kapasitasPencacahan, setKapasitasPencacahan] = useState('25');
  
  // State: Profile
  const [namaPengguna, setNamaPengguna] = useState(user?.nama || 'Admin Arsiparis');
  const [email, setEmail] = useState(user?.email || 'admin@ardis.go.id');
  
  // State: Notifications
  const [notifRetensi, setNotifRetensi] = useState(true);
  const [notifPengajuan, setNotifPengajuan] = useState(true);
  const [laporanMingguan, setLaporanMingguan] = useState(false);

  // Sync dengan data Auth saat komponen dimuat
  useEffect(() => {
    if (user) {
      setNamaPengguna(user.nama);
      setEmail(user.email || 'admin@ardis.go.id');
    }
  }, [user]);

  const handleSave = async () => {
  setIsSaving(true);

  try {
    // Simpan Data Profil (satu-satunya yang perlu ke backend)
    const profilePayload = {
      name: namaPengguna,
      email: email,
      jabatan: user?.jabatan || '',
      unit: (user as any)?.unit || '',
    };

    const profileRes = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(profilePayload),
    });

    if (!profileRes.ok) {
      const errorData = await profileRes.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal menyimpan profil');
    }

    const profileData = await profileRes.json();
    if (profileData.success && profileData.user) {
      updateUser({
        username: user?.username || '',
        nama: profileData.user.name,
        jabatan: profileData.user.jabatan || user?.jabatan || '',
        unit: profileData.user.unit || user?.unit || '',
        email: profileData.user.email || email,
        role: user?.role || 'admin',
      });
    }

    // tahunOperasional & kapasitasPencacahan sengaja tidak dikirim ke backend
    // — cukup disimpan di state lokal (lihat komentar di deklarasi state)

    toast.success('Pengaturan berhasil disimpan');
  } catch (error: any) {
    console.error('Error saving settings:', error);
    toast.error(`Gagal menyimpan pengaturan: ${error.message}`);
  } finally {
    setIsSaving(false);
  }
};

  const handleReset = () => {
    // Kembalikan ke state awal (bukan hardcode sembarangan)
    setTahunOperasional('2026');
    setKapasitasPencacahan('25');
    setNamaPengguna(user?.nama || 'Admin Arsiparis');
    setEmail(user?.email || 'admin@ardis.go.id');
    setNotifRetensi(true);
    setNotifPengajuan(true);
    setLaporanMingguan(false);
    toast.info('Pengaturan dikembalikan ke awal');
  };

  // Komponen Toggle internal (Di-disable saat saving)
  const Toggle = ({ value, onChange, disabled }: { value: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors flex-shrink-0 focus:outline-none 
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
      ${value ? 'bg-[#f97316]' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div>
      <div className="mb-2.5">
        <h1 className="text-[16px] font-bold text-gray-800">Pengaturan</h1>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {isAdmin ? 'Konfigurasi sistem ARDIS' : 'Profil pengguna dan preferensi pribadi'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        
        {/* Card Pengaturan Umum - Admin Only */}
        {isAdmin && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-[12px] font-semibold text-gray-800">Pengaturan Umum</h2>
            <p className="text-[10px] text-gray-400 mb-2.5">Konfigurasi dasar sistem</p>

            <div className="space-y-2">
              <div>
                <label className="block text-[10.5px] font-medium text-gray-600 mb-1">Tahun Operasional</label>
                <input
                  type="text"
                  value={tahunOperasional}
                  onChange={(e) => setTahunOperasional(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-2.5 py-1.5 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f97316] disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-medium text-gray-600 mb-1">Kapasitas Pencacahan Harian (box)</label>
                <input
                  type="number"
                  value={kapasitasPencacahan}
                  onChange={(e) => setKapasitasPencacahan(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-2.5 py-1.5 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f97316] disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Card Profil Pengguna */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-[12px] font-semibold text-gray-800">Profil Pengguna</h2>
          <p className="text-[10px] text-gray-400 mb-2.5">Informasi akun aktif</p>

          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-[#f97316] flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0">
              {userInitials}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-gray-800">{user?.nama || 'Admin Arsiparis'}</div>
              <div className="text-[10px] text-gray-500">{user?.jabatan || 'Super Administrator'}</div>
              <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-orange-100 text-[#f97316] text-[9px] font-medium rounded-full border border-orange-200">
                Tahun Operasional: {tahunOperasional}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[10.5px] font-medium text-gray-600 mb-1">Nama Pengguna</label>
              <input
                type="text"
                value={namaPengguna}
                onChange={(e) => setNamaPengguna(e.target.value)}
                disabled={isSaving}
                className="w-full px-2.5 py-1.5 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f97316] disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSaving}
                className="w-full px-2.5 py-1.5 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f97316] disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Card Notifikasi */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-[12px] font-semibold text-gray-800">Notifikasi</h2>
          <p className="text-[10px] text-gray-400 mb-2.5">Konfigurasi preferensi email/sistem</p>

          <div className="space-y-0">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <div className="flex-1 pr-2">
                <div className="text-[11px] font-medium text-gray-800">Notifikasi Arsip Retensi Habis</div>
                <div className="text-[9.5px] text-gray-400 mt-0.5">Peringatan saat arsip melampaui masa retensi</div>
              </div>
              <Toggle value={notifRetensi} onChange={() => setNotifRetensi(!notifRetensi)} disabled={isSaving} />
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <div className="flex-1 pr-2">
                <div className="text-[11px] font-medium text-gray-800">Notifikasi Pengajuan Baru</div>
                <div className="text-[9.5px] text-gray-400 mt-0.5">Peringatan saat ada pengajuan baru masuk</div>
              </div>
              <Toggle value={notifPengajuan} onChange={() => setNotifPengajuan(!notifPengajuan)} disabled={isSaving} />
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex-1 pr-2">
                <div className="text-[11px] font-medium text-gray-800">Laporan Mingguan</div>
                <div className="text-[9.5px] text-gray-400 mt-0.5">Kirim ringkasan aktivitas setiap minggu</div>
              </div>
              <Toggle value={laporanMingguan} onChange={() => setLaporanMingguan(!laporanMingguan)} disabled={isSaving} />
            </div>
          </div>
        </div>

        {/* Card Informasi Sistem - Admin Only */}
        {isAdmin && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-[12px] font-semibold text-gray-800">Informasi Sistem</h2>
            <p className="text-[10px] text-gray-400 mb-2.5">Detail versi dan environment</p>

            <div className="space-y-0">
              {[
                { label: 'Versi Aplikasi', value: 'ARDIS v2.1.0' },
                { label: 'Tahun Pengembangan', value: '2026' },
                { label: 'Database', value: 'PostgreSQL 15.2' },
                { label: 'Environment', value: 'Production' },
                { label: 'Terakhir Diperbarui', value: '10 Juli 2026' },
              ].map((item, i, arr) => (
                <div key={item.label} className={`flex items-center justify-between py-1.5 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="text-[10.5px] text-gray-500">{item.label}</span>
                  <span className="text-[10.5px] font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#ea580c] transition-colors text-[11px] font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <button
          onClick={handleReset}
          disabled={isSaving}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-[11px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset ke Awal
        </button>
      </div>
    </div>
  );
}