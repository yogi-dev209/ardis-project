import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Shield, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';

type RoleType = 'Admin' | 'Arsiparis Umum' | 'Petugas Pencacahan';
type MenuKey = 'Dashboard' | 'Data Pegawai (Pegawai)' | 'Data Pegawai (Role)' | 'Usulan Musnah' | 'Pengajuan' | 'Temporary Storage (TPS)' | 'Pencacahan Arsip' | 'Riwayat Aktivitas' | 'Pengaturan';
type PermKey = 'lihat' | 'tambah' | 'edit' | 'hapus' | 'approve' | 'importExcel' | 'exportData';

type MenuPerms = Record<PermKey, boolean>;
type RolePermissions = Record<MenuKey, MenuPerms>;

const allMenus: MenuKey[] = [
  'Dashboard',
  'Data Pegawai (Pegawai)',
  'Data Pegawai (Role)',
  'Usulan Musnah',
  'Pengajuan',
  'Temporary Storage (TPS)',
  'Pencacahan Arsip',
  'Riwayat Aktivitas',
  'Pengaturan',
];

const allPerms: { key: PermKey; label: string }[] = [
  { key: 'lihat', label: 'Lihat' },
  { key: 'tambah', label: 'Tambah' },
  { key: 'edit', label: 'Edit' },
  { key: 'hapus', label: 'Hapus' },
  { key: 'approve', label: 'Approve' },
  { key: 'importExcel', label: 'Import Excel' },
  { key: 'exportData', label: 'Export Data' },
];

// Default permissions for each role
function getDefaultPermissions(): Record<RoleType, RolePermissions> {
  const result = {} as Record<RoleType, RolePermissions>;

  // Admin - Full access
  const adminPerms = {} as RolePermissions;
  for (const menu of allMenus) {
    adminPerms[menu] = {
      lihat: true,
      tambah: true,
      edit: true,
      hapus: true,
      approve: true,
      importExcel: true,
      exportData: true,
    };
  }
  result['Admin'] = adminPerms;

  // Arsiparis Umum
  const arsiparis = {} as RolePermissions;
  for (const menu of allMenus) {
    if (menu === 'Data Pegawai (Pegawai)' || menu === 'Data Pegawai (Role)') {
      // No access to these submenus
      arsiparis[menu] = {
        lihat: false,
        tambah: false,
        edit: false,
        hapus: false,
        approve: false,
        importExcel: false,
        exportData: false,
      };
    } else if (menu === 'Usulan Musnah') {
      arsiparis[menu] = {
        lihat: true,
        tambah: true,
        edit: true,
        hapus: true,
        approve: false,
        importExcel: true,
        exportData: true,
      };
    } else if (menu === 'Pengajuan') {
      arsiparis[menu] = {
        lihat: true,
        tambah: false,
        edit: true,
        hapus: false,
        approve: true,
        importExcel: false,
        exportData: true,
      };
    } else if (menu === 'Temporary Storage (TPS)' || menu === 'Pencacahan Arsip') {
      arsiparis[menu] = {
        lihat: true,
        tambah: false,
        edit: false,
        hapus: false,
        approve: false,
        importExcel: false,
        exportData: false,
      };
    } else {
      // Dashboard, Riwayat, Pengaturan - view only
      arsiparis[menu] = {
        lihat: true,
        tambah: false,
        edit: false,
        hapus: false,
        approve: false,
        importExcel: false,
        exportData: false,
      };
    }
  }
  result['Arsiparis Umum'] = arsiparis;

  // Petugas Pencacahan
  const petugas = {} as RolePermissions;
  for (const menu of allMenus) {
    if (menu === 'Data Pegawai (Pegawai)' || menu === 'Data Pegawai (Role)') {
      // No access to these submenus
      petugas[menu] = {
        lihat: false,
        tambah: false,
        edit: false,
        hapus: false,
        approve: false,
        importExcel: false,
        exportData: false,
      };
    } else if (menu === 'Usulan Musnah' || menu === 'Pengajuan') {
      // View only
      petugas[menu] = {
        lihat: true,
        tambah: false,
        edit: false,
        hapus: false,
        approve: false,
        importExcel: false,
        exportData: false,
      };
    } else if (menu === 'Temporary Storage (TPS)') {
      petugas[menu] = {
        lihat: true,
        tambah: false,
        edit: true,
        hapus: false,
        approve: false,
        importExcel: false,
        exportData: true,
      };
    } else if (menu === 'Pencacahan Arsip') {
      petugas[menu] = {
        lihat: true,
        tambah: false,
        edit: true,
        hapus: false,
        approve: false,
        importExcel: false,
        exportData: true,
      };
    } else {
      // Dashboard, Riwayat, Pengaturan - view only
      petugas[menu] = {
        lihat: true,
        tambah: false,
        edit: false,
        hapus: false,
        approve: false,
        importExcel: false,
        exportData: false,
      };
    }
  }
  result['Petugas Pencacahan'] = petugas;

  return result;
}

