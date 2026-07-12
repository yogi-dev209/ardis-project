<?php

namespace App\Http\Controllers;

use App\Models\RolePermission;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    /**
     * Ambil matrix hak akses untuk semua role.
     * Kalau tabel masih kosong (belum pernah disimpan), kembalikan default.
     */
    public function index()
    {
        $rows = RolePermission::all()->keyBy('role');
        $defaults = RolePermission::defaultPermissions();

        $result = [];
        foreach (array_keys($defaults) as $role) {
            $result[$role] = $rows->has($role)
                ? $rows[$role]->permissions
                : $defaults[$role];
        }

        return response()->json($result);
    }

    /**
     * Simpan perubahan matrix hak akses untuk semua role sekaligus.
     * Body: { "Admin": {...}, "Arsiparis Umum": {...}, "Petugas Pencacahan": {...} }
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'permissions' => 'required|array',
        ]);

        $validRoles = array_keys(RolePermission::defaultPermissions());

        foreach ($data['permissions'] as $role => $menus) {
            if (!in_array($role, $validRoles, true)) {
                continue;
            }

            RolePermission::updateOrCreate(
                ['role' => $role],
                ['permissions' => $menus]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Hak akses berhasil disimpan.',
        ]);
    }

    /**
     * Reset matrix hak akses ke default (hapus override yang tersimpan).
     */
    public function reset()
    {
        RolePermission::query()->delete();

        return response()->json([
            'success' => true,
            'permissions' => RolePermission::defaultPermissions(),
        ]);
    }
}
