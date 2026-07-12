import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FileText, LayoutDashboard, Users, Trash2, FilePlus, Lock, Settings, Cog, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ArdisLogoIcon } from './ArdisLogo';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { usulanMusnahList, pengajuanList } = useAppContext();
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutDialog(false);
  };

  const navItems = [
    {
      section: 'UTAMA',
      items: [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard', subtitle: 'Ringkasan & Statistik' },
        { path: '/pegawai', icon: Users, label: 'Data Pegawai', subtitle: 'Rekap Pegawai & Aktivitas' },
      ]
    },
    {
      section: 'ARSIP',
      items: [
        { path: '/usulan-musnah', icon: Trash2, label: 'Usulan Musnah', subtitle: 'Arsip Retensi Habis', badge: usulanMusnahList.length },
        { path: '/pengajuan', icon: FilePlus, label: 'Pengajuan', subtitle: 'Review & Persetujuan', badge: pengajuanList.length },
        { path: '/tps', icon: Lock, label: 'Temporary Storage', subtitle: 'TPS – Penampungan' },
        { path: '/pencacahan', icon: Cog, label: 'Pencacahan Arsip', subtitle: 'Proses Pemusnahan' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[50px] bg-[#1a2642] z-50 border-b-[3px] border-[#e8630a]">
        <div className="h-full px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArdisLogoIcon size={32} />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-none">ARDIS</span>
              <span className="text-[#7a9ac4] text-[9px] leading-tight">Archive Records Destruction Information System</span>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#2a3652] rounded-full text-white text-xs">
            Tahun Operasional: 2026
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-[50px] w-[220px] h-[calc(100vh-50px)] bg-[#1a2642] overflow-y-auto">
        <div className="p-2.5">
          {/* Logo Small in Sidebar */}
          <div className="mb-2 pb-2 border-b border-white/10 flex items-center justify-center">
            <ArdisLogoIcon size={24} />
          </div>

          {/* User Info */}
          <div className="mb-2.5 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#e8630a] flex items-center justify-center text-white font-bold text-[10px]">
                {user?.nama.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AA'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[11px] font-semibold truncate">{user?.nama || 'Admin Arsiparis'}</div>
                <div className="text-[#7a9ac4] text-[10px] truncate">{user?.jabatan || 'SPr II Kearsipan'}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {navItems.map((section, idx) => (
            <div key={idx} className="mb-4">
              <div className="text-[#7a9ac4] text-[10px] font-bold mb-1.5 px-1.5 uppercase tracking-wide">{section.section}</div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-2 px-2 py-2 rounded-lg transition-all
                        ${isActive ? 'bg-[#e8630a]' : 'hover:bg-white/5'}
                      `}
                    >
                      <div className="w-[26px] h-[26px] rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-semibold truncate">{item.label}</div>
                        <div className="text-[#7a9ac4] text-[10px] truncate">{item.subtitle}</div>
                      </div>
                      {item.badge !== undefined && (
                        <div className={`
                          px-1.5 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0 min-w-[24px] text-center
                          ${isActive ? 'bg-white text-[#e8630a]' : 'bg-[#e8630a] text-white'}
                        `}>
                          {item.badge}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout & Settings */}
          <div className="pt-3 border-t border-white/10 space-y-0.5">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-red-500/10 transition-all"
            >
              <div className="w-[26px] h-[26px] rounded-md bg-red-500/20 flex items-center justify-center">
                <LogOut className="w-3.5 h-3.5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-red-500 text-xs font-semibold">Keluar</div>
              </div>
            </button>

            <Link
              to="/pengaturan"
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              <div className="w-[26px] h-[26px] rounded-md bg-white/10 flex items-center justify-center">
                <Settings className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white text-xs font-semibold">Pengaturan</div>
                <div className="text-[#7a9ac4] text-[10px]">Konfigurasi Sistem</div>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[220px] mt-[50px] p-4 bg-[#f4f5f7]">
        {children}
      </main>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Keluar</h2>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin keluar?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
