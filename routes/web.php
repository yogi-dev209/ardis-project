<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\ArsipController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImportArsipController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SystemSettingController;
use Illuminate\Support\Facades\Route;

// API Routes
Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth');

    Route::middleware(['auth'])->group(function () {
        Route::get('/pegawai/me', [PegawaiController::class, 'me'])
            ->middleware('auth');

        Route::get('/pegawai/export', [PegawaiController::class, 'exportExcel'])
            ->middleware('check.permission:Data Pegawai (Pegawai)');

        Route::apiResource('pegawai', PegawaiController::class)
            ->middleware('check.permission:Data Pegawai (Pegawai)');

        Route::get('/role-permissions', [RolePermissionController::class, 'index'])
            ->middleware('check.permission:Data Pegawai (Role)');
        Route::put('/role-permissions', [RolePermissionController::class, 'update'])
            ->middleware('check.permission:Data Pegawai (Role)');
        Route::post('/role-permissions/reset', [RolePermissionController::class, 'reset'])
            ->middleware('check.permission:Data Pegawai (Role)');

        Route::get('/arsip', [ArsipController::class, 'index'])
            ->middleware('check.permission:Dashboard');
        Route::post('/arsip/store', [ArsipController::class, 'store'])
            ->middleware('check.permission:Usulan Musnah,tambah');
        Route::post('/arsip/move-to-pengajuan', [ArsipController::class, 'moveToPengajuan'])
            ->middleware('check.permission:Pengajuan,approve');
        Route::post('/arsip/move-to-tps', [ArsipController::class, 'moveToTPS'])
            ->middleware('check.permission:Pengajuan,approve');
        Route::post('/arsip/move-to-pencacahan', [ArsipController::class, 'moveToPencacahan'])
            ->middleware('check.permission:Pencacahan Arsip,edit');
        Route::post('/arsip/process-pencacahan', [ArsipController::class, 'processPencacahan'])
            ->middleware('check.permission:Pencacahan Arsip,edit');
        Route::post('/arsip/update-status-pengajuan', [ArsipController::class, 'updateStatusPengajuan'])
            ->middleware('check.permission:Pengajuan,edit');
        Route::post('/arsip/export-pengajuan', [ArsipController::class, 'exportPengajuanExcel'])
            ->middleware('check.permission:Pengajuan,edit');
        Route::post('/arsip/return', [ArsipController::class, 'returnArsip'])
            ->middleware('check.permission:Pengajuan,edit');
        Route::post('/arsip/import', [ImportArsipController::class, 'import'])
            ->middleware(['check.permission:Usulan Musnah,tambah']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::put('/settings', [SystemSettingController::class, 'update']);
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->middleware('check.permission:Dashboard');
        Route::get('/arsip/export-excel', [ArsipController::class, 'exportExcel'])
            ->middleware('check.permission:Pencacahan Arsip,lihat');
        Route::get('/arsip/export-pdf', [ArsipController::class, 'exportPdf'])
            ->middleware('check.permission:Pencacahan Arsip,lihat');
    });

    // Fallback KHUSUS untuk API: kalau endpoint /api/... tidak ketemu,
    // balikin JSON 404, bukan ikut ke wildcard view('app') di bawah.
    Route::fallback(function () {
        return response()->json([
            'message' => 'Endpoint API tidak ditemukan.',
        ], 404);
    });
});

// Wildcard fallback (untuk route non-API / SPA routing)
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');