const fs = require('fs');
const path = require('path');

const clientMockupDir = path.resolve(__dirname, '../../../client/public/images/mockups');
const serverMockupDir = path.resolve(__dirname, '../../uploads/mockups');

if (!fs.existsSync(clientMockupDir)) fs.mkdirSync(clientMockupDir, { recursive: true });
if (!fs.existsSync(serverMockupDir)) fs.mkdirSync(serverMockupDir, { recursive: true });

// SVG Mockup Generator for rich product UI screenshots
function generateMockupSvg(title, subtitle, category, themeColor1, themeColor2, badgeText, items = []) {
  const svg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#070a13" />
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${themeColor1}" />
      <stop offset="100%" stop-color="${themeColor2}" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="url(#bgGrad)" />

  <!-- Ambient Glow -->
  <circle cx="1100" cy="150" r="280" fill="${themeColor1}" opacity="0.15" filter="url(#glow)" />
  <circle cx="150" cy="600" r="240" fill="${themeColor2}" opacity="0.12" filter="url(#glow)" />

  <!-- Window Frame -->
  <rect x="40" y="40" width="1200" height="640" rx="20" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
  
  <!-- Window Header Bar -->
  <path d="M 40 60 A 20 20 0 0 1 60 40 L 1220 40 A 20 20 0 0 1 1240 60 L 1240 95 L 40 95 Z" fill="#1e293b" />
  <circle cx="70" cy="67" r="6" fill="#ef4444" />
  <circle cx="90" cy="67" r="6" fill="#f59e0b" />
  <circle cx="110" cy="67" r="6" fill="#10b981" />

  <text x="140" y="72" fill="#94a3b8" font-size="13" font-weight="600">PintarLabs Professional Suite — ${title}</text>
  <rect x="1080" y="55" width="130" height="26" rx="13" fill="${themeColor1}" opacity="0.2" />
  <text x="1145" y="72" fill="${themeColor1}" font-size="11" font-weight="700" text-anchor="middle">${badgeText}</text>

  <!-- Sidebar -->
  <rect x="40" y="95" width="220" height="585" fill="#0b1120" />
  
  <!-- App Logo in Sidebar -->
  <rect x="65" y="125" width="36" height="36" rx="10" fill="url(#primaryGrad)" />
  <text x="83" y="148" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">⚡</text>
  <text x="112" y="140" fill="#ffffff" font-size="14" font-weight="700">PintarLabs</text>
  <text x="112" y="155" fill="#64748b" font-size="10" font-weight="600">${category}</text>

  <!-- Sidebar Menu Items -->
  <g transform="translate(65, 195)">
    <rect x="0" y="0" width="170" height="38" rx="10" fill="url(#primaryGrad)" opacity="0.9" />
    <text x="40" y="24" fill="#ffffff" font-size="13" font-weight="700">📊 Dashboard Utama</text>

    <text x="40" y="68" fill="#94a3b8" font-size="13" font-weight="600">📑 Operasional & Data</text>
    <text x="40" y="112" fill="#94a3b8" font-size="13" font-weight="600">🔍 Pencarian & Filter</text>
    <text x="40" y="156" fill="#94a3b8" font-size="13" font-weight="600">🖨️ Hardware & Printer</text>
    <text x="40" y="200" fill="#94a3b8" font-size="13" font-weight="600">📈 Laporan & Analitik</text>
    <text x="40" y="244" fill="#94a3b8" font-size="13" font-weight="600">⚙️ Pengaturan Sistem</text>
  </g>

  <!-- Main Canvas Area -->
  <!-- Top Stat Cards Grid -->
  <g transform="translate(285, 125)">
    <!-- Main Title & Subtitle -->
    <text x="0" y="15" fill="#ffffff" font-size="22" font-weight="800">${title}</text>
    <text x="0" y="38" fill="#94a3b8" font-size="13" font-weight="500">${subtitle}</text>

    <!-- 3 Stat KPI Cards -->
    <g transform="translate(0, 60)">
      <!-- Card 1 -->
      <rect x="0" y="0" width="290" height="100" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
      <text x="20" y="30" fill="#94a3b8" font-size="11" font-weight="600">${items[0] ? items[0].kpiTitle : 'Status Sistem'}</text>
      <text x="20" y="65" fill="#ffffff" font-size="24" font-weight="800">${items[0] ? items[0].kpiValue : '100% Aktif'}</text>
      <text x="20" y="85" fill="#10b981" font-size="11" font-weight="600">● ${items[0] ? items[0].kpiSub : 'Local-First LAN Ready'}</text>

      <!-- Card 2 -->
      <rect x="310" y="0" width="290" height="100" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
      <text x="330" y="30" fill="#94a3b8" font-size="11" font-weight="600">${items[1] ? items[1].kpiTitle : 'Total Transaksi'}</text>
      <text x="330" y="65" fill="${themeColor1}" font-size="24" font-weight="800">${items[1] ? items[1].kpiValue : '1,420 Item'}</text>
      <text x="330" y="85" fill="#38bdf8" font-size="11" font-weight="600">↑ ${items[1] ? items[1].kpiSub : 'Real-time sync'}</text>

      <!-- Card 3 -->
      <rect x="620" y="0" width="290" height="100" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
      <text x="640" y="30" fill="#94a3b8" font-size="11" font-weight="600">${items[2] ? items[2].kpiTitle : 'Kecepatan Proses'}</text>
      <text x="640" y="65" fill="#10b981" font-size="24" font-weight="800">${items[2] ? items[2].kpiValue : '< 0.05 Detik'}</text>
      <text x="640" y="85" fill="#94a3b8" font-size="11" font-weight="600">⚡ ${items[2] ? items[2].kpiSub : 'Database Lokal Cepat'}</text>
    </g>

    <!-- Table Data Section -->
    <g transform="translate(0, 185)">
      <rect x="0" y="0" width="910" height="340" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
      
      <!-- Table Header -->
      <rect x="0" y="0" width="910" height="45" rx="16" fill="#1e293b" />
      <text x="25" y="28" fill="#cbd5e1" font-size="12" font-weight="700">KODE / REF</text>
      <text x="180" y="28" fill="#cbd5e1" font-size="12" font-weight="700">DESKRIPSI DATA</text>
      <text x="480" y="28" fill="#cbd5e1" font-size="12" font-weight="700">STATUS / KATEGORI</text>
      <text x="720" y="28" fill="#cbd5e1" font-size="12" font-weight="700">NILAI / HASIL</text>

      <!-- Row 1 -->
      <line x1="0" y1="95" x2="910" y2="95" stroke="#334155" stroke-width="0.8" />
      <text x="25" y="75" fill="#38bdf8" font-size="12" font-weight="600">${items[0] ? items[0].r1Code : 'PL-00918'}</text>
      <text x="180" y="75" fill="#ffffff" font-size="12" font-weight="600">${items[0] ? items[0].r1Desc : 'Data Operasional Terverifikasi'}</text>
      <rect x="480" y="58" width="90" height="24" rx="12" fill="#10b981" opacity="0.2" />
      <text x="525" y="74" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">SUKSES</text>
      <text x="720" y="75" fill="#ffffff" font-size="12" font-weight="700">${items[0] ? items[0].r1Val : 'Rp 1.450.000'}</text>

      <!-- Row 2 -->
      <line x1="0" y1="145" x2="910" y2="145" stroke="#334155" stroke-width="0.8" />
      <text x="25" y="125" fill="#38bdf8" font-size="12" font-weight="600">${items[1] ? items[1].r2Code : 'PL-00919'}</text>
      <text x="180" y="125" fill="#ffffff" font-size="12" font-weight="600">${items[1] ? items[1].r2Desc : 'Sinkronisasi Perangkat Keras'}</text>
      <rect x="480" y="108" width="90" height="24" rx="12" fill="${themeColor1}" opacity="0.2" />
      <text x="525" y="124" fill="${themeColor1}" font-size="11" font-weight="700" text-anchor="middle">TERHUBUNG</text>
      <text x="720" y="125" fill="#ffffff" font-size="12" font-weight="700">${items[1] ? items[1].r2Val : 'Port COM3 / LAN'}</text>

      <!-- Row 3 -->
      <line x1="0" y1="195" x2="910" y2="195" stroke="#334155" stroke-width="0.8" />
      <text x="25" y="175" fill="#38bdf8" font-size="12" font-weight="600">${items[2] ? items[2].r3Code : 'PL-00920'}</text>
      <text x="180" y="175" fill="#ffffff" font-size="12" font-weight="600">${items[2] ? items[2].r3Desc : 'Penerbitan Dokumen Otomatis'}</text>
      <rect x="480" y="158" width="90" height="24" rx="12" fill="#8b5cf6" opacity="0.2" />
      <text x="525" y="174" fill="#a78bfa" font-size="11" font-weight="700" text-anchor="middle">TERCETAK</text>
      <text x="720" y="175" fill="#ffffff" font-size="12" font-weight="700">${items[2] ? items[2].r3Val : 'PDF & Struk 80mm'}</text>

      <!-- Row 4 -->
      <line x1="0" y1="245" x2="910" y2="245" stroke="#334155" stroke-width="0.8" />
      <text x="25" y="225" fill="#38bdf8" font-size="12" font-weight="600">${items[3] ? items[3].r4Code : 'PL-00921'}</text>
      <text x="180" y="225" fill="#ffffff" font-size="12" font-weight="600">${items[3] ? items[3].r4Desc : 'Validasi Rekonsiliasi Akhir'}</text>
      <rect x="480" y="208" width="90" height="24" rx="12" fill="#10b981" opacity="0.2" />
      <text x="525" y="224" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">VALID</text>
      <text x="720" y="225" fill="#ffffff" font-size="12" font-weight="700">${items[3] ? items[3].r4Val : '100% Akurat'}</text>

      <!-- Action Button in Table Footer -->
      <rect x="730" y="280" width="155" height="38" rx="10" fill="url(#primaryGrad)" />
      <text x="807" y="304" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Export Laporan Excel</text>
    </g>
  </g>
</svg>`;
  return svg;
}

// Generate rich SVG assets for all products
const mockups = [
  // 1. Unboxing & Bisnis
  { file: 'unbox_1_dashboard.svg', title: 'PintarUnbox — Live Video Packing & Barcode Scan', subtitle: 'Stasiun Rekam Otomatis Bukti Unboxing & Packing Bebas Retur', category: 'Unboxing & E-commerce', c1: '#3b82f6', c2: '#06b6d4', badge: 'V3.2 PRO' },
  { file: 'unbox_2_scanner.svg', title: 'PintarUnbox — Barcode & Thermal Label Printer', subtitle: 'Cetak Resi Marketplace & Integrasi CCTV / Webcam HD', category: 'Unboxing & Packing', c1: '#6366f1', c2: '#8b5cf6', badge: 'HD 1080P' },
  { file: 'unbox_3_evidence.svg', title: 'PintarUnbox — Video Evidence Repository & QR', subtitle: 'Penyimpanan Arsip Bukti Rekaman Siap Kirim ke CS Marketplace', category: 'Arsip Rekaman', c1: '#10b981', c2: '#059669', badge: 'KLAIM RETUR' },
  { file: 'unbox_4_report.svg', title: 'PintarUnbox — Rekapitulasi Paket Terkirim & Berat', subtitle: 'Laporan Total Paket, Bobot Gram & Riwayat Petugas Packing', category: 'Audit Gudang', c1: '#f59e0b', c2: '#d97706', badge: 'LAPORAN' },

  { file: 'kargo_1_counter.svg', title: 'PintarKargo — Kasir Counter & Multi-Ekspedisi', subtitle: 'Cek Ongkir Otomatis JNE, J&T, SiCepat, Wahana & Pos Indonesia', category: 'Logistik & Kargo', c1: '#06b6d4', c2: '#3b82f6', badge: 'MULTI-KURIR' },
  { file: 'kargo_2_scale.svg', title: 'PintarKargo — Integrasi Timbangan Digital & Volume', subtitle: 'Koneksi Timbangan Portabel USB/COM & Rumus Volumetrik', category: 'Hardware Timbangan', c1: '#8b5cf6', c2: '#ec4899', badge: 'AUTO-WEIGHT' },
  { file: 'kargo_3_manifest.svg', title: 'PintarKargo — Surat Jalan Manifest & Pickup Kurir', subtitle: 'Cetak Surat Serah Terima Paket Driver & Resi Massal', category: 'Manifest Kiriman', c1: '#10b981', c2: '#14b8a6', badge: 'BARCODE RESI' },
  { file: 'kargo_4_commission.svg', title: 'PintarKargo — Laporan Komisi Agen & Omset Harian', subtitle: 'Perhitungan Otomatis Komisi 10-25% Tiap Ekspedisi', category: 'Keuangan Agen', c1: '#f59e0b', c2: '#ef4444', badge: 'PROFIT KOMISI' },

  // 2. Sekolah & Pendidikan
  { file: 'cbt_1_exam.svg', title: 'PintarCBT — Lembar Ujian Digital Siswa Anti-Curang', subtitle: 'Lockdown Fullscreen Browser, Deteksi Tab Pindah & Timer', category: 'Ujian Sekolah CBT', c1: '#3b82f6', c2: '#1d4ed8', badge: 'LAN OFFLINE' },
  { file: 'cbt_2_monitor.svg', title: 'PintarCBT — Live Monitoring Guru & Pengawas', subtitle: 'Pantau Status Siswa Sedang Mengerjakan, Selesai, atau Terkunci', category: 'Dashboard Pengawas', c1: '#10b981', c2: '#047857', badge: 'REAL-TIME' },
  { file: 'cbt_3_question.svg', title: 'PintarCBT — Bank Soal Multi-Tipe & Import Word', subtitle: 'Pilihan Ganda, Essay, Menjodohkan, Audio Listening & Rumus', category: 'Bank Soal Guru', c1: '#8b5cf6', c2: '#6d28d9', badge: 'MATH & AUDIO' },
  { file: 'cbt_4_analytics.svg', title: 'PintarCBT — Analisis Butir Soal & Nilai Otomatis', subtitle: 'Daya Pembeda, Tingkat Kesukaran & Export Nilai Raport Excel', category: 'Analisis Evaluasi', c1: '#f59e0b', c2: '#b45309', badge: 'REKAP NILAI' },

  { file: 'perpus_1_catalog.svg', title: 'PintarPerpus — Smart Catalog & Pencarian Buku', subtitle: 'OPAC Touchscreen, Klasifikasi Dewey DDC & Cover Digital', category: 'Perpustakaan Sekolah', c1: '#0ea5e9', c2: '#2563eb', badge: 'SLIMS READY' },
  { file: 'perpus_2_barcode.svg', title: 'PintarPerpus — Sirkulasi Peminjaman & Barcode', subtitle: 'Scan Kartu Siswa & Barcode Buku, Notifikasi Denda Otomatis', category: 'Sirkulasi Mandiri', c1: '#10b981', c2: '#059669', badge: 'CEPAT 2 DETIK' },
  { file: 'perpus_3_card.svg', title: 'PintarPerpus — Desain & Cetak Kartu Anggota', subtitle: 'Generator Kartu Anggota Berfoto & Barcode Format PVC/Kertas', category: 'Kartu Anggota', c1: '#8b5cf6', c2: '#ec4899', badge: 'CETAK MASSAL' },
  { file: 'perpus_4_report.svg', title: 'PintarPerpus — Laporan Minat Baca & Statistik Buku', subtitle: 'Grafik Pengunjung, Buku Terpopuler & Rekapitulasi Denda', category: 'Statistik Akreditasi', c1: '#f59e0b', c2: '#ea580c', badge: 'AKREDITASI A' },

  { file: 'bk_1_dashboard.svg', title: 'PintarBK — Buku Poin Pelanggaran & Prestasi Siswa', subtitle: 'Database Karakter Siswa, Rekap Poin Kedisiplinan & Prestasi', category: 'Bimbingan Konseling', c1: '#6366f1', c2: '#4f46e5', badge: 'KEDISIPLINAN' },
  { file: 'bk_2_incident.svg', title: 'PintarBK — Input Kasus & Riwayat Konseling Siswa', subtitle: 'Pencatatan Kejadian, Tindakan Guru BK & Kesepakatan Tertulis', category: 'Bimbingan Konseling', c1: '#ec4899', c2: '#be185d', badge: 'PRIVASI AMAN' },
  { file: 'bk_3_letters.svg', title: 'PintarBK — Cetak Surat Panggilan Wali Murid', subtitle: 'Template Otomatis Surat Panggilan I, II, III & Perjanjian', category: 'Surat Panggilan', c1: '#10b981', c2: '#047857', badge: 'CETAK INSTAN' },
  { file: 'bk_4_analytics.svg', title: 'PintarBK — Grafik Tren Perilaku & Raport Karakter', subtitle: 'Laporan Perkembangan Bimbingan Siswa untuk Kepala Sekolah', category: 'Laporan Konseling', c1: '#f59e0b', c2: '#d97706', badge: 'REKAP TAHUNAN' },

  // 3. Kantor & Korporat
  { file: 'asset_1_dashboard.svg', title: 'PintarAsset — Dashboard Inventaris & Nilai Buku', subtitle: 'Monitoring Aset Kantor, Lokasi Ruangan & Penanggung Jawab', category: 'Aset Perusahaan', c1: '#06b6d4', c2: '#0284c7', badge: 'INVENTARIS' },
  { file: 'asset_2_depreciation.svg', title: 'PintarAsset — Kalkulator Depresiasi Akuntansi', subtitle: 'Metode Garis Lurus & Saldo Menurun Otomatis Sesuai Pajak', category: 'Penyusutan Aset', c1: '#10b981', c2: '#059669', badge: 'PSAK / PAJAK' },
  { file: 'asset_3_qrlabel.svg', title: 'PintarAsset — Cetak Label QR Code & Barcode Aset', subtitle: 'Format Stiker Tahan Air untuk Laptop, Meja & Kendaraan', category: 'Labeling QR', c1: '#8b5cf6', c2: '#7c3aed', badge: 'THERMAL STIKER' },
  { file: 'asset_4_maintenance.svg', title: 'PintarAsset — Jadwal Servis & Mutasi Barang', subtitle: 'Riwayat Maintenance AC, Komputer, Kendaraan & Biaya Servis', category: 'Maintenance Log', c1: '#f59e0b', c2: '#b45309', badge: 'REMINDER SERVIS' },

  { file: 'surat_1_agenda.svg', title: 'PintarSurat — Buku Agenda Surat Masuk & Keluar', subtitle: 'Penomoran Otomatis, Klasifikasi Kode Surat & Upload PDF OCR', category: 'Arsip Kantor', c1: '#3b82f6', c2: '#2563eb', badge: 'TATA USAHA' },
  { file: 'surat_2_disposisi.svg', title: 'PintarSurat — Lembar Disposisi Digital Direksi', subtitle: 'Alur Disposisi Berjenjang ke Kabag/Staff & Cetak Lembar', category: 'Disposisi Digital', c1: '#10b981', c2: '#047857', badge: 'NOTIFIKASI' },
  { file: 'surat_3_search.svg', title: 'PintarSurat — Fast Full-Text Search Dokumen PDF', subtitle: 'Cari Berkas Berdasarkan Kata Kunci, Pengirim & Rentang Tanggal', category: 'Pencarian Cepat', c1: '#8b5cf6', c2: '#6d28d9', badge: 'INSTAN 1 DETIK' },
  { file: 'surat_4_report.svg', title: 'PintarSurat — Laporan Rekap Surat & Arsip Statis', subtitle: 'Rekap Ekspor Excel Surat Masuk/Keluar per Bulan & Klasifikasi', category: 'Laporan Arsip', c1: '#f59e0b', c2: '#d97706', badge: 'AUDIT BERKAS' },

  { file: 'helpdesk_1_tickets.svg', title: 'PintarHelpdesk — Antrean Tiket Masalah & SLA', subtitle: 'Monitoring Permintaan IT, Maintenance Gedung & Keluhan Staf', category: 'IT Support Kantor', c1: '#ec4899', c2: '#be185d', badge: 'SLA TRACKER' },
  { file: 'helpdesk_2_assign.svg', title: 'PintarHelpdesk — Penugasan Teknisi & Estimasi Jam', subtitle: 'Distribusi Tiket Otomatis, Status Pengerjaan & Suku Cadang', category: 'Task Teknisi', c1: '#3b82f6', c2: '#1d4ed8', badge: 'WORK ORDER' },
  { file: 'helpdesk_3_kb.svg', title: 'PintarHelpdesk — Knowledge Base Solusi Cepat', subtitle: 'Bank Solusi Mandiri untuk Masalah Printer, Jaringan & Windows', category: 'Knowledge Base', c1: '#10b981', c2: '#059669', badge: 'SELF SERVICE' },
  { file: 'helpdesk_4_csat.svg', title: 'PintarHelpdesk — Evaluasi CSAT & Laporan Kinerja', subtitle: 'Rating Kepuasan Pengguna, Rata-rata Waktu Penyelesaian', category: 'Kinerja Staf', c1: '#f59e0b', c2: '#ea580c', badge: 'RATING CSAT' },

  { file: 'visitor_1_kiosk.svg', title: 'PintarVisitor — Kiosk Tamu Touchscreen & Foto', subtitle: 'Input Data Tamu, Pengambilan Foto Kamera & Keperluan Bertemu', category: 'Resepsionis Kantor', c1: '#06b6d4', c2: '#0284c7', badge: 'KIOSK TAMU' },
  { file: 'visitor_2_badge.svg', title: 'PintarVisitor — Cetak ID Badge Tamu Thermal', subtitle: 'Cetak Stiker Pengunjung dengan Barcode Akses Masuk Gerbang', category: 'Akses Keamanan', c1: '#10b981', c2: '#047857', badge: 'THERMAL BADGE' },
  { file: 'visitor_3_wa.svg', title: 'PintarVisitor — Notifikasi WhatsApp Otomatis ke Staf', subtitle: 'Pemberitahuan Otomatis ke HP Pegawai Saat Tamu Tiba di Lobi', category: 'Notifikasi WA', c1: '#8b5cf6', c2: '#7c3aed', badge: 'GATEWAY WA' },
  { file: 'visitor_4_log.svg', title: 'PintarVisitor — Log Kehadiran Tamu & Jam Keluar', subtitle: 'Rekap Jumlah Tamu, Jam Check-out & Monitoring Keamanan Gedung', category: 'Buku Tamu Digital', c1: '#f59e0b', c2: '#b45309', badge: 'LOG HARIAN' },

  // 4. Pemerintahan Desa & Kelurahan
  { file: 'bumdes_1_pos.svg', title: 'PintarBUMDes — POS Unit Toko & Perdagangan Desa', subtitle: 'Kasir Penjualan Sembako, Pupuk, ATK & Usaha Grosir Desa', category: 'Unit Usaha Desa', c1: '#10b981', c2: '#059669', badge: 'SAK EMKM' },
  { file: 'bumdes_2_neraca.svg', title: 'PintarBUMDes — Laporan Keuangan & Neraca Desa', subtitle: 'Laba/Rugi Konsolidasi, Arus Kas, Buku Besar & Neraca BUMDes', category: 'Laporan BUMDes', c1: '#3b82f6', c2: '#1d4ed8', badge: 'STANDAR KEMENDES' },
  { file: 'bumdes_3_pad.svg', title: 'PintarBUMDes — Bagi Hasil PADesa & Deviden', subtitle: 'Perhitungan Otomatis Alokasi Dana PAD, Pengurus & Modal', category: 'Bagi Hasil Desa', c1: '#8b5cf6', c2: '#6d28d9', badge: 'PAD DESA' },
  { file: 'bumdes_4_audit.svg', title: 'PintarBUMDes — Buku Kas Pembantu & Ekspor LPJ', subtitle: 'Cetak Laporan Pertanggungjawaban Musyawarah Desa (Musdes)', category: 'LPJ Musdes', c1: '#f59e0b', c2: '#d97706', badge: 'LPJ MUSDES' },

  { file: 'bansos_1_map.svg', title: 'PintarBansos — Peta Sebaran & DTKS Warga Desa', subtitle: 'Data Terpadu Kesejahteraan Sosial, Foto Rumah & Geotagging GPS', category: 'Bansos Desa', c1: '#3b82f6', c2: '#0284c7', badge: 'DTKS KEMENSOS' },
  { file: 'bansos_2_scoring.svg', title: 'PintarBansos — Algoritma Scoring Kelayakan Warga', subtitle: 'Penilaian Bobot Rumah, Penghasilan, Tanggungan & Listrik', category: 'Scoring Cerdas', c1: '#10b981', c2: '#047857', badge: 'ANTI-SALAH SASARAN' },
  { file: 'bansos_3_dist.svg', title: 'PintarBansos — Penyaluran BLT & Scan Barcode KTP', subtitle: 'Verifikasi Pengambilan Dana Bantuan & Tanda Tangan Digital', category: 'Penyaluran BLT', c1: '#8b5cf6', c2: '#7c3aed', badge: 'VERIFIKASI KTP' },
  { file: 'bansos_4_lpj.svg', title: 'PintarBansos — Berita Acara & Rekap Penyaluran', subtitle: 'Cetak Daftar Penerima Manfaat, Kwitansi Penyaluran & Laporan', category: 'Audit Bansos', c1: '#f59e0b', c2: '#b45309', badge: 'REKAP DANA DESA' },

  { file: 'tanah_1_letterc.svg', title: 'PintarTanah — Buku Letter C Digital & Buku Tanah', subtitle: 'Pencarian Cepat Nomor Kohir, Persil, Blok & Nama Pemilik Asli', category: 'Pertanahan Desa', c1: '#06b6d4', c2: '#0284c7', badge: 'LETTER C RESMI' },
  { file: 'tanah_2_mutation.svg', title: 'PintarTanah — Riwayat Mutasi Waris & Jual Beli', subtitle: 'Pencatatan Perubahan Luas Bidang Tanah, Pemecahan & Penggabungan', category: 'Mutasi Bidang', c1: '#10b981', c2: '#059669', badge: 'HISTORI LENGKAP' },
  { file: 'tanah_3_cert.svg', title: 'PintarTanah — Surat Keterangan Riwayat Tanah (SKRT)', subtitle: 'Cetak Otomatis Surat Keterangan Tidak Sengketa & Riwayat Tanah', category: 'Surat Pertanahan', c1: '#8b5cf6', c2: '#6d28d9', badge: 'FORMAT BPN' },
  { file: 'tanah_4_map.svg', title: 'PintarTanah — Peta Blok Persil & Luas Batas Wilayah', subtitle: 'Visualisasi Batas Patok, Klasifikasi Tanah Basah / Kering', category: 'Peta Persil Desa', c1: '#f59e0b', c2: '#d97706', badge: 'PETA BLOK' }
];

console.log('Generating UI Mockup SVG Screenshots...');
mockups.forEach(m => {
  const content = generateMockupSvg(m.title, m.subtitle, m.category, m.c1, m.c2, m.badge);
  fs.writeFileSync(path.join(clientMockupDir, m.file), content, 'utf-8');
  fs.writeFileSync(path.join(serverMockupDir, m.file), content, 'utf-8');
});

console.log(`Generated ${mockups.length} UI mockup assets successfully in both client and server!`);
