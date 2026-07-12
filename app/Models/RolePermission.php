<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    protected $fillable = [
        'role',
        'permissions',
    ];

    protected function casts(): array
    {
        return [
            'permissions' => 'array',
        ];
    }

    /**
     * Daftar menu yang tersedia di aplikasi.
     */
    public const MENUS = [
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

    /**
     * Daftar permission yang tersedia per menu.
     */
    public const PERMS = [
        'lihat',
        'tambah',
        'edit',
        'hapus',
        'approve',
        'importExcel',
        'exportData',
    ];

    /**
     * Permission default per role, cerminan dari getDefaultPermissions()
     * di RoleManagement.tsx (frontend).
     */
    public static function defaultPermissions(): array
    {
        $none = array_fill_keys(self::PERMS, false);
        $all = array_fill_keys(self::PERMS, true);
        $viewOnly = array_merge($none, ['lihat' => true]);

        // Admin: akses penuh ke semua menu
        $admin = array_fill_keys(self::MENUS, $all);

        // Arsiparis Umum
        $arsiparis = [
            'Dashboard' => $viewOnly,
            'Data Pegawai (Pegawai)' => $none,
            'Data Pegawai (Role)' => $none,
            'Usulan Musnah' => array_merge($none, [
                'lihat' => true, 'tambah' => true, 'edit' => true,
                'hapus' => true, 'importExcel' => true, 'exportData' => true,
            ]),
            'Pengajuan' => array_merge($none, [
                'lihat' => true, 'edit' => true, 'approve' => true, 'exportData' => true,
            ]),
            'Temporary Storage (TPS)' => $viewOnly,
            'Pencacahan Arsip' => $viewOnly,
            'Riwayat Aktivitas' => $viewOnly,
            'Pengaturan' => $viewOnly,
        ];

        // Petugas Pencacahan
        $petugas = [
            'Dashboard' => $viewOnly,
            'Data Pegawai (Pegawai)' => $none,
            'Data Pegawai (Role)' => $none,
            'Usulan Musnah' => $viewOnly,
            'Pengajuan' => $viewOnly,
            'Temporary Storage (TPS)' => array_merge($none, [
                'lihat' => true, 'edit' => true, 'exportData' => true,
            ]),
            'Pencacahan Arsip' => array_merge($none, [
                'lihat' => true, 'edit' => true, 'exportData' => true,
            ]),
            'Riwayat Aktivitas' => $viewOnly,
            'Pengaturan' => $viewOnly,
        ];

        return [
            'Admin' => $admin,
            'Arsiparis Umum' => $arsiparis,
            'Petugas Pencacahan' => $petugas,
        ];
    }
}
