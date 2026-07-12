<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('arsips', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('tanggal_entry');
            $table->string('kode_klasifikasi');
            $table->text('uraian_dokumen');
            $table->string('tahun_arsip');
            $table->string('masa_retensi');
            $table->string('pencipta_arsip');
            $table->string('rop');
            $table->integer('jumlah')->default(1);
            $table->string('tahun_operasional');
            $table->enum('status', [
                'usulan',
                'pengajuan_baru',
                'pengajuan_menunggu',
                'tps_baru',
                'tps_antrian',
                'siap_dicacah',
                'dimusnahkan'
            ])->default('usulan');
            
            // Phase details (nullable columns for transition timestamps & metadata)
            $table->string('tanggal_pengajuan')->nullable();
            $table->string('tanggal_pemindahan')->nullable();
            $table->string('tanggal_dimusnahkan')->nullable();
            $table->string('tanggal_perubahan_status_tps')->nullable();
            $table->string('tanggal_konfirmasi_pencacahan')->nullable();
            $table->string('petugas')->nullable();
            $table->text('keterangan_pengajuan')->nullable();
            $table->text('alasan_pengembalian')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arsips');
    }
};
