<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::user();

        if (!$user instanceof User) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'jabatan' => 'nullable|string',
            'unit' => 'nullable|string',
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->jabatan = $data['jabatan'] ?? $user->jabatan;
        $user->unit = $data['unit'] ?? $user->unit;
        $user->save();

        return response()->json([
            'success' => true,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'jabatan' => $user->jabatan,
                'unit' => $user->unit,
            ]
        ]);
    }
}