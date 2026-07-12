<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;



class SystemSettingController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::user();

        $role = strtolower(str_replace(' ', '_', (string) ($user->role ?? '')));
        if (!$user instanceof User || $role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'tahunOperasional' => 'required|string',
            'kapasitasPencacahan' => 'required|numeric',
        ]);

        // simpan ke tabel settings menggunakan query builder (updateOrInsert)
        DB::table('settings')->updateOrInsert(
            ['key' => 'tahun_operasional'],
            ['value' => $data['tahunOperasional']]
        );
        DB::table('settings')->updateOrInsert(
            ['key' => 'kapasitas_pencacahan'],
            ['value' => $data['kapasitasPencacahan']]
        );

        return response()->json(['success' => true]);
    }
}