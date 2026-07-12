<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Arsip extends Model
{
    use HasFactory;

    // Custom configuration for non-incrementing string primary key
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'tanggal_entry',
        'kode_klasifikasi',
        'uraian_dokumen',
        'tahun_arsip',
        'masa_retensi',
        'pencipta_arsip',
        'rop',
        'jumlah',
        'tahun_operasional',
        'status',
        'tanggal_pengajuan',
        'tanggal_pemindahan',
        'tanggal_dimusnahkan',
        'tanggal_perubahan_status_tps',
        'tanggal_konfirmasi_pencacahan',
        'petugas',
        'keterangan_pengajuan',
        'alasan_pengembalian',
    ];
}