export function RoleManagement() {
  const { pegawaiList } = useAppContext();
  const [permissions, setPermissions] = useState<Record<RoleType, RolePermissions>>(getDefaultPermissions());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Ambil matrix hak akses dari backend saat halaman dibuka
  useEffect(() => {
    let cancelled = false;

    const loadPermissions = async () => {
      try {
        const res = await fetch('/api/role-permissions');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setPermissions(data as Record<RoleType, RolePermissions>);
          }
        }
      } catch (e) {
        console.error(e);
        toast.error('Gagal memuat hak akses dari server, menampilkan default');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPermissions();
    return () => { cancelled = true; };
  }, []);

  const roles: { key: RoleType; users: string[] }[] = [
    { key: 'Admin', users: pegawaiList.filter(p => p.role === 'Admin').map(p => p.nama) },
    { key: 'Arsiparis Umum', users: pegawaiList.filter(p => p.role === 'Arsiparis Umum').map(p => p.nama) },
    { key: 'Petugas Pencacahan', users: pegawaiList.filter(p => p.role === 'Petugas Pencacahan').map(p => p.nama) },
  ];

  const togglePermission = (role: RoleType, menu: MenuKey, perm: PermKey) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [menu]: {
          ...prev[role][menu],
          [perm]: !prev[role][menu][perm],
        },
      },
    }));
  };

  const handleReset = async () => {
    try {
      const res = await fetch('/api/role-permissions/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPermissions(data.permissions as Record<RoleType, RolePermissions>);
        toast.info('Hak akses direset ke role default');
      } else {
        toast.error('Gagal mereset hak akses');
      }
    } catch (e) {
      console.error(e);
      toast.error('Gagal mereset hak akses');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/role-permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      });
      if (res.ok) {
        toast.success('Perubahan hak akses berhasil disimpan');
      } else {
        toast.error('Gagal menyimpan perubahan hak akses');
      }
    } catch (e) {
      console.error(e);
      toast.error('Gagal menyimpan perubahan hak akses');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <h1 className="text-[19px] font-bold text-gray-900">Kelola Hak Akses Pegawai</h1>
        <p className="text-[11px] text-gray-600 mt-0.5">Atur izin akses menu dan fitur untuk setiap role</p>
        <div className="mt-1 text-[10.5px] text-gray-500">
          Dashboard / Data Pegawai / Role
        </div>
      </div>

      {/* Submenu Tabs */}
      <div className="flex gap-2 mb-3">
        <Link
          to="/pegawai"
          className="px-4 py-2 rounded-lg text-[12px] font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Pegawai
        </Link>
        <Link
          to="/pegawai/role"
          className="px-4 py-2 rounded-lg text-[12px] font-medium bg-purple-600 text-white transition-colors"
        >
          Role
        </Link>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {roles.map((role) => (
          <div key={role.key} className="bg-white rounded-lg border border-purple-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-[12px] font-bold text-purple-900">{role.key}</h3>
                <p className="text-[10px] text-purple-600">{role.users.length} pegawai</p>
              </div>
            </div>
            <div className="text-[10px] text-gray-600 leading-relaxed">
              {role.users.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 to-purple-600 px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <h2 className="font-semibold text-white text-[12px]">Matrix Hak Akses per Role</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10.5px]">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-700 w-52 border-r border-gray-200">
                  Menu
                </th>
                {allPerms.map(p => (
                  <th key={p.key} className="px-2 py-2.5 text-center font-semibold text-gray-700 border-r border-gray-200 min-w-[80px]">
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allMenus.map((menu, menuIdx) => (
                <tr key={menu} className={`border-b border-gray-100 ${menuIdx % 3 === 0 ? 'bg-white' : menuIdx % 3 === 1 ? 'bg-purple-50/30' : 'bg-blue-50/30'}`}>
                  <td className="px-3 py-2.5 font-medium text-gray-800 border-r border-gray-200">
                    {menu}
                  </td>
                  {allPerms.map(perm => (
                    <td key={perm.key} className="px-2 py-2.5 border-r border-gray-200">
                      <div className="flex flex-col gap-1">
                        {roles.map(role => (
                          <div key={role.key} className="flex items-center justify-center">
                            <label className="flex items-center gap-1.5 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={permissions[role.key][menu][perm.key]}
                                onChange={() => togglePermission(role.key, menu, perm.key)}
                                className="w-3 h-3 rounded border-gray-300 accent-purple-600 cursor-pointer"
                              />
                              <span className="text-[9px] text-gray-600 group-hover:text-gray-800">
                                {role.key === 'Admin' ? 'Adm' : role.key === 'Arsiparis Umum' ? 'Ars' : 'Pet'}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Default Role
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-[10.5px] text-purple-900">
            <span className="font-semibold">Keterangan:</span> Adm = Admin, Ars = Arsiparis Umum, Pet = Petugas Pencacahan.
            Centang checkbox untuk memberikan hak akses. Admin memiliki akses penuh ke semua menu dan fitur.
          </div>
        </div>
      </div>
    </div>
  );
}
