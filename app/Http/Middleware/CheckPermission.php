<?php

namespace App\Http\Middleware;

use App\Models\RolePermission;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $menu, string $permission = 'lihat')
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $roleName = $this->normalizeRoleName((string) $user->role);

        $permissions = RolePermission::where('role', $roleName)->first();
        $allowed = false;

        if ($permissions && isset($permissions->permissions[$menu][$permission])) {
            $allowed = (bool) $permissions->permissions[$menu][$permission];
        } else {
            $defaults = RolePermission::defaultPermissions();
            $allowed = $defaults[$roleName][$menu][$permission] ?? false;
        }

        if (! $allowed) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki izin untuk mengakses menu ini.',
            ], 403);
        }

        return $next($request);
    }

    private function normalizeRoleName(string $role): string
    {
        $normalized = strtolower(trim($role));

        return match ($normalized) {
            'admin' => 'Admin',
            'arsiparis_umum', 'arsiparis umum' => 'Arsiparis Umum',
            'petugas_pencacahan', 'petugas pencacahan' => 'Petugas Pencacahan',
            default => $role,
        };
    }
}