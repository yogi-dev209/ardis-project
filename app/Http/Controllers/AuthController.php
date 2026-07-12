<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Handle user login attempt.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Trim trailing/leading whitespace
        $credentials['username'] = trim($credentials['username']);
        $credentials['password'] = trim($credentials['password']);

        $remember = $request->boolean('remember', false);

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            
            $roleMap = [
                'Admin' => 'admin',
                'Arsiparis Umum' => 'arsiparis_umum',
                'Petugas Pencacahan' => 'petugas_pencacahan',
            ];

            return response()->json([
                'success' => true,
                'user' => [
                    'username' => $user->username,
                    'nama' => $user->name,
                    'jabatan' => $user->jabatan,
                    'unit' => $user->unit ?? '',
                    'email' => $user->email,
                    'role' => $roleMap[$user->role] ?? 'arsiparis_umum',
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Username atau password salah.'
        ], 401);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout.'
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function user(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(null, 401);
        }

        $roleMap = [
            'Admin' => 'admin',
            'Arsiparis Umum' => 'arsiparis_umum',
            'Petugas Pencacahan' => 'petugas_pencacahan',
        ];

        return response()->json([
            'username' => $user->username,
            'nama' => $user->name,
            'jabatan' => $user->jabatan,
            'unit' => $user->unit ?? '',
            'email' => $user->email,
            'role' => $roleMap[$user->role] ?? 'arsiparis_umum',
        ]);
    }
}
